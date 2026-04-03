import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin: any = false;
  roleName: string | null;
  
  // constructor(private authService: AuthService, private router: Router) {
  //   this.IsLoggin = authService.getLoginStatus;
  //   this.roleName = authService.getRole;
  //   if (this.IsLoggin == false) {
  //     this.router.navigateByUrl('/');

  //   }
  // }

  constructor(private authService: AuthService, private router: Router) {
  this.IsLoggin = authService.getLoginStatus;
  this.roleName = authService.getRole;

  const currentPath = window.location.pathname;
  const publicRoutes = ['/', '/login', '/registration'];

  if (!this.IsLoggin && !publicRoutes.includes(currentPath)) {
    this.router.navigateByUrl('/');
  }
}

  logout() {
    this.authService.logout();
    window.location.reload();
  }

}
