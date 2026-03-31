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
export class AddFeedbackComponent implements OnInit  {

  formModel: any={status:null};
  showError:boolean=false;
  errorMessage:any;
  eventList:any=[];
  assignModel:any={};
  selectedEvent:any={};
  showMessage: any;
  updateId:any;
  isAddRemarks:boolean=false;

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ){
    this.formModel.status = "ACTIVE";
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(){
    const userid = this.authService.getLoginStatus;
    if(!userid){
      this.showError = true;
      this.errorMessage = 'User session expired. Please login again.';
      return;
    }

  }

   addRemarks(val:any): void{
    if(!val || !val.id){
      this.showError = true;
      this.errorMessage = 'Invalid event selected';
      return;
    }
    this.selectedEvent = val;
    this.updateId = val.id;
   // this.isAddRemarks = true;
    this.showError = false;

   }

   saveFeedBack(){
     const userid = this.authService.getLoginStatus;
    if(!userid){
      this.showError = true;
      this.errorMessage = 'User session expired. Please login again.';
      return;
    }

    if(!this.updateId){
      this.showError = true;
      this.errorMessage = 'No event selected for feedback.';
      return;
    }

    if(!this.formModel.content || this.formModel.trim() === ''){
      this.showError = true;
      this.errorMessage = 'Feedback content cannot be empty.'
      return;
    }


   }


  


 
}
