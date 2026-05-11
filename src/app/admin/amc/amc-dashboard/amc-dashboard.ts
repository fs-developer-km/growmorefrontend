import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AmcService } from '../../../services/amc';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-amc-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './amc-dashboard.html',
  styleUrls: ['./amc-dashboard.scss']
})
export class AmcDashboard implements OnInit {
  loading = true;
  expiringLoading = true;
  stats: any = null;
  expiringContracts: any[] = [];
  grouped: any = { sevenDays: [], fifteenDays: [], thirtyDays: [] };

  constructor(
    private amcService: AmcService,
    private toast: ToastService,
          private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadExpiring();
  }

  loadStats() {
    this.amcService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res.stats;
        this.loading = false;
         this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  loadExpiring() {
    this.amcService.getExpiringContracts().subscribe({
      next: (res: any) => {
        this.expiringContracts = res.contracts || [];
        this.grouped = res.grouped || { sevenDays: [], fifteenDays: [], thirtyDays: [] };
        this.expiringLoading = false;
      },
      error: () => { this.expiringLoading = false; }
    });
  }

  getDaysLeft(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDaysClass(days: number): string {
    if (days <= 7) return 'urgent';
    if (days <= 15) return 'warning';
    return 'normal';
  }

  getPlanColor(plan: string): string {
    const map: any = { 'Basic': '#6366F1', 'Standard': '#10B981', 'Premium': '#F59E0B' };
    return map[plan] || '#6366F1';
  }

  sendWhatsApp(amc: any) {
    this.amcService.getWhatsappLink(amc._id).subscribe({
      next: (res: any) => {
        window.open(res.waLink, '_blank');
        this.toast.success('WhatsApp open ho gaya!');
      },
      error: () => this.toast.error('WhatsApp link nahi mila')
    });
  }


  // export funciton for demo

  exportAll(){
    alert("this feature will be soon ...")
  }
}