import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { AmcService } from '../../../services/amc';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-amc-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule
  ],
  templateUrl: './amc-list.html',
  styleUrls: ['./amc-list.scss']
})
export class AmcList implements OnInit {
  contracts: any[] = [];
  loading = true;
  exporting = false;
  searchQuery = '';
  selectedStatus = '';
  selectedPlan = '';
  total = 0;

  statusOptions = ['Active', 'Expired', 'Cancelled', 'Pending'];
  planOptions = ['Basic', 'Standard', 'Premium'];

  constructor(
    private amcService: AmcService,
    private toast: ToastService,
         private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadContracts(); }

  loadContracts() {
    this.loading = true;
    this.amcService.getAllContracts({
      status: this.selectedStatus,
      plan: this.selectedPlan,
      search: this.searchQuery
    }).subscribe({
      next: (res: any) => {
        this.contracts = res.contracts || [];
        this.total = res.total || 0;
        this.loading = false;
                 this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters() { this.loadContracts(); }

  clearFilters() {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedPlan = '';
    this.loadContracts();
  }

  getDaysLeft(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  getPlanColor(plan: string): string {
    const map: any = { 'Basic': '#6366F1', 'Standard': '#10B981', 'Premium': '#F59E0B' };
    return map[plan] || '#6366F1';
  }

  getStatusClass(status: string): string {
    const map: any = { 'Active': 'active', 'Expired': 'expired', 'Cancelled': 'cancelled', 'Pending': 'pending' };
    return map[status] || '';
  }

  getVisitsPercent(amc: any): number {
    if (!amc.totalFreeVisits) return 0;
    return Math.round((amc.usedVisits / amc.totalFreeVisits) * 100);
  }

  exportExcel() {
    this.exporting = true;
    this.amcService.exportExcel(this.selectedStatus).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amc-contracts-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Export ho gaya!');
        this.exporting = false;
      },
      error: () => { this.exporting = false; }
    });
  }

  downloadPdf(id: string, contractNumber: string, event: Event) {
    event.stopPropagation();
    this.amcService.downloadPdf(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contractNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('PDF download ho gaya!');
      },
      error: () => this.toast.error('PDF nahi mila')
    });
  }
}