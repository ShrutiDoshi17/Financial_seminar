import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})

export class DashbaordComponent  {
  // role: string | null = null
  // eventList: any = []
  // selectedEvent: any
  // showError: boolean = false
  // errorMessage: any

  // constructor(private http: HttpService, private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.role = this.authService.getRole
  //   this.getEvents()
  // }

  // getEvents(): void {
  //   this.eventList = []
  //   this.http.GetAllevents().subscribe({
  //     next: (data: any) => {
  //       this.eventList = data
  //       this.showError = false
  //     }, error: (err: any) => {
  //       this.showError = true
  //       this.errorMessage = 'Failed to load events.'
  //     }
  //   })
  // }

  // viewDetails(event: any): void {
  //   this.selectedEvent = event
  // }

  // goBack(): void {
  //   this.selectedEvent = null
  // }
}
