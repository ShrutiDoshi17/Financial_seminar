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

  // Track assigned professional IDs so we can hide them from the list
  assignedProfessionalIds: Set<number> = new Set();

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      eventId: [this.formModel.eventId, [Validators.required]],
      userId:  [this.formModel.userId,  [Validators.required]]
    });
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
      this.errorMessage = "An error occurred. Please try again later.";
      console.error('Error:', error);
    });
  }

  getProfessionals() {
    this.professionalsList = [];

    this.httpService.GetAllProfessionals().subscribe((data: any) => {
      this.professionalsList = data;
      console.log(this.professionalsList);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred. Please try again later.";
      console.error('Error:', error);
    });
  }

  // Returns only professionals not yet assigned
  get availableProfessionals(): any[] {
    return this.professionalsList.filter(
      (pro: any) => !this.assignedProfessionalIds.has(pro.id)
    );
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.showError = false;
      this.showMessage = false;

      const assignedUserId = this.itemForm.controls['userId'].value;

      this.httpService.assignProfessionals(
        this.itemForm.controls['eventId'].value,
        assignedUserId
      ).subscribe((data: any) => {
        // Add to assigned set so they disappear from the list
        this.assignedProfessionalIds.add(Number(assignedUserId));
        this.showMessage = true;
        this.responseMessage = "Professional assigned successfully!";
        this.itemForm.reset();
      }, error => {
        this.showError = true;
        this.errorMessage = "An error occurred while assigning. Please try again later.";
        console.error('Error:', error);
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}