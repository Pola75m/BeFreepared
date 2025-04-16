import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MyListsComponent } from "./my-lists/my-lists.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { MyArchivesComponent } from "./my-archives/my-archives.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, MyListsComponent, CalendarComponent, HomeComponent, LoginComponent, MyArchivesComponent, SignInComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projektAngular';
}
