import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BillService } from '../../../services/bill';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bill-list.html',
  styleUrls: ['./bill-list.scss']
})
export class BillList implements OnInit {
  bills: any[] = [];
  filteredBills: any[] = [];
  loading = true;
  selectedFilter = '';

  filters = [
    { label: 'Sab', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Partial', value: 'Partial' }
  ];

  totalRevenue = 0;
  paidRevenue = 0;
  pendingRevenue = 0;

  constructor(
    private billService: BillService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadBills(); }

  loadBills() {
    this.loading = true;
    this.billService.getAllBills({ limit: 100 }).subscribe({
      next: (res: any) => {
        this.bills = res.bills || [];
        this.filteredBills = this.bills;
        this.calculateRevenue();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Bills load nahi hue');
        this.loading = false;
      }
    });
  }

  calculateRevenue() {
    this.totalRevenue = this.bills.reduce((s, b) => s + b.grandTotal, 0);
    this.paidRevenue = this.bills
      .filter(b => b.paymentStatus === 'Paid')
      .reduce((s, b) => s + b.grandTotal, 0);
    this.pendingRevenue = this.bills
      .filter(b => b.paymentStatus === 'Pending')
      .reduce((s, b) => s + b.grandTotal, 0);
  }

  filterBills(status: string) {
    this.selectedFilter = status;
    this.filteredBills = status
      ? this.bills.filter(b => b.paymentStatus === status)
      : this.bills;
  }

  getPaymentBadge(status: string): string {
    const map: any = { 'Paid': 'paid', 'Pending': 'pending', 'Partial': 'partial' };
    return map[status] || '';
  }

  downloadPdf(billId: string, billNumber: string, event: Event) {
    event.stopPropagation();
    this.billService.downloadPdf(billId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bill-${billNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('PDF download ho gaya! ✅');
      },
      error: () => this.toast.error('PDF download nahi hua')
    });
  }
}