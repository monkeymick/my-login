import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private router: Router,
    private authService: AuthService
  ) {}

  onLogin() {
    const payload = {
      username: this.username,
      password: this.password
    };

    console.log('Sending:', payload);

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Login ไม่สำเร็จ');
      }
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}