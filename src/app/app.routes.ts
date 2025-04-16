import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyListsComponent } from './my-lists/my-lists.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MyArchivesComponent } from './my-archives/my-archives.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'my-lists', component: MyListsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'my-archives', component: MyArchivesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SignInComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
