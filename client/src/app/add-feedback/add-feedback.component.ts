import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss'],
  providers: [DatePipe]
})
export class AddFeedbackComponent implements OnInit {

  feedbackForm!: FormGroup;

  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any = [];
  assignModel: any = {};
  selectedEvent: any = {};
  showMessage: any;
  responseMessage: any
  updateId: any;
  isAddRemarks: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    // this.formModel.status = "ACTIVE";
  }
  

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      content:['',[Validators.required]]
    })
    this.getEvent();
  }

  getEvent() {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      this.showError = true;
      this.errorMessage = 'User ID not found';
      return;
    }

    this.httpService.getEventByProfessional(userId).subscribe({
      next: (data: any) => {
        this.eventList = data
        this.showError = false
      },
      error: (err: any) => {
        this.showError = true
        if (err.status === 401) {
          this.errorMessage = 'Unauthorized user. Please log in again.'
        }
        else if (err.status === 404) {
          this.errorMessage = 'No events found for this professional.'
        }
        else {
          this.errorMessage = 'Failed to load events. Please try again.'
        }
      }
    })

  }

  addRemarks(val: any): void {
    if (!val || !val.id) {
      this.showError = true;
      this.errorMessage = 'Invalid event selected';
      return;
    }
    this.selectedEvent = val;
    this.updateId = val.id;
    this.isAddRemarks = true;
    this.showError = false;

  }

  saveFeedBack() :void{

    if(this.feedbackForm.invalid){
      this.showError = true;
      this.errorMessage = 'Feedback content cannot be empty.';
      return;
    }



    // const userId = this.authService.getLoginStatus;
    const userId = localStorage.getItem('userId')
    if (!userId) {
      this.showError = true;
      this.errorMessage = 'User ID not found';
      return;
    }

    const payload={
      content: this.feedbackForm.value.content
    };

    if (!this.updateId) {
      this.showError = true;
      this.errorMessage = 'No event selected for feedback.';
      return;
    }

    if (!this.formModel.content || this.formModel.content.trim() === '') {
      this.showError = true;
      this.errorMessage = 'Feedback content cannot be empty.'
      return;
    }

    this.httpService.AddFeedback(this.updateId, userId, this.formModel).subscribe({
      next: () => {
        this.showMessage = true
        this.showError = false
        this.responseMessage = 'Feedback added successfully!'
        this.formModel = {status: null}
        this.isAddRemarks = false
        this.selectedEvent = {}
        this.updateId = null
      },
      error: (err: any) => {
        this.showError = true
        this.showMessage = false
        if(err.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again'
        }
        else if(err.status === 404) {
          this.errorMessage = 'Event not found'
        }
        else {
          this.errorMessage = 'Failed to submit feedback'
        }
      }
    })
  }


}
