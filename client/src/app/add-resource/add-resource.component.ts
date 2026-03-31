import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})

export class AddResourceComponent implements OnInit {
  itemForm: FormGroup
  formModel: any = { status: null }
  showError: boolean = false
  errorMessage: any = {}
  showMessage: any
  responseMessage: any
  eventList: any = []

  constructor(private fb: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    this.itemForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      availabilityStatus: ['', Validators.required]
    })

    this.formModel = {
      status: null,
      eventId: null,
      type: '',
      description: '',
      availabilityStatus: ''
    }
  }

  ngOnInit(): void {
    this.getEvent()
    this.formModel.availabilityStatus = ''
  }

  getEvent(): void {
    const userId = localStorage.getItem("userId")

    if (!userId) {
      this.showError = true
      this.errorMessage = 'User ID not found. Please log in again.'
      return
    }

    this.httpService.getEventByInstitutionId(userId).subscribe({
      next: (data: any) => {
        this.eventList = data
        this.showError = false
      },
      error: (err: any) => {
        this.showError = true
        if (err.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.'
        }
        else if (err.status === 404) {
          this.errorMessage = 'No events found for this instutution.'
        }
        else {
          this.errorMessage = 'Failed to load events. Please try again.'
        }
      }
    })
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.showError = true
      this.errorMessage = 'Please fill all the required fields.'
      return
    }

    const userId = localStorage.getItem("userId");
    if(!userId) {
      this.showError = true
      this.errorMessage = 'User ID not found.'
      return
    }

    // const eventId = this.itemForm.value.eventId
    // const resourceDetails = {
    //   type: this.itemForm.value.type,
    //   description: this.itemForm.value.description,
    //   availabilityStatus: this.itemForm.value.availabilityStatus,
    // }
    // add {eventId, ...resourceDetail} in addResource 

    this.httpService.addResource(this.itemForm.value).subscribe({
      next: () => {
        this.showMessage = true
        this.showError = false
        this.responseMessage = 'Resource added successfully!'
        this.itemForm.reset()
        // this.formModel.availabilityStatus = ''
      },
      error: (err: any) => {
        this.showError = true
        this.errorMessage = 'Failed to add resource, please try again.'
      }
    })
  }
}
