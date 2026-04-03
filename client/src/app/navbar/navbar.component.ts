
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  IsLoggin: boolean = false;
  roleName: string | null = null;
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.IsLoggin = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  }

  goToLogin(): void {
    this.closeMenu();
    this.router.navigateByUrl('/login');
  }

  goToRegister(): void {
    this.closeMenu();
    this.router.navigateByUrl('/registration');
  }

  goToLanding(): void {
    this.closeMenu();
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigateByUrl('/');
    window.location.reload();
  }
}