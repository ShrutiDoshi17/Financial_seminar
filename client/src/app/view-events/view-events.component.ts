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
export class ViewEventsComponent implements OnInit  {
  formModel:any={status:null};
  showError:boolean=false;
  errorMessage:any;
  eventObj:any=[];
  assignModel:any={};
  showMessage:any;
  responseMessage:any;
  isUpdate:any=false;
  eventList:any=[];
  workShopList:any=[];
  userId:any;
  selectedEvent:any={};
  status:any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.getEvent();
    
  }

  getEvent(){

  }

  enroll(){

  }

  viewDetails(val:any){
    this.selectedEvent = val;

  }

  saveFeedBack(){
    if(!this.selectedEvent || this.formModel.feedback){
      this.showError = true;
      this.errorMessage = 'Feedback cannot be empty';
      return;
    }

    this.formModel.timestamp = new Date();

  }

  checkStatus(){

  }


   
  
}
