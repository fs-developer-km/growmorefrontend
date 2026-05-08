import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LeadService } from '../../../services/lead';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './lead-list.html',
  styleUrls: ['./lead-list.scss']
})
export class LeadList implements OnInit {
  leads: any[] = [];
  filteredLeads: any[] = [];
  loading = true;
  selectedStatus = '';

  statusOptions = ['', 'New', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

  statusCounts: any = {
    all: 0, New: 0, Assigned: 0,
    'In Progress': 0, Completed: 0, Cancelled: 0
  };

  constructor(
    private leadService: LeadService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.loading = true;
    this.leadService.getAllLeads({ limit: 100 }).subscribe({
      next: (res: any) => {
        this.leads = res.leads || [];
        this.filteredLeads = this.leads;
        this.calculateCounts();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Leads load nahi hui');
        this.loading = false;
      }
    });
  }

  calculateCounts() {
    this.statusCounts.all = this.leads.length;
    ['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].forEach(s => {
      this.statusCounts[s] = this.leads.filter(l => l.status === s).length;
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (!status) {
      this.filteredLeads = this.leads;
    } else {
      this.filteredLeads = this.leads.filter(l => l.status === status);
    }
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
}