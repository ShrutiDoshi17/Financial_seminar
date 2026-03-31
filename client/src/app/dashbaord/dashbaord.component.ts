import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  role: string | null = null

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.authService.getRole
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
