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
  allEvents: any = [];
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
      this.eventList = data.filter(
        (event: any) => !event.professionals || event.professionals.length === 0
      );
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
      console.error('Error:', error);
    });
  }

  getProfessionals() {
    this.professionalsList = [];
    this.httpService.GetAllProfessionals().subscribe((data: any) => {
      this.professionalsList = data;
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
      console.error('Error:', error);
    });
  }

  getDatePart(schedule: string): string {
    if (!schedule) return '';
    return schedule.split('T')[0].split(' ')[0];
  }

  get selectedEvent(): any {
    const eventId = this.itemForm.get('eventId')?.value;
    return this.allEvents.find((e: any) => e.id == eventId) || null;
  }

  get busyProfessionalIds(): Set<number> {
    const busy = new Set<number>();
    if (!this.selectedEvent) return busy;

    const selectedDate = this.getDatePart(this.selectedEvent.schedule);
    this.allEvents.forEach((event: any) => {
      const eventDate = this.getDatePart(event.schedule);
      if (eventDate === selectedDate && event.professionals) {
        event.professionals.forEach((pro: any) => { busy.add(pro.id); });
      }
    });
    return busy;
  }

  get availableProfessionals(): any[] {
    if (!this.selectedEvent) return this.professionalsList;
    const busy = this.busyProfessionalIds;
    return this.professionalsList.filter((pro: any) => !busy.has(pro.id));
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.showError = false;
      this.showMessage = false;

      const assignedEventId = Number(this.itemForm.controls['eventId'].value);
      const assignedUserId  = Number(this.itemForm.controls['userId'].value);

      this.httpService.assignProfessionals(assignedEventId, assignedUserId)
        .subscribe((data: any) => {

          const assignedPro = this.professionalsList.find((p: any) => p.id === assignedUserId);
          const eventInAll  = this.allEvents.find((e: any) => e.id === assignedEventId);

          if (eventInAll && assignedPro) {
            if (!eventInAll.professionals) eventInAll.professionals = [];
            eventInAll.professionals.push(assignedPro);
          }

          this.eventList = this.eventList.filter((e: any) => e.id !== assignedEventId);

          this.showMessage = true;
          this.responseMessage = "Professional assigned successfully!";
          this.itemForm.reset();

          setTimeout(() => { this.showMessage = false; this.responseMessage = ''; }, 3000);

        }, error => {
          this.showError = true;
          this.errorMessage = "An error occurred while assigning. Please try again later.";
          setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
          console.error('Error:', error);
        });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}