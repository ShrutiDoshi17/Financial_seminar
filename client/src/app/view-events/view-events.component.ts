import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';


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
  eventObj: any = [];
  assignModel: any = {};

  showMessage: any;
  responseMessage: any;
  isUpdate: any = false;
  eventList: any = [];
  workShopList: any = [];
  userId: any;
  selectedEvent: any = {};
  status: any;

  constructor(private datePipe: DatePipe, public router: Router, public httpService: HttpService, private authService: AuthService) {

  }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    this.userId = userIdString ? parseInt(userIdString, 10) : null;
    this.getEvent();
  }

  getEvent() {
    this.httpService.viewAllEvents().subscribe((data: any) => {
      this.eventList = data;
      console.log(this.eventList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred.. Please try again later.";
      console.error('Login error:', error);
    })
  }

  isEnrolled(): boolean {
    if(!this.selectedEvent || !this.selectedEvent.enrollments) {
      return false
    }
    return this.selectedEvent.enrollments.some(
      (e: any) => e.user?.id == this.userId
    );
  }

  enroll() {
    this.httpService.EnrollParticipant(this.selectedEvent.id, this.userId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.selectedEvent.enrollments.push({
          user: {id: this.userId}
        })
        // this.getEvent();
        this.showMessage = true
        this.responseMessage = "User enrolled successfully!"

        setTimeout(() => {
          this.showMessage = false
          this.responseMessage = ''
        }, 3000)
      },
      error: (err: any) => {
        this.showMessage = true
        this.responseMessage = 'User already enrolled!'
        console.error(err)

        setTimeout(() => {
          this.showMessage = false
          this.responseMessage = ''
        }, 3000)
      }
    })
  }

  viewDetails(val: any) {
    this.selectedEvent = val;
  }

  saveFeedBack() {
    debugger;
    if (this.selectedEvent.id != null && this.formModel.content) {
      this.showError = false;
      const formattedTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      this.formModel.timestamp = formattedTime;
      const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? parseInt(userIdString, 10) : null;
      this.httpService.AddFeedbackByParticipants(this.selectedEvent.id, userId, this.formModel).subscribe((data: any) => {
        this.formModel = {};
        this.responseMessage = "Saved Successfully";
        this.getEvent();
        this.selectedEvent = {};

      }, error => {
        this.showError = true;
        this.errorMessage = "An error occurred while created in. Please try again later.";
        console.error('Login error:', error);
      });;
    }
  }

  checkStatus() {
    this.status = "";
    this.httpService.viewEventStatus(this.selectedEvent.id).subscribe({
      next: (data: any) => {
        this.status = data.status;
        console.log(data);
      }, error: (err: any) => {
        this.showError = true;
        this.errorMessage = "An error occurred.. Please try again later.";
        console.error('Login error:', err);
      }
    });;
  }

  downloadCertificate() {
  const event = this.selectedEvent;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#151E27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer gold border
  ctx.strokeStyle = '#F0A500';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Inner blue border
  ctx.strokeStyle = '#2E86AB';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Header gradient strip
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, '#2E86AB');
  grad.addColorStop(1, '#F0A500');
  ctx.fillStyle = grad;
  ctx.fillRect(36, 36, canvas.width - 72, 110);

  // Brand name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('FinSeminar', canvas.width / 2, 105);

  // Certificate title
  ctx.fillStyle = '#F0A500';
  ctx.font = 'bold 50px serif';
  ctx.fillText('Certificate of Participation', canvas.width / 2, 230);

  // Decorative line
  ctx.strokeStyle = '#F0A500';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 255);
  ctx.lineTo(canvas.width - 100, 255);
  ctx.stroke();

  // Body text
  ctx.fillStyle = '#E8E8E8';
  ctx.font = '24px serif';
  ctx.fillText('This certifies that the participant has successfully enrolled in', canvas.width / 2, 325);

  // Event title
  ctx.fillStyle = '#F0A500';
  ctx.font = 'bold 34px serif';
  ctx.fillText(`"${event.title}"`, canvas.width / 2, 395);

  // Event details
  ctx.fillStyle = '#E8E8E8';
  ctx.font = '22px serif';
  ctx.fillText(`Location: ${event.location}`, canvas.width / 2, 460);
  ctx.fillText(`Scheduled: ${event.schedule}`, canvas.width / 2, 498);

  // Issued info
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '18px serif';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  ctx.fillText(`Issued by FinSeminar Platform  |  Date: ${today}`, canvas.width / 2, 590);

  // Bottom strip
  ctx.fillStyle = grad;
  ctx.fillRect(36, canvas.height - 120, canvas.width - 72, 4);

  // Signature lines
  ctx.strokeStyle = '#F0A500';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(180, canvas.height - 75); ctx.lineTo(480, canvas.height - 75); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(720, canvas.height - 75); ctx.lineTo(1020, canvas.height - 75); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '16px serif';
  ctx.fillText('Participant Signature', 330, canvas.height - 52);
  ctx.fillText('Authorized Signatory', 870, canvas.height - 52);

  // Trigger download
  const link = document.createElement('a');
  link.download = `FinSeminar_Certificate_${event.title.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}



}
