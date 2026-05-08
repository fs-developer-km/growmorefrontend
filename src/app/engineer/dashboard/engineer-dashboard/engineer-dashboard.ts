import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadService } from '../../../services/lead';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-engineer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './engineer-dashboard.html',
  styleUrls: ['./engineer-dashboard.scss']
})
export class EngineerDashboard implements OnInit {
  loading = true;
  currentUser: any;
  myLeads: any[] = [];

  stats = {
    total: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0
  };

  todayLeads: any[] = [];
  recentLeads: any[] = [];

  greeting = '';

  constructor(
    private leadService: LeadService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setGreeting();
  }

  ngOnInit() {
    this.loadMyLeads();
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  loadMyLeads() {
    this.loading = true;
    this.leadService.getMyLeads().subscribe({
      next: (res: any) => {
        this.myLeads = res.leads || [];
        this.calculateStats();
        this.filterTodayLeads();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  calculateStats() {
    this.stats.total = this.myLeads.length;
    this.stats.assigned = this.myLeads.filter(l => l.status === 'Assigned').length;
    this.stats.inProgress = this.myLeads.filter(l => l.status === 'In Progress').length;
    this.stats.completed = this.myLeads.filter(l => l.status === 'Completed').length;
  }

  filterTodayLeads() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.todayLeads = this.myLeads.filter(l => {
      if (!l.scheduledDate) return false;
      const d = new Date(l.scheduledDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    this.recentLeads = this.myLeads.slice(0, 5);
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊',
      'Washing Machine': '🌀', 'Geyser': '🔥',
      'TV': '📺', 'Microwave': '🍱',
      'Cooler': '💨', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }

  getBadgeClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress',
      'Completed': 'completed', 'Cancelled': 'cancelled'
    };
    return map[status] || '';
  }

  getFirstName(): string {
    return this.currentUser?.name?.split(' ')[0] || 'Engineer';
  }
}