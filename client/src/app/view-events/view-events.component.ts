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
    return !!this.selectedEvent.enrollments?.find((e: any) => {
      e.userId === this.userId
    })
  }

  enroll() {
    if (this.isEnrolled()) {
      return
    }
    this.httpService.EnrollParticipant(this.selectedEvent.id, this.userId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getEvent();
      },
      error: (err: any) => {
        if(err.status === 409) {
          this.showMessage = true
          this.responseMessage = 'User already enrolled!'
        }
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


}
