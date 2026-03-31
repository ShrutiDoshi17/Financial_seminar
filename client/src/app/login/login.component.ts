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

export class LoginComponent implements OnInit {
  itemForm: FormGroup
  formModel: any = {}
  showError: boolean = false
  errorMessage: any

  constructor(private fb: FormBuilder, private httpService: HttpService, private authService: AuthService, private router: Router) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void { }

  onLogin() {
    if (this.itemForm.valid) {
      this.httpService.Login(this.itemForm.value).subscribe({
        next: (res: any) => {
          if (!res || !res.token) {
            this.showError = true
            this.errorMessage = 'Invalid response from server'
            return
          }

          this.authService.setRole(res.role)
          this.authService.saveToken(res.token)
          this.authService.saveUserId(res.id)
          this.router.navigate(['/dashboard'])
        },
        error: (err: any) => {
          this.showError = true
          if (err.status === 401) {
            this.errorMessage = 'Invalid username or password'
          }
          else if (err.status === 403) {
            this.errorMessage = 'Access denied'
          }
          else {
            this.errorMessage = 'Login failed. Please try again'
          }
        }
      })
    }
  }

  registration() {
    this.router.navigate(['/registration'])
  }
}
