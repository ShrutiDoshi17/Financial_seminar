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
export class LoginComponent implements OnInit{
  itemForm: FormGroup
  formModel: any = {}
  showError: boolean = false
  errorMessage: any

  constructor(private fb: FormBuilder,private httpService: HttpService, private authService: AuthService, private router: Router) {
    this.itemForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    })
  }
  
  ngOnInit(): void {}

  onLogin() {
    if(this.itemForm.valid){
      this.httpService.Login(this.itemForm.value).subscribe({
        next:(data)=>{
          this.authService.setRole(data.role)
          this.authService.saveToken(data.token)
          this.authService.saveUserId(data.userid)
        }
      })
    }
  }

  registration(){
    this.router.navigate(['/app-registration'])
  }
}
