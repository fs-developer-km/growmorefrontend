import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomerService } from '../../../services/customer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './customer-detail.html',
  styleUrls: ['./customer-detail.scss']
})
export class CustomerDetail implements OnInit {
  customer: any = null;
  leads: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadCustomer(id);
  }

  loadCustomer(id: string) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe({
      next: (res: any) => {
        this.customer = res.customer;
        this.leads = res.leads || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Customer load nahi hua');
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'CU';
  }

  getBadgeClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress',
      'Completed': 'completed', 'Cancelled': 'cancelled'
    };
    return map[status] || '';
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

  getTotalCompleted(): number {
    return this.leads.filter(l => l.status === 'Completed').length;
  }
}