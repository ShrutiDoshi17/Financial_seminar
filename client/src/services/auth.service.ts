import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token : string | null = null
  private isLoggedIn: boolean = false

  constructor(){}

  saveToken(token:string):void{
    this.token = token
    this.isLoggedIn = true
    localStorage.setItem('token', token)
  }

  setRole(role: any): void{
    localStorage.setItem('role', role)
  }

  get getRole(): string | null {
    return localStorage.getItem('role')
  }

  get getLoginStatus(): boolean{
    return !!localStorage.getItem('token')
  }

  getToken(): string | null {
    this.token = localStorage.getItem('token')
    return this.token
  }

  logout(): void{
    this.token = null
    this.isLoggedIn = false
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userid')
  }

  saveUserId(userid: string): void{
    localStorage.setItem('userid', userid)
  }
}
