import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  username: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}