import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  itemForm: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;

  // Math CAPTCHA
  captchaNum1: number = 0;
  captchaNum2: number = 0;
  captchaAnswer: any = '';
  captchaError: string = '';

  // Toast
  showCaptchaToast: boolean = false;
  toastMessage: string = '';

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username, [Validators.required]],
      password: [this.formModel.password, [Validators.required]],
    });
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    this.captchaNum1 = Math.floor(Math.random() * 10) + 1;
    this.captchaNum2 = Math.floor(Math.random() * 10) + 1;
    this.captchaAnswer = '';
    this.captchaError = '';
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.showCaptchaToast = true;
    setTimeout(() => {
      this.showCaptchaToast = false;
      this.toastMessage = '';
    }, 3000);
  }

  isCaptchaVerified(): boolean {
    const correct = this.captchaNum1 + this.captchaNum2;
    if (this.captchaAnswer === '' || this.captchaAnswer === null) {
      this.showToast('Please answer the captcha question.');
      return false;
    }
    if (parseInt(this.captchaAnswer) !== correct) {
      this.showToast('Invalid captcha! Please try again.');
      this.generateCaptcha();
      return false;
    }
    this.captchaError = '';
    return true;
  }

  onLogin() {
    if (!this.isCaptchaVerified()) {
      return;
    }

    if (this.itemForm.valid) {
      this.showError = false;
      const username = this.itemForm.value.username;

      this.httpService.checkUsernameExists(username).subscribe((exists: boolean) => {
        if (!exists) {
          this.showError = true;
          this.errorMessage = 'Username not found';
          this.generateCaptcha();
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
          return;
        }

        this.httpService.Login(this.itemForm.value).subscribe((data: any) => {
          if (data.userNo != 0) {
            this.authService.SetRole(data.role);
            this.authService.saveToken(data.token);
            this.authService.saveUserId(data.userId);
            this.authService.setUsername(data.username);
            setTimeout(() => {
              window.location.reload();
            }, 10);
            this.router.navigateByUrl('/dashboard');
          } else {
            this.showError = true;
            this.errorMessage = 'Wrong User or Password';
            this.generateCaptcha();
            setTimeout(() => {
              this.showError = false;
              this.errorMessage = '';
            }, 3000);
          }
        }, error => {
          this.showError = true;
          this.errorMessage = 'An error occurred while logging in. Please try again later.';
          this.generateCaptcha();
          console.error('Login error:', error);
        });
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  registration() {
    this.router.navigateByUrl('/registration');
  }
}