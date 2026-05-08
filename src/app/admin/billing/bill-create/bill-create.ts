import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { BillService } from '../../../services/bill';
import { JobCardService } from '../../../services/job-card';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-bill-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  templateUrl: './bill-create.html',
  styleUrls: ['./bill-create.scss']
})
export class BillCreate implements OnInit {
  billForm!: FormGroup;
  loading = false;
  jobCard: any = null;
  loadingJobCard = false;
  gstEnabled = false;

  paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

  // Query params
  jobCardId = '';
  customerId = '';
  leadId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private jobCardService: JobCardService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    // Query params se data lo
    this.route.queryParams.subscribe(params => {
      this.jobCardId = params['jobCardId'] || '';
      this.customerId = params['customerId'] || '';
      this.leadId = params['leadId'] || '';
    });

    this.initForm();

    // Job card se auto fill
    if (this.jobCardId) {
      this.loadJobCard();
    }
  }

  initForm() {
    this.billForm = this.fb.group({
      partsUsed: this.fb.array([]),
      serviceCharge: [0, Validators.min(0)],
      gstPercent: [0],
      discount: [0, Validators.min(0)],
      paymentMethod: ['Cash'],
      paymentStatus: ['Pending'],
      notes: ['']
    });
  }

  loadJobCard() {
    this.loadingJobCard = true;
    this.jobCardService.getJobCard(this.jobCardId).subscribe({
      next: (res: any) => {
        this.jobCard = res.jobCard;
        this.autoFillFromJobCard();
        this.loadingJobCard = false;
      },
      error: () => {
        this.toast.error('Job card load nahi hua');
        this.loadingJobCard = false;
      }
    });
  }

  autoFillFromJobCard() {
    if (!this.jobCard) return;

    // Service charge fill karo
    this.billForm.patchValue({
      serviceCharge: this.jobCard.serviceCharge || 0
    });

    // Parts fill karo
    const partsArray = this.billForm.get('partsUsed') as FormArray;
    partsArray.clear();

    if (this.jobCard.partsUsed && this.jobCard.partsUsed.length > 0) {
      this.jobCard.partsUsed.forEach((part: any) => {
        partsArray.push(this.fb.group({
          partName: [part.partName, Validators.required],
          quantity: [part.quantity, [Validators.required, Validators.min(1)]],
          salePrice: [part.salePrice, [Validators.required, Validators.min(0)]],
          totalPrice: [part.totalPrice]
        }));
      });
    }
  }

  get partsArray(): FormArray {
    return this.billForm.get('partsUsed') as FormArray;
  }

  addPart() {
    this.partsArray.push(this.fb.group({
      partName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [0]
    }));
  }

  removePart(i: number) {
    this.partsArray.removeAt(i);
  }

  updatePartTotal(index: number) {
    const part = this.partsArray.at(index);
    const qty = part.get('quantity')?.value || 0;
    const price = part.get('salePrice')?.value || 0;
    part.patchValue({ totalPrice: qty * price });
  }

  getPartsTotal(): number {
    return this.partsArray.controls.reduce((sum, ctrl) => {
      return sum + (ctrl.get('totalPrice')?.value || 0);
    }, 0);
  }

  getSubtotal(): number {
    return this.getPartsTotal() + (Number(this.billForm.get('serviceCharge')?.value) || 0);
  }

  getGstAmount(): number {
    if (!this.gstEnabled) return 0;
    const gstPercent = Number(this.billForm.get('gstPercent')?.value) || 0;
    return Math.round((this.getSubtotal() * gstPercent) / 100);
  }

  getDiscount(): number {
    return Number(this.billForm.get('discount')?.value) || 0;
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getGstAmount() - this.getDiscount();
  }

  toggleGst() {
    this.gstEnabled = !this.gstEnabled;
    if (!this.gstEnabled) {
      this.billForm.patchValue({ gstPercent: 0 });
    } else {
      this.billForm.patchValue({ gstPercent: 18 });
    }
  }

  onSubmit() {
    if (this.billForm.invalid) return;
    if (!this.customerId) {
      this.toast.error('Customer ID missing hai');
      return;
    }

    this.loading = true;
    const formVal = this.billForm.value;

    const payload = {
      customerId: this.customerId,
      jobCardId: this.jobCardId || undefined,
      leadId: this.leadId || undefined,
      partsUsed: formVal.partsUsed.map((p: any) => ({
        partName: p.partName,
        quantity: p.quantity,
        salePrice: p.salePrice,
        totalPrice: p.totalPrice || (p.quantity * p.salePrice)
      })),
      serviceCharge: formVal.serviceCharge,
      gstPercent: this.gstEnabled ? formVal.gstPercent : 0,
      discount: formVal.discount,
      grandTotal: this.getGrandTotal(),
      paymentMethod: formVal.paymentMethod,
      paymentStatus: formVal.paymentStatus,
      notes: formVal.notes
    };

    this.billService.createBill(payload).subscribe({
      next: (res: any) => {
        this.toast.success('Bill ban gaya! ✅');
        this.router.navigate(['/admin/bills', res.bill._id]);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Bill nahi bana');
        this.loading = false;
      }
    });
  }
}