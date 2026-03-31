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
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  professionalsList: any = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private httpService: HttpService) {
    this.itemForm = fb.group({
      eventId: ['', [Validators.required]],
      userId: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  getEvent() {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      this.showError = true
      this.errorMessage = "User ID not found."
      return
    }

    this.httpService.getEventByInstitutionId(userId).subscribe({
      next: (data) => {
        this.eventList = data
        this.showError = false
      },
      error: (err) => {
        this.showError = true
        if (err.status === 403) {
          this.errorMessage = 'You are not authorized.'
        } else if (err.status === 404) {
          this.errorMessage = 'No events found.'
        } else {
          this.errorMessage = 'Failed to load events.'
        }
      }
    })
  }

  getProfessionals() {
    this.httpService.GetAllProfessionals().subscribe({
      next: (data) => {
        this.professionalsList = data
        this.showMessage = false
      },
      error: (err) => {
        this.showError = true
        if (err.status === 403) {
          this.errorMessage = 'You are not authorized.'
        } else if (err.status === 404) {
          this.errorMessage = 'No professionals found.'
        } else {
          this.errorMessage = 'Failed loading professionals.'
        }
      }
    })
  }

  onSubmit() {
    this.showError = false
    this.showMessage = false

    if (this.itemForm.valid) {
      const eventId = this.itemForm.value.eventId
      const userId = this.itemForm.value.userId

      this.httpService.assignProfessionals(eventId, userId).subscribe({
        next: (data) => {
          this.showMessage = true
          this.responseMessage = 'Professional assigned to event successfully.'
          this.itemForm.reset()
        },
        error: (err) => {
          this.showError = true
          if (err.status === 403) {
            this.errorMessage = 'You are not authorized.'
          } else if (err.status === 404) {
            this.errorMessage = 'No professional or event found.'
          } else {
            this.errorMessage = 'Failed to assign professionals.'
          }
        }
      })
    }
  }
}
