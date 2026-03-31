import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  roleName: string | null = null;
  IsLoggin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleName = this.authService.getRole;
  //  this.IsLoggin = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.IsLoggin = false;
    this.roleName = null;
    this.router.navigate(['/login']);
  }
}