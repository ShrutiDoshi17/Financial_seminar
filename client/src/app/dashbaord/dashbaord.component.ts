import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {

  role: string | null = null;
  eventList: any = [];
  selectedEvent: any;
  showError: boolean = false;
  errorMessage: any;
  username: any;
  isLoading: boolean = true;

  // Stats variables
  totalEvents: number = 0;
  ongoingEvents: number = 0;
  completedEvents: number = 0;
  plannedEvents: number = 0;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole;
    this.username = localStorage.getItem('username');
    this.showError = false
    this.isLoading = true
    this.getEvents();
  }

  getEvents(): void {
    const userId = localStorage.getItem('userId');

    this.isLoading = true

    if (this.role === 'INSTITUTION') {
      // Institution — fetch their own events
      this.httpService.getEventByInstitutionId(userId).subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
          this.isLoading = false
        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
          this.isLoading = false

        }
      });

    } else if (this.role === 'PROFESSIONAL') {
      // Professional — fetch assigned events
      this.httpService.getEventByProfessional(userId).subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
                    this.isLoading = false

        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
                    this.isLoading = false

        }
      });

    } else if (this.role === 'PARTICIPANT') {
      // Participant — fetch all available events
      this.httpService.viewAllEvents().subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
                    this.isLoading = false

        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
                    this.isLoading = false

        }
      });
    }
  }

  calculateStats(): void {
    this.totalEvents = this.eventList.length;
    this.ongoingEvents = this.eventList.filter(
      (e: any) => e.status === 'ONGOING'
    ).length;
    this.completedEvents = this.eventList.filter(
      (e: any) => e.status === 'COMPLETED'
    ).length;
    this.plannedEvents = this.eventList.filter(
      (e: any) => e.status === 'PLANNED'
    ).length;
  }

  viewDetails(event: any): void {
    this.selectedEvent = event;
  }

  // Navigation methods
  goToCreateEvent(): void {
    this.router.navigate(['/create-event']);
  }

  goToAddResource(): void {
    this.router.navigate(['/add-resource']);
  }

  goToAssignProfessional(): void {
    this.router.navigate(['/assign-professional']);
  }

  goToUpdateStatus(): void {
    this.router.navigate(['/update-event-status']);
  }

  goToAddFeedback(): void {
    this.router.navigate(['/add-feedback']);
  }

  goToViewEvents(): void {
    this.router.navigate(['/view-events']);
  }

  getStatusClass(status: string): string {
    if (status === 'PLANNED') return 'badge-planned';
    if (status === 'ONGOING') return 'badge-ongoing';
    if (status === 'COMPLETED') return 'badge-completed';
    return '';
  }
}