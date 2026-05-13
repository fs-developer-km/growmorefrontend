import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { LeadService } from '../../../services/lead';
import { CustomerService } from '../../../services/customer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-lead-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './lead-add.html',
  styleUrls: ['./lead-add.scss']
})
export class LeadAdd implements OnInit {
  leadForm!: FormGroup;
  loading = false;
  customerSearch = '';
  customers: any[] = [];
  selectedCustomer: any = null;
  searchingCustomer = false;
  isRepeatCustomer = false;
  private searchSubject = new Subject<string>();

  applianceTypes = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser',
                    'Microwave', 'TV', 'Cooler', 'LED', 'Chimney', 'Other'];

  subProductMap: any = {
    'AC': ['Split', 'Window', 'Cassette', 'Tower', 'Portable'],
    'Refrigerator': ['Single Door', 'Double Door', 'Side by Side'],
    'Washing Machine': ['Fully Automatic', 'Semi Automatic', 'Front Load', 'Top Load'],
    'Geyser': ['Electric', 'Gas', 'Solar'],
    'LED': ['32 inch', '40 inch', '43 inch', '55 inch', 'Other'],
    'Chimney': ['Wall Mount', 'Island', 'Built-in'],
    'default': ['Standard', 'Other']
  };

  subProduct2Map: any = {
    'Washing Machine': ['Front Load', 'Top Load'],
    'AC': ['Inverter', 'Non-Inverter', '1 Ton', '1.5 Ton', '2 Ton'],
    'Refrigerator': ['Frost Free', 'Direct Cool']
  };

  serviceTypes = ['Repair', 'Installation', 'Uninstallation',
                  'Re-Installation', 'Shifting', 'AMC',
                  'Inspection', 'Service', 'Other'];

  timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '10:00-11:00 AM',
               '11:00 AM', '12:00 PM', '12:00-02:00 PM',
               '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 'Flexible'];

  sources = ['Phone Call', 'Website', 'WhatsApp', 'Referral', 'Walk-in', 'Other'];
  priorities = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
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
      else { this.customers = []; }
    });
  }

  initForm() {
    this.leadForm = this.fb.group({
      customerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      alternatePhone: [''],
      area: [''],
      reference: [''],
      applianceType: ['', Validators.required],
      subProduct: [''],
      subProduct2: [''],
      serviceType: ['', Validators.required],
      description: [''],
      customerType: ['Fresh'],
      scheduledDate: [''],
      appointmentTime: [''],
      estimateAmount: [0],
      priority: ['Medium'],
      source: ['Phone Call']
    });

    this.leadForm.get('applianceType')?.valueChanges.subscribe(() => {
      this.leadForm.patchValue({ subProduct: '', subProduct2: '' });
    });
  }

  getSubProducts(): string[] {
    const type = this.leadForm.get('applianceType')?.value;
    return this.subProductMap[type] || this.subProductMap['default'];
  }

  getSubProduct2(): string[] {
    const type = this.leadForm.get('applianceType')?.value;
    return this.subProduct2Map[type] || [];
  }

  onCustomerPhoneInput(phone: string) {
    this.searchSubject.next(phone);
  }

  searchCustomers(q: string) {
    this.searchingCustomer = true;
    this.customerService.getAllCustomers(q).subscribe({
      next: (res: any) => {
        this.customers = res.customers || [];
        if (this.customers.length > 0) {
          const match = this.customers.find(c => c.phone === q);
          if (match) this.selectCustomer(match);
        }
        this.searchingCustomer = false;
      },
      error: () => { this.searchingCustomer = false; }
    });
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.isRepeatCustomer = true;
    this.leadForm.patchValue({
      customerPhone: customer.phone,
      customerName: customer.name,
      customerAddress: customer.address,
      alternatePhone: customer.alternatePhone || '',
      area: customer.area || '',
      customerType: 'Repeat'
    });
    this.customers = [];
  }

  clearCustomer() {
    this.selectedCustomer = null;
    this.isRepeatCustomer = false;
    this.customerSearch = '';
    this.leadForm.patchValue({
      customerPhone: '', customerName: '',
      customerAddress: '', alternatePhone: '',
      area: '', customerType: 'Fresh'
    });
  }

  onSubmit() {
    if (this.leadForm.invalid) return;
    this.loading = true;

    this.leadService.createLead(this.leadForm.value).subscribe({
      next: () => {
        this.toast.success('Lead created successfully!');
        this.router.navigate(['/admin/leads']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create lead');
        this.loading = false;
      }
    });
  }
}