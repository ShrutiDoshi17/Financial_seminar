import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

declare var Razorpay: any

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss'],
  providers: [DatePipe]
})

export class ViewEventsComponent implements OnInit {
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;

  showMessage: boolean = false;
  responseMessage: string = '';

  searchQuery: string = ''
  filteredList: any[] = []
  eventList: any[] = [];

  userId: any;
  selectedEvent: any = {};
  status: any;
  currentPage: number = 1;
  pageSize: number = 2;
  isAlreadyEnrolled: boolean = false;
  isEnrolling: boolean = false;
  isCheckingEnrollment: boolean = false;

  constructor(
    private datePipe: DatePipe,
    public router: Router,
    public httpService: HttpService,
    private authService: AuthService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    this.userId = userIdString ? parseInt(userIdString, 10) : null;
    this.getEvent();
  }

  getEvent() {
    this.httpService.viewAllEvents().subscribe({
      next: (data: any) => {
        this.eventList = data;
        this.filteredList = this.eventList;
        // Re-sync selectedEvent if one is open
        if (this.selectedEvent?.id) {
          this.refreshSelectedEvent();
        }
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load events. Please try again later.';
      }
    });
  }

  refreshSelectedEvent() {
    const updated = this.eventList.find(e => e.id === this.selectedEvent.id);
    if (updated) {
      this.selectedEvent = updated;
    }
  }

  viewDetails(event: any) {
    this.selectedEvent = event;
    this.isAlreadyEnrolled = false;
    this.isCheckingEnrollment = true; // flag
    this.status = '';

    this.httpService.checkEnrollment(this.selectedEvent.id, this.userId).subscribe({
      next: (data: any) => {
        this.isAlreadyEnrolled = data != null;
        this.isCheckingEnrollment = false;
      },
      error: () => {
        this.isAlreadyEnrolled = false;
        this.isCheckingEnrollment = false;
      }
    });
  }

  toggleDetails(event: any) {
  if (this.selectedEvent.id === event.id) {
    this.selectedEvent = {};
  } else {
    this.viewDetails(event);
  }
}

  isCompleted(): boolean {
    return this.selectedEvent?.status === 'COMPLETED';
  }

  applyFilter() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredList = this.eventList;
      return;
    }
    this.filteredList = this.eventList.filter((event: any) => {
      return (
        event.id?.toString().includes(query) ||
        event.title?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.status?.toLowerCase().includes(query) 
      );
    });
  } 

  enroll() {
    if (this.isEnrolling || this.isAlreadyEnrolled) return;
    this.isEnrolling = true;

    const amount = 100; // ₹1 in paise — change as needed

    this.httpService.createPaymentOrder(amount).subscribe({
      next: (order: any) => {
        const options = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'FinSeminar',
          description: this.selectedEvent.title,
          order_id: order.orderId,
          handler: (response: any) => {
            // Payment successful — now verify and enroll
            const paymentData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              userId: this.userId,
              eventId: this.selectedEvent.id
            };

            this.ngZone.run(() => {
              this.httpService.verifyAndEnroll(paymentData).subscribe({
                next: () => {
                  this.isEnrolling = false;
                  this.isAlreadyEnrolled = true;
                  this.showToast('Enrolled successfully!');
                  // this.getEvent();
                },
                error: () => {
                  this.isEnrolling = false;
                  this.showErrorToast('Payment verified but enrollment failed. Contact support.');
                }
              });
            })
          },
          "payment.failed": (response: any) => {
            this.ngZone.run(() => {
              this.isEnrolling = false;
              this.showErrorToast('Payment failed. Please try again.');
            });
          },
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          theme: {
            color: '#2E86AB'
          },
          modal: {
            ondismiss: () => {
              this.ngZone.run(() => {
                this.isEnrolling = false;
                this.showErrorToast('Payment was not completed. Please try again.');
              });
            }
          },
          "modal.escape": false,
          notify: {
            polling: false
          },
          retry: {
            enabled: false
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: () => {
        this.isEnrolling = false;
        this.showErrorToast('Failed to initiate payment. Please try again.');
      }
    });
  }

  saveFeedBack() {
    if (!this.selectedEvent?.id || !this.formModel.content) {
      this.showErrorToast('Please write some feedback before submitting.');
      return;
    }

    this.showError = false;
    this.formModel.timestamp = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const userId = this.userId;

    this.httpService.AddFeedbackByParticipants(this.selectedEvent.id, userId, this.formModel).subscribe({
      next: () => {
        this.formModel = {};
        this.showToast('Feedback submitted successfully!');
        this.getEvent(); // this will also refresh selectedEvent via refreshSelectedEvent()
      },
      error: () => {
        this.showErrorToast('Failed to submit feedback. Please try again.')
      }
    });
  }

  checkStatus() {
    this.status = '';
    this.httpService.viewEventStatus(this.selectedEvent.id).subscribe({
      next: (data: any) => {
        this.status = data.status;
      },
      error: () => {
        this.showErrorToast('Failed to fetch event status.');
      }
    });
  }

  showToast(message: string) {
    this.responseMessage = message;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.responseMessage = '';
    }, 3000);
  }

  showErrorToast(message: string) {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage = '';
    }, 3000);
  }

  get paginatedList(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.eventList.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.selectedEvent = {};
  }

  downloadCertificate() {
    const event = this.selectedEvent;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#151E27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#F0A500';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#2E86AB';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#2E86AB');
    grad.addColorStop(1, '#F0A500');
    ctx.fillStyle = grad;
    ctx.fillRect(36, 36, canvas.width - 72, 110);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('FinSeminar', canvas.width / 2, 105);

    ctx.fillStyle = '#F0A500';
    ctx.font = 'bold 50px serif';
    ctx.fillText('Certificate of Participation', canvas.width / 2, 230);

    ctx.strokeStyle = '#F0A500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 255);
    ctx.lineTo(canvas.width - 100, 255);
    ctx.stroke();

    ctx.fillStyle = '#E8E8E8';
    ctx.font = '24px serif';
    ctx.fillText('This certifies that the participant has successfully enrolled in', canvas.width / 2, 325);

    ctx.fillStyle = '#F0A500';
    ctx.font = 'bold 34px serif';
    ctx.fillText(`"${event.title}"`, canvas.width / 2, 395);

    ctx.fillStyle = '#E8E8E8';
    ctx.font = '22px serif';
    ctx.fillText(`Location: ${event.location}`, canvas.width / 2, 460);
    ctx.fillText(`Scheduled: ${event.schedule}`, canvas.width / 2, 498);

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '18px serif';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    ctx.fillText(`Issued by FinSeminar Platform  |  Date: ${today}`, canvas.width / 2, 590);

    ctx.fillStyle = grad;
    ctx.fillRect(36, canvas.height - 120, canvas.width - 72, 4);

    ctx.strokeStyle = '#F0A500';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(180, canvas.height - 75); ctx.lineTo(480, canvas.height - 75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(720, canvas.height - 75); ctx.lineTo(1020, canvas.height - 75); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '16px serif';
    ctx.fillText('Participant Signature', 330, canvas.height - 52);
    ctx.fillText('Authorized Signatory', 870, canvas.height - 52);

    const link = document.createElement('a');
    link.download = `FinSeminar_Certificate_${event.title.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
} 