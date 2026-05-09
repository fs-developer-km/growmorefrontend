import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadService } from '../../../services/lead';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-engineer-leads',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './engineer-leads.html',
  styleUrls: ['./engineer-leads.scss']
})
export class EngineerLeads implements OnInit {
  leads: any[] = [];
  filteredLeads: any[] = [];
  loading = true;
  selectedStatus = '';

  statusFilters = [
    { label: 'Sab', value: '' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  constructor(
    private leadService: LeadService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadLeads(); }

  loadLeads() {
    this.loading = true;
    this.leadService.getMyLeads().subscribe({
      next: (res: any) => {
        this.leads = res.leads || [];
        this.filteredLeads = this.leads;
        this.loading = false;
           this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Leads load nahi hue');
        this.loading = false;
      }
    });
  }

  filter(status: string) {
    this.selectedStatus = status;
    this.filteredLeads = status
      ? this.leads.filter(l => l.status === status)
      : this.leads;
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊', 'Washing Machine': '🌀',
      'Geyser': '🔥', 'TV': '📺', 'Microwave': '🍱', 'Cooler': '💨', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }

  getBadgeClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress', 'Completed': 'completed', 'Cancelled': 'cancelled'
    };
    return map[status] || '';
  }
}