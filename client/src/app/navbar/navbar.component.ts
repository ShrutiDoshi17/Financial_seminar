import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  IsLoggin: any = false;
  roleName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.IsLoggin = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
 