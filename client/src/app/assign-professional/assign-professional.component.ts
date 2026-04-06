import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assign-professional',
  templateUrl: './assign-professional.component.html',
  styleUrls: ['./assign-professional.component.scss']
})
export class AssignProfessionalComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any = [];
  allEvents: any = []; // keep full list for date conflict checks
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  professionalsList: any = [];

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      eventId: [null, [Validators.required]],
      userId:  [null, [Validators.required]]
    });

    // When event selection changes, reset professional selection
    this.itemForm.get('eventId')?.valueChanges.subscribe(() => {
      this.itemForm.get('userId')?.reset();
    });
  }

  ngOnInit(): void {
    this.getProfessionals();
    this.getEvent();
  }

  getEvent() {
    this.eventList = [];
    this.allEvents = [];
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getEventByInstitutionId(userId).subscribe((data: any) => {
      this.allEvents = data;
      // Only show events that have NO professional assigned yet
      this.eventList = data.filter(
        (event: any) => !event.professionals || event.professionals.length === 0
      );
      console.log('All events:', this.allEvents);
      console.log('Unassigned events:', this.eventList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      console.error('Error:', error);
    });
  }

  getProfessionals() {
    this.professionalsList = [];
    this.httpService.GetAllProfessionals().subscribe((data: any) => {
      this.professionalsList = data;
      console.log('All professionals:', this.professionalsList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      console.error('Error:', error);
    });
  }

  // Get the date part only (e.g. "2026-04-10") from a schedule string
  getDatePart(schedule: string): string {
    if (!schedule) return '';
    // handles both "2026-04-10T10:00" and "2026-04-10 10:00" and "2026-04-10"
    return schedule.split('T')[0].split(' ')[0];
  }

  // Get the selected event object
  get selectedEvent(): any {
    const eventId = this.itemForm.get('eventId')?.value;
    return this.allEvents.find((e: any) => e.id == eventId) || null;
  }

  // Get professionals who are already busy on the selected event's date
  get busyProfessionalIds(): Set<number> {
    const busy = new Set<number>();
    if (!this.selectedEvent) return busy;

    const selectedDate = this.getDatePart(this.selectedEvent.schedule);

    // Check all events (not just unassigned) for conflicts on same date
    this.allEvents.forEach((event: any) => {
      const eventDate = this.getDatePart(event.schedule);
      if (eventDate === selectedDate && event.professionals) {
        event.professionals.forEach((pro: any) => {
          busy.add(pro.id);
        });
      }
    });

    return busy;
  }

  // Returns professionals available for the selected event's date
  get availableProfessionals(): any[] {
    if (!this.selectedEvent) return this.professionalsList;
    const busy = this.busyProfessionalIds;
    return this.professionalsList.filter(
      (pro: any) => !busy.has(pro.id)
    );
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.showError = false;
      this.showMessage = false;

      const assignedEventId = Number(this.itemForm.controls['eventId'].value);
      const assignedUserId  = Number(this.itemForm.controls['userId'].value);

      this.httpService.assignProfessionals(assignedEventId, assignedUserId)
        .subscribe((data: any) => {

          // Find the professional object
          const assignedPro = this.professionalsList.find(
            (p: any) => p.id === assignedUserId
          );

          // Update the event in allEvents to include the new professional
          const eventInAll = this.allEvents.find(
            (e: any) => e.id === assignedEventId
          );
          if (eventInAll && assignedPro) {
            if (!eventInAll.professionals) eventInAll.professionals = [];
            eventInAll.professionals.push(assignedPro);
          }

          // Remove this event from the dropdown (it now has a professional)
          this.eventList = this.eventList.filter(
            (e: any) => e.id !== assignedEventId
          );

          this.showMessage = true;
          this.responseMessage = "Professional assigned successfully!";
          this.itemForm.reset();

        }, error => {
          this.showError = true;
          this.errorMessage = "An error occurred while assigning. Please try again later.";
          console.error('Error:', error);
        });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}