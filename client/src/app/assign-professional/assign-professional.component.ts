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

  constructor(public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.itemForm = this.formBuilder.group({
      eventId: [this.formModel.eventId, [Validators.required]],
      userId: [this.formModel.userId, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getProfessionals();
    this.getEvent();
  }

  getEvent() {
    this.eventList = [];
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getEventByInstitutionId(userId).subscribe((data: any) => {
      this.eventList = data;
      console.log(this.eventList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred.. Please try again later.";
      console.error('Login error:', error);
    })
  }
  
  getProfessionals() {
    this.professionalsList = [];

    this.httpService.GetAllProfessionals().subscribe((data: any) => {
      this.professionalsList = data;
      console.log(this.professionalsList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred.. Please try again later.";
      console.error('Login error:', error);
    })
  }

  onSubmit() {
    // debugger;
    if (this.itemForm.valid) {
      this.showError = false;
      this.httpService.assignProfessionals(this.itemForm.controls["eventId"].value, this.itemForm.controls["userId"].value).subscribe((data: any) => {
        this.itemForm.reset();
        this.responseMessage = "Saved Successfully";
      }, error => {
        this.showError = true;
        this.errorMessage = "An error occurred while logging in. Please try again later.";
        console.error('Login error:', error);
      })
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
