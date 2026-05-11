import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AmcService } from '../../../services/amc';
import { CustomerService } from '../../../services/customer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-amc-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './amc-create.html',
  styleUrls: ['./amc-create.scss']
})
export class AmcCreate implements OnInit {
  amcForm!: FormGroup;
  loading = false;
  customerSearch = '';
  customers: any[] = [];
  selectedCustomer: any = null;
  searchingCustomer = false;
  private searchSubject = new Subject<string>();

  plans = [
    { value: 'Basic', label: 'Basic Plan', visits: 2, desc: '2 free visits/year', color: '#6366F1' },
    { value: 'Standard', label: 'Standard Plan', visits: 4, desc: '4 free visits/year', color: '#10B981' },
    { value: 'Premium', label: 'Premium Plan', visits: 6, desc: '6 free visits/year + priority', color: '#F59E0B' }
  ];

  selectedPlan: any = null;
  applianceTypes = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser', 'Microwave', 'TV', 'Cooler', 'Other'];
  paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

  defaultTerms = `1. AMC covers regular maintenance visits as per plan.
2. Spare parts will be charged extra unless mentioned.
3. Contract is non-transferable.
4. Emergency calls beyond free visits will be charged.
5. GrowMore Appliances reserves the right to modify terms.`;

  constructor(
    private fb: FormBuilder,
    private amcService: AmcService,
    private customerService: CustomerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(q => {
      if (q.length >= 2) this.searchCustomers(q);
      else this.customers = [];
    });
  }

  initForm() {
    this.amcForm = this.fb.group({
      plan: ['Standard', Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['Cash'],
      totalFreeVisits: [4],
      appliances: this.fb.array([]),
      notes: [''],
      terms: [this.defaultTerms]
    });

    this.addAppliance();
  }

  get appliancesArray(): FormArray {
    return this.amcForm.get('appliances') as FormArray;
  }

  addAppliance() {
    this.appliancesArray.push(this.fb.group({
      type: ['AC', Validators.required],
      brand: [''],
      model: [''],
      serialNumber: [''],
      purchaseYear: ['']
    }));
  }

  removeAppliance(i: number) {
    if (this.appliancesArray.length > 1) this.appliancesArray.removeAt(i);
  }

  onCustomerSearch(q: string) { this.searchSubject.next(q); }

  searchCustomers(q: string) {
    this.searchingCustomer = true;
    this.customerService.getAllCustomers(q).subscribe({
      next: (res: any) => {
        this.customers = res.customers || [];
        this.searchingCustomer = false;
      },
      error: () => { this.searchingCustomer = false; }
    });
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.customerSearch = customer.name + ' — ' + customer.phone;
    this.customers = [];
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.amcForm.patchValue({
      plan: plan.value,
      totalFreeVisits: plan.visits
    });
  }

  getAmountByPlan(): string {
    const plan = this.amcForm.get('plan')?.value;
    const map: any = { 'Basic': '2000-3000', 'Standard': '4000-6000', 'Premium': '8000-12000' };
    return map[plan] || '';
  }

  onSubmit() {
    if (this.amcForm.invalid || !this.selectedCustomer) {
      if (!this.selectedCustomer) this.toast.error('Customer select karo');
      return;
    }

    this.loading = true;
    const formVal = this.amcForm.value;

    const payload = {
      customerId: this.selectedCustomer._id,
      plan: formVal.plan,
      appliances: formVal.appliances,
      startDate: formVal.startDate,
      amount: formVal.amount,
      paymentMethod: formVal.paymentMethod,
      totalFreeVisits: formVal.totalFreeVisits,
      notes: formVal.notes,
      terms: formVal.terms
    };

    this.amcService.createContract(payload).subscribe({
      next: (res: any) => {
        this.toast.success('AMC Contract ban gaya! ✅');
        this.router.navigate(['/admin/amc', res.amc._id]);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Contract nahi bana');
        this.loading = false;
      }
    });
  }
}