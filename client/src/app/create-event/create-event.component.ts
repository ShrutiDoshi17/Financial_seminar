import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { scheduled } from 'rxjs';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;

  constructor(private fb: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    this.itemForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      schedule: [null, [Validators.required]],
      location: [null, [Validators.required]],
      status: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getEvent()
  }

  getEvent() {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      this.showError = true
      this.errorMessage = 'User ID not found'
    }

    this.httpService.getEventByInstitutionId(userId).subscribe({
      next: (data) => {
        this.eventList = data
        this.showError = false
      },
      error: (err) => {
        this.showError = true
        if (err.status === 403) {
          this.errorMessage = 'You are not authorized'
        } else if (err.status === 404) {
          this.errorMessage = 'No event found'
        } else {
          this.errorMessage = 'Falied to load events'
        }
      }
    })
  }

  edit(val: any) {
    if (!val || !val.id) {
      this.showError = true
      this.errorMessage = 'Invalid event selected'
    }

    this.updateId = val.id

    this.itemForm.patchValue({
      title: val.title,
      description: val.description,
      schedule: val.schedule,
      location: val.location,
      status: val.status
    })
  }

  onSubmit() {
    this.showError = false
    this.showMessage = false

    if (this.itemForm.valid) {
      const userId = localStorage.getItem('userId')

      if (!userId) {
        this.showError = true
        this.errorMessage = 'User ID not found'
        return
      }

      const eventData = {
        ...this.itemForm.value,
        institutionId: userId
      }

      if (this.updateId) {
        this.httpService.updateEvent(this.updateId, eventData).subscribe({
          next: (data) => {
            this.showMessage = true
            this.responseMessage = 'Event added successfully'
            this.updateId = null
            this.itemForm.reset()
            this.getEvent()
          },
          error: (err) => {
            this.showError = true
            if (err.status === 401) {
              this.errorMessage = 'You are not authorized'
            } else if (err.status === 404) {
              this.errorMessage = 'Institution not found'
            } else {
              this.errorMessage = 'Failed to create event'
            }
          }
        })
      }
    }
  }

}
