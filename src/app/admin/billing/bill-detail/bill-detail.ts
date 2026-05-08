import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BillService } from '../../../services/bill';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-bill-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './bill-detail.html',
  styleUrls: ['./bill-detail.scss']
})
export class BillDetail implements OnInit {
  bill: any = null;
  loading = true;
  downloadingPdf = false;
  gettingWaLink = false;
  updatingPayment = false;

  selectedPaymentStatus = '';
  selectedPaymentMethod = '';
  paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

  constructor(
    private route: ActivatedRoute,
    private billService: BillService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadBill(id);
  }

  loadBill(id: string) {
    this.loading = true;
    this.billService.getBillById(id).subscribe({
      next: (res: any) => {
        this.bill = res.bill;
        this.selectedPaymentStatus = this.bill.paymentStatus;
        this.selectedPaymentMethod = this.bill.paymentMethod;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Bill load nahi hua');
        this.loading = false;
      }
    });
  }

  downloadPdf() {
    this.downloadingPdf = true;
    this.billService.downloadPdf(this.bill._id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bill-${this.bill.billNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('PDF download ho gaya! ✅');
        this.downloadingPdf = false;
      },
      error: () => {
        this.toast.error('PDF download nahi hua');
        this.downloadingPdf = false;
      }
    });
  }

  shareOnWhatsApp() {
    this.gettingWaLink = true;
    this.billService.getWhatsappLink(this.bill._id).subscribe({
      next: (res: any) => {
        window.open(res.waLink, '_blank');
        this.bill.whatsappSent = true;
        this.toast.success('WhatsApp open ho gaya! ✅');
        this.gettingWaLink = false;
      },
      error: () => {
        this.toast.error('WhatsApp link nahi mila');
        this.gettingWaLink = false;
      }
    });
  }

  updatePayment() {
    this.updatingPayment = true;
    this.billService.updatePayment(this.bill._id, {
      paymentStatus: this.selectedPaymentStatus,
      paymentMethod: this.selectedPaymentMethod
    }).subscribe({
      next: () => {
        this.bill.paymentStatus = this.selectedPaymentStatus;
        this.bill.paymentMethod = this.selectedPaymentMethod;
        this.toast.success('Payment update ho gaya! ✅');
        this.updatingPayment = false;
      },
      error: () => {
        this.toast.error('Update nahi hua');
        this.updatingPayment = false;
      }
    });
  }

  getPaymentBadge(status: string): string {
    const map: any = { 'Paid': 'paid', 'Pending': 'pending', 'Partial': 'partial' };
    return map[status] || '';
  }
}