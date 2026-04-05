import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl
  httpOptions: { headers: HttpHeaders }

  constructor(private http: HttpClient, private service:AuthService) {
    const token = service.getToken()
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
  }

  checkUsernameExists(username: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user/check-username?username=${username}`, this.httpOptions)
  }

  Login(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/login`, details)
  }

  registerUser(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/register`, details)
  }

  getEventByProfessional(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/professional/events?userId=${id}`, this.httpOptions)
  }

  GetAllProfessionals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/institution/event/professionals`, this.httpOptions)
  }

  getEventByInstitutionId(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/institution/events?institutionId=${id}`, this.httpOptions)
  }

  GetAllevents(): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}/api/participant/events`, this.httpOptions)
    return this.http.get<any>(`${this.apiUrl}/api/finance/events`, this.httpOptions)
  }

  viewAllEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/participant/events`, this.httpOptions)
  }

  viewEventStatus(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/participant/event/${id}/status`, this.httpOptions)
  }

  viewAllResourcesByEventId(eventId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/institution/event/${eventId}/resources`, this.httpOptions)
  }

  // Payment 
  createPaymentOrder(amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/participant/payment/create-order`, { amount }, this.httpOptions);
  }

  verifyAndEnroll(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/participant/payment/verify-and-enroll`, paymentData, this.httpOptions);
  }
  

  EnrollParticipant(eventId: any, userId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/participant/event/${eventId}/enroll?userId=${userId}`, {}, this.httpOptions)
  }

  checkEnrollment(eventId: any, userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/participant/event/${eventId}/check-enroll?userId=${userId}`, this.httpOptions)
  } 

  createEvent(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/institution/event`, details, this.httpOptions)
  }

  updateEvent(eventId: any, details: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/institution/event/${eventId}`, details, this.httpOptions)
  }

  deleteEvent(eventId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/institution/event/${eventId}`, this.httpOptions);
  }

  addResource(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/institution/event/${details.eventId}/resource`, details, this.httpOptions)
  }

  assignProfessionals(eventId: any, userId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/institution/event/${eventId}/professional?userId=${userId}`, {}, this.httpOptions)
  }

  UpdateEventStatus(eventId: any, status: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/professional/event/${eventId}/status?status=${status}`, {}, this.httpOptions)
  }

  AddFeedback(eventId: any, userId: any, details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/professional/event/${eventId}/feedback?userId=${userId}`, details, this.httpOptions)
  }

  AddFeedbackByParticipants(eventId: any, userId: any, details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/participant/event/${eventId}/feedback?userId=${userId}`, details, this.httpOptions)
  }

//   downloadCertificate(eventId: number) {
//   return this.http.get(
//     `/api/certificates/download/${eventId}`,
//     { responseType: 'blob' }
//   );
// }



// downloadCertificate(eventId: number) {
//   const token = localStorage.getItem('token');

//   return this.http.get(
//     `http://localhost:3000/api/certificates/download/${eventId}`,
//     {
//       responseType: 'blob',
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
// }
} 
