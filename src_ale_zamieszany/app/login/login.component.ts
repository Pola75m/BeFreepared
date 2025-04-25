import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  loginUser() {
    this.http.post<any>('http://localhost:3000/login', { login: this.login, password: this.password })
      .subscribe({
        next: (res) => {
          alert('Login successful!');
          localStorage.setItem('user', JSON.stringify(res.user)); // store logged-in user
          this.router.navigate(['/home']);
        },
        error: (err) => alert('Login failed')
      });
  }
  goToSignUp() {
    this.router.navigate(['/sign-in']);
  }

}
