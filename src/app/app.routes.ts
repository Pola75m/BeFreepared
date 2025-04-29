//plik ze wszystkimi routami...
import { NgModule } from '@angular/core'; //przydatne
import { RouterModule, Routes } from '@angular/router'; //potrzebne do poruszania się między componentami
import { HomeComponent } from './home/home.component'; //ten i niżej componenty
import { MyListComponent } from './my-lists/my-lists.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { MyArchivesComponent } from './my-archives/my-archives.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { EditingComponent } from "./editing/editing.component";
import { AuthGuard } from "./auth.guard"; //plik do autentykacji userów

//export routes wszystkich componentów
export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'my-lists', component: MyListComponent, canActivate: [AuthGuard] },
  { path: 'calendar-page', component: CalendarPageComponent, canActivate: [AuthGuard] },
  { path: 'my-archives', component: MyArchivesComponent, canActivate: [AuthGuard] },
  { path: 'editing', component: EditingComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // default do strony logowania
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
