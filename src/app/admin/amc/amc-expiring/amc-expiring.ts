import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AmcService } from '../../../services/amc';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-amc-expiring',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './amc-expiring.html',
  styleUrls: ['./amc-expiring.scss']
})
export class AmcExpiring implements OnInit {
  loading = true;
  contracts: any[] = [];
  grouped: any = { sevenDays: [], fifteenDays: [], thirtyDays: [] };
  selectedTab = 'all';

  constructor(
    private amcService: AmcService,
    private toast: ToastService,
        private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadExpiring(); }

  loadExpiring() {
    this.loading = true;
    this.amcService.getExpiringContracts().subscribe({
      next: (res: any) => {
        this.contracts = res.contracts || [];
        this.grouped = res.grouped || { sevenDays: [], fifteenDays: [], thirtyDays: [] };
        this.loading = false;
              this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  get displayContracts(): any[] {
    if (this.selectedTab === 'seven') return this.grouped.sevenDays || [];
    if (this.selectedTab === 'fifteen') return this.grouped.fifteenDays || [];
    if (this.selectedTab === 'thirty') return this.grouped.thirtyDays || [];
    return this.contracts;
  }

  getDaysLeft(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  getPlanColor(plan: string): string {
    const map: any = { 'Basic': '#6366F1', 'Standard': '#10B981', 'Premium': '#F59E0B' };
    return map[plan] || '#10B981';
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

  sendBulkReminders() {
    this.contracts.forEach(amc => {
      this.amcService.getWhatsappLink(amc._id).subscribe({
        next: () => {},
        error: () => {}
      });
    });
    this.toast.info(`${this.contracts.length} contracts ke liye reminder prepare ho gaya`);
  }
}