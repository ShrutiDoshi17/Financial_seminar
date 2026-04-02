import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard  {
    // constructor(private authService: AuthService, private router: Router) {}

    // canActivate(): boolean {
    //     if(this.authService.getLoginStatus) {
    //         return true
    //     }
    //     this.router.navigate(['/login'])
    //     return false
    // }
}