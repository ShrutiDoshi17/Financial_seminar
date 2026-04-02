import { Component, OnInit } from '@angular/core';
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

  constructor(public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username, [Validators.required]],
      password: [this.formModel.password, [Validators.required]],
    });
  }

  onLogin() {
    if (this.itemForm.valid) {
      // this.showError = false;
      const username = this.itemForm.value.username
      this.httpService.checkUsernameExists(username).subscribe((exists: boolean) => {
        if (!exists) {
          this.showError = true
          this.errorMessage = 'Username not found'

          setTimeout(() => {
            this.showError = false
            this.errorMessage = ''
          }, 3000);
          return
        }

        this.httpService.Login(this.itemForm.value).subscribe((data: any) => {
          if (data.userNo != 0) {
            // debugger;

            // localStorage.setItem('role', data.role);
            this.authService.SetRole(data.role);
            this.authService.saveToken(data.token)
            this.authService.saveUserId(data.userId)
            this.authService.setUsername(data.username)
            this.router.navigateByUrl('/dashboard');

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          else {
            this.showError = true;
            this.errorMessage = "Wrong User or Password";

            setTimeout(() => {
              this.showError = false
              this.errorMessage = ''
            }, 3000);
          }
        }, error => {
          this.showError = true;
          this.errorMessage = "An error occurred while logging in. Please try again later.";
          console.error('Login error:', error);
        })
      })
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  registration() {
    this.router.navigateByUrl('/registration');
  }
}
