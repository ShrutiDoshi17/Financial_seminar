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

  // Raw stats (actual values from API)
  totalEvents: number = 0;
  ongoingEvents: number = 0;
  completedEvents: number = 0;
  plannedEvents: number = 0;

  // Animated counter display values
  animTotalEvents: number = 0;
  animOngoingEvents: number = 0;
  animCompletedEvents: number = 0;
  animPlannedEvents: number = 0;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
    this.showError = false;
    this.isLoading = true;

    if (!this.role) {
      setTimeout(() => {
        this.role = localStorage.getItem('role');
        this.getEvents();
      }, 100);
    } else {
      this.getEvents();
    }
  }

  getEvents(): void {
    const userId = localStorage.getItem('userId');

    if (!userId || !this.role) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.showError = false;

    if (this.role === 'INSTITUTION') {
      this.httpService.getEventByInstitutionId(userId).subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
          this.isLoading = false;
          this.animateCounters();
        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
          this.isLoading = false;
        }
      });

    } else if (this.role === 'PROFESSIONAL') {
      this.httpService.getEventByProfessional(userId).subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
          this.isLoading = false;
          this.animateCounters();
        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
          this.isLoading = false;
        }
      });

    } else if (this.role === 'PARTICIPANT') {
      this.httpService.viewAllEvents().subscribe({
        next: (data: any) => {
          this.eventList = data;
          this.calculateStats();
          this.showError = false;
          this.isLoading = false;
          this.animateCounters();
        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events.';
          this.isLoading = false;
        }
      });

    } else {
      this.isLoading = false;
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

  // Animated counter logic
  animateCounters(): void {
    this.countUp('animTotalEvents', this.totalEvents, 1500);
    this.countUp('animPlannedEvents', this.plannedEvents, 1500);
    this.countUp('animOngoingEvents', this.ongoingEvents, 1500);
    this.countUp('animCompletedEvents', this.completedEvents, 1500);
  }

  countUp(
    property: 'animTotalEvents' | 'animPlannedEvents' |
              'animOngoingEvents' | 'animCompletedEvents',
    target: number,
    duration: number
  ): void {
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(
        Math.round(increment * step),
        target
      );
      this[property] = current;

      if (step >= steps || current >= target) {
        this[property] = target;
        clearInterval(timer);
      }
    }, stepTime);
  }

  viewDetails(event: any): void {
    this.selectedEvent = event;
  }

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

  getDate(schedule: string): string {
  if (!schedule) return '';
  // If schedule looks like "2026-04-06 10:30 AM" or "06/04/2026 10:30"
  const parts = schedule.split(' ');
  // date = first token
  return parts[0] || schedule;
}

getTime(schedule: string): string {
  if (!schedule) return '';
  const parts = schedule.split(' ');
  // time = everything after first token
  return parts.slice(1).join(' ') || '';
}
}