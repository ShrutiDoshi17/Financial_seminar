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
export class UpdateEventStatusComponent implements OnInit  {
    formModel:any={status:null};
    showError:boolean=false;
    errorMessage:any;
    eventList:any=[];
    assignModel:any={};
    selectedEvent:any={};
    showMessage: any;
    reponseMessage: any;
    updateId: any;
    isAddRemarks:boolean=false;

    ngOnInit(): void {
      this.getEvent();
    }

    getEvent(){

    }

    addStatus(val:any): void{
      this.updateId = val?.eventId;
    }

    addRemarks(val:any): void{
      this.updateId = val?.eventId;
      this.selectedEvent = val;
      this.isAddRemarks = true;

    }

    updateStatus():void{
      if(!this.updateId){
        this.showError = true;
        this.errorMessage = 'Event ID not found';
        return;
      }

      this.assignModel.eventId = this.updateId;
      this.assignModel.status = this.formModel.status;

    }

    saveFeedBack(): void{
      if(!this.updateId){
        this.showError = true;
        this.errorMessage = 'Event ID not found';
        return;
      }

      const payload={
        eventId: this.updateId,
        remarks: this.selectedEvent.remarks,
        feedbackDate: new Date()
      };

    }
 
  
  
}
