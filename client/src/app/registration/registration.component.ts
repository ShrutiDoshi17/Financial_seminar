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

  showError: boolean = false
  errorMessage: any

  constructor(public router: Router, private service: HttpService, private formBuilder: FormBuilder) {
    this.itemForm = this.formBuilder.group({
      email: [this.formModel.email, [Validators.required, Validators.email]],
      password: [this.formModel.password, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,}$/)]],
      role: [this.formModel.role, [Validators.required]],
      username: [this.formModel.username, [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\d]*$/)]],
    });
  }

  onRegister() {
    if (this.itemForm.valid) {
      const username = this.itemForm.value.username
      this.service.checkUsernameExists(username).subscribe((exists: boolean) => {
        if (exists) {
          this.showError = true
          this.errorMessage = 'Username already exists. Please try a different username.'

          setTimeout(() => {
            this.showError = false
            this.errorMessage = ''
          }, 3000)
        }
        else {
          this.service.registerUser(this.itemForm.value).subscribe(data => {
            debugger;
            console.log(this.itemForm)
            this.showMessage = true;
            this.responseMessage = "You are successfully registered";
            this.itemForm.reset();

            setTimeout(() => {
              this.router.navigate(['/login'])
            }, 3000)
          })
        }
      })
    }
    else {
      this.itemForm.markAllAsTouched();
    }
  }


}
