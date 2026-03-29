import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {

    // check password match
    if (this.password !== this.confirmPassword) {
      alert('Password ไม่ตรงกัน');
      return;
    }

    const payload = {
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        alert('สมัครสำเร็จ');
        this.router.navigate(['/']);
      },
      error: (res) => {
        console.log(res); 
        alert('สมัครไม่สำเร็จ');
      }
    });
  }
  goLogin() {
    this.router.navigate(['/']);
  }
}