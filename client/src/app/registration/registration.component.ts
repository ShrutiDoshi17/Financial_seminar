
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent {
  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;
  responseMessage: any;

  showError: boolean = false;
  errorMessage: any;
  otpSent: boolean = false;
  otpValue: string = '';
  otpError: string = '';
  pendingFormData: any = null;

  constructor(public router: Router, private service: HttpService, private formBuilder: FormBuilder) {
    this.itemForm = this.formBuilder.group({
      email: [this.formModel.email, [Validators.required, Validators.email]],
      password: [this.formModel.password, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,}$/)]],
      role: [this.formModel.role, [Validators.required]],
      username: [this.formModel.username, [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\d]*$/)]],
    });
  }

  // onRegister() {
  //   if (this.itemForm.valid) {
  //     const username = this.itemForm.value.username;
  //     this.service.checkUsernameExists(username).subscribe((exists: boolean) => {
  //       if (exists) {
  //         this.showError = true;
  //         this.errorMessage = 'Username already exists.';
  //         setTimeout(() => {
  //           this.showError = false;
  //           this.errorMessage = '';
  //         }, 3000);
  //       } else {
  //         this.service.registerUser(this.itemForm.value).subscribe(data => {
  //           this.showMessage = true;
  //           this.responseMessage = 'You are successfully registered';
  //           this.itemForm.reset();
  //           setTimeout(() => {
  //             this.router.navigate(['/login']);
  //           }, 3000);
  //         });
  //       }
  //     });
  //   } else {
  //     this.itemForm.markAllAsTouched();
  //   }
  // }


  onRegister() {
    if (this.itemForm.valid) {
      const username = this.itemForm.value.username;
      this.service.checkUsernameExists(username).subscribe((exists: boolean) => {
        if (exists) {
          this.showError = true;
          this.errorMessage = 'Username already exists.';
          setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
        } else {
          // Save form data and send OTP to email
          this.pendingFormData = this.itemForm.value;
          this.service.sendRegistrationOtp(this.itemForm.value.email).subscribe({
            next: () => {
              this.otpSent = true;
            },
            error: () => {
              this.showError = true;
              this.errorMessage = 'Failed to send OTP. Please try again.';
              setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
            }
          });
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  verifyOtpAndRegister() {
    if (!this.otpValue || this.otpValue.length !== 6) {
      this.otpError = 'Please enter the 6-digit OTP sent to your email.';
      return;
    }
    this.otpError = '';
    this.service.verifyRegistrationOtp(this.pendingFormData.email, this.otpValue).subscribe({
      next: () => {
        // OTP verified — now register the user
        this.service.registerUser(this.pendingFormData).subscribe({
          next: () => {
            this.showMessage = true;
            this.responseMessage = 'You are successfully registered!';
            this.itemForm.reset();
            this.otpSent = false;
            setTimeout(() => { this.router.navigate(['/login']); }, 3000);
          },
          error: () => {
            this.showError = true;
            this.errorMessage = 'Registration failed. Please try again.';
            setTimeout(() => { this.showError = false; this.errorMessage = ''; }, 3000);
          }
        });
      },
      error: () => {
        this.otpError = 'Invalid or expired OTP. Please try again.';
      }
    });
  }
}  