import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'

})
export class RegistrationComponent implements OnInit{

  itemForm: FormGroup
  formModel: any = {role:null,email:",password:,username:"}
  showMessage: boolean = false
  responseMessage: any

  constructor(private fb: FormBuilder, private httpService : HttpService, private router: Router){
    this.itemForm = fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],
      role: ['',[Validators.required]],
      username: ['',[Validators.required]],
    })
  }

  ngOnInit(): void {}

  onRegister() {
    if(this.itemForm.valid){
      this.httpService.registerUser(this.itemForm.value).subscribe({
        next:(data)=>{
          this.responseMessage = "User Registered Successfully"
          this.showMessage = true
          this.itemForm.reset()
          this.router.navigate(['/login'])
        }
      })
    }
  }

  login(): void {
    this.router.navigate(['/login'])
  }


}
