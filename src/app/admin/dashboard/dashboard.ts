import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadService } from '../../services/lead';
import { BillService } from '../../services/bill';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  loading = true;
  stats = {
    totalLeads: 0,
    newLeads: 0,
    inProgressLeads: 0,
    completedLeads: 0,
    totalBills: 0,
    pendingPayments: 0
  };

  recentLeads: any[] = [];


  constructor(
    private leadService: LeadService,
    private billService: BillService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboard();
      console.log('Component Loaded');
  }

  loadDashboard() {
    this.loading = true;

    this.leadService.getAllLeads({}).subscribe({
      next: (res: any) => {

          console.log('USER DATA:', res);


        const leads = res.leads || [];
        this.stats.totalLeads = res.total || 0;
        this.stats.newLeads = leads.filter((l: any) => l.status === 'New').length;
        this.stats.inProgressLeads = leads.filter((l: any) => l.status === 'In Progress').length;
        this.stats.completedLeads = leads.filter((l: any) => l.status === 'Completed').length;
        this.recentLeads = leads.slice(0, 5);
        this.loading = false;
           this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });

    this.billService.getAllBills({}).subscribe({
      next: (res: any) => {
        this.stats.totalBills = res.total || 0;
        const bills = res.bills || [];
        this.stats.pendingPayments = bills.filter((b: any) => b.paymentStatus === 'Pending').length;
      },
      error: () => {}
    });
  }
}