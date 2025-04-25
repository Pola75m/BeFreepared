import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyListComponent } from './my-lists/my-lists.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MyArchivesComponent } from './my-archives/my-archives.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { EditingComponent } from "./editing/editing.component";
import { AuthGuard } from "./auth.guard";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'my-lists', component: MyListComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'my-archives', component: MyArchivesComponent, canActivate: [AuthGuard] },
  { path: 'editing', component: EditingComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // default to login now
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
