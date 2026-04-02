import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


import { AppComponent } from './app.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';

import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';

import { ViewEventsComponent } from './view-events/view-events.component';

import { AssignProfessionalComponent } from './assign-professional/assign-professional.component';
import { UpdateEventStatusComponent } from './update-event-status/update-event-status.component';
import { AddFeedbackComponent } from './add-feedback/add-feedback.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashbaordComponent, canActivate: [AuthGuard] },
  { path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard] },
  { path: 'add-resource', component: AddResourceComponent, canActivate: [AuthGuard] },
  { path: 'assign-professional', component: AssignProfessionalComponent, canActivate: [AuthGuard] },
  { path: 'update-event-status', component: UpdateEventStatusComponent, canActivate: [AuthGuard] },
  { path: 'add-feedback', component: AddFeedbackComponent, canActivate: [AuthGuard] },
  { path: 'view-events', component: ViewEventsComponent, canActivate: [AuthGuard] },


  { path: '', redirectTo: '/dashbaord', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashbaord', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
