
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any = [];
  assignModel: any = {};
  selectedEvent: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  isAddRemarks: boolean = false;

  constructor(
    private datePipe: DatePipe,
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent() {
    this.eventList = [];
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getEventByProfessional(userId).subscribe((data: any) => {
      this.eventList = data;
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
      console.error('Error:', error);
    });
  }

  addRemarks(val: any) {
    this.updateId = val.id;
    this.selectedEvent = val;
    this.formModel = {};
  }

  saveFeedBack() {
    if (this.updateId != null && this.formModel.content) {
      this.showError = false;
      const formattedTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.formModel.timestamp = formattedTime;

      const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? parseInt(userIdString, 10) : null;

      this.httpService.AddFeedback(this.updateId, userId, this.formModel).subscribe((data: any) => {
        this.formModel = {};
        this.showMessage = true;
        this.responseMessage = "Feedback submitted successfully!";
        this.getEvent();
        this.updateId = null;
        this.selectedEvent = {};

        setTimeout(() => { this.showMessage = false; this.responseMessage = ''; }, 3000);
      }, error => {
        this.showError = true;
        this.errorMessage = "An error occurred while submitting feedback. Please try again.";
        setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
        console.error('Error:', error);
      });
    }
  }
}