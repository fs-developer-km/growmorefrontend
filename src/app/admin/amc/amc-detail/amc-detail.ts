import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AmcService } from '../../../services/amc';
import { EngineerService } from '../../../services/engineer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-amc-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule, MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './amc-detail.html',
  styleUrls: ['./amc-detail.scss']
})
export class AmcDetail implements OnInit {
  amc: any = null;
  loading = true;
  engineers: any[] = [];

  // Actions state
  renewLoading = false;
  cancelLoading = false;
  downloadingPdf = false;
  gettingWa = false;
  addingVisit = false;
  addingPayment = false;
  showRenewForm = false;
  showVisitForm = false;
  showPaymentForm = false;

  // Forms
  renewForm = { amount: 0, paymentMethod: 'Cash', plan: '' };
  visitForm = { engineerId: '', workDone: '', notes: '', status: 'Completed' };
  paymentForm = { amount: 0, method: 'Cash', notes: '' };

  paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

  constructor(
    private route: ActivatedRoute,
    private amcService: AmcService,
    private engineerService: EngineerService,
    private toast: ToastService,
       private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAmc(id);
      this.loadEngineers();
    }
  }

  loadAmc(id: string) {
    this.loading = true;
    this.amcService.getContractById(id).subscribe({
      next: (res: any) => {
        this.amc = res.amc;
        this.renewForm.amount = this.amc.amount;
        this.renewForm.plan = this.amc.plan;
        this.loading = false;
               this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  loadEngineers() {
    this.engineerService.getAllEngineers().subscribe({
      next: (res: any) => { this.engineers = res.engineers || []; },
      error: () => {}
    });
  }

  downloadPdf() {
    this.downloadingPdf = true;
    this.amcService.downloadPdf(this.amc._id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.amc.contractNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Certificate download ho gaya!');
        this.downloadingPdf = false;
      },
      error: () => {
        this.toast.error('PDF nahi aaya');
        this.downloadingPdf = false;
      }
    });
  }

  shareWhatsApp() {
    this.gettingWa = true;
    this.amcService.getWhatsappLink(this.amc._id).subscribe({
      next: (res: any) => {
        window.open(res.waLink, '_blank');
        this.toast.success('WhatsApp open ho gaya!');
        this.gettingWa = false;
      },
      error: () => { this.gettingWa = false; }
    });
  }

  renewContract() {
    this.renewLoading = true;
    this.amcService.renewContract(this.amc._id, this.renewForm).subscribe({
      next: (res: any) => {
        this.toast.success('Contract renew ho gaya! ✅');
        this.amc = res.amc;
        this.showRenewForm = false;
        this.renewLoading = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Renew nahi hua');
        this.renewLoading = false;
      }
    });
  }

  cancelContract() {
    if (!confirm('Contract cancel karna chahte ho?')) return;
    this.cancelLoading = true;
    this.amcService.cancelContract(this.amc._id).subscribe({
      next: () => {
        this.amc.status = 'Cancelled';
        this.toast.success('Contract cancel ho gaya');
        this.cancelLoading = false;
      },
      error: () => { this.cancelLoading = false; }
    });
  }

  addVisit() {
    this.addingVisit = true;
    this.amcService.addVisit(this.amc._id, this.visitForm).subscribe({
      next: (res: any) => {
        this.amc.visits = res.visits;
        if (this.visitForm.status === 'Completed') this.amc.usedVisits++;
        this.toast.success('Visit record ho gayi!');
        this.showVisitForm = false;
        this.visitForm = { engineerId: '', workDone: '', notes: '', status: 'Completed' };
        this.addingVisit = false;
      },
      error: () => { this.addingVisit = false; }
    });
  }

  addPayment() {
    this.addingPayment = true;
    this.amcService.addPayment(this.amc._id, this.paymentForm).subscribe({
      next: (res: any) => {
        this.amc = res.amc;
        this.toast.success('Payment record ho gaya!');
        this.showPaymentForm = false;
        this.paymentForm = { amount: 0, method: 'Cash', notes: '' };
        this.addingPayment = false;
      },
      error: () => { this.addingPayment = false; }
    });
  }

  getPlanColor(plan: string): string {
    const map: any = { 'Basic': '#6366F1', 'Standard': '#10B981', 'Premium': '#F59E0B' };
    return map[plan] || '#10B981';
  }

  getStatusClass(status: string): string {
    const map: any = { 'Active': 'active', 'Expired': 'expired', 'Cancelled': 'cancelled', 'Pending': 'pending' };
    return map[status] || '';
  }

  getVisitsPercent(): number {
    if (!this.amc?.totalFreeVisits) return 0;
    return Math.round((this.amc.usedVisits / this.amc.totalFreeVisits) * 100);
  }

  getRemainingVisits(): number {
    return Math.max(0, this.amc.totalFreeVisits - this.amc.usedVisits);
  }

  getDaysLeft(): number {
    const now = new Date();
    const end = new Date(this.amc.endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
}