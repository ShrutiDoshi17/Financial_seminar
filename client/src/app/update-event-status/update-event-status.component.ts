import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-event-status',
  templateUrl: './update-event-status.component.html',
  styleUrls: ['./update-event-status.component.scss'],
  providers: [DatePipe]
})
export class UpdateEventStatusComponent implements OnInit {
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

  constructor(private datePipe: DatePipe, public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent() {
    this.eventList = [];
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;
    this.httpService.getEventByProfessional(userId).subscribe((data: any) => {
      this.eventList = data;
      console.log(this.eventList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred.. Please try again later.";
      console.error('Login error:', error);
    });;
  }

  addStatus(val: any) {
    this.updateId = val.id;
  }

  addRemarks(val: any) {
    this.updateId = val.id;
    this.selectedEvent = val;

  }
  updateStatus() {
    if (this.updateId != null) {
      this.showError = false;
      this.httpService.UpdateEventStatus(this.updateId, this.formModel.status).subscribe((data: any) => {

        this.getEvent();
        this.updateId = null;
      }, error => {
        // Handle error
        this.showError = true;
        this.errorMessage = "An error occurred while created in. Please try again later.";
        console.error('Login error:', error);
      });;
    }
  }

  saveFeedBack() {
    // debugger;
    if (this.updateId != null && this.formModel.content) {
      this.showError = false;
      const formattedTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      this.formModel.timestamp = formattedTime;
      const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? parseInt(userIdString, 10) : null;
      this.httpService.AddFeedback(this.updateId, userId, this.formModel).subscribe((data: any) => {

        this.getEvent();
        this.updateId = null;
      }, error => {
        this.showError = true;
        this.errorMessage = "An error occurred while created in. Please try again later.";
        console.error('Login error:', error);
      });;
    }
  }


}
