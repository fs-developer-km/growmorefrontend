import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadService } from '../../../services/lead';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-lead-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lead-add.html',
  styleUrls: ['./lead-add.scss']
})
export class LeadAdd implements OnInit {
  leadForm!: FormGroup;
  loading = false;

  applianceTypes = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser', 'Microwave', 'TV', 'Cooler', 'Other'];
  serviceTypes = ['Repair', 'Installation', 'Uninstallation', 'Shifting', 'AMC', 'Inspection', 'Other'];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.leadForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      customerAddress: ['', Validators.required],
      area: [''],
      applianceType: ['', Validators.required],
      serviceType: ['', Validators.required],
      description: [''],
      scheduledDate: ['']
    });
  }

  onSubmit() {
    if (this.leadForm.invalid) return;

    this.loading = true;
    this.leadService.createLead(this.leadForm.value).subscribe({
      next: () => {
        this.toast.success('Lead successfully add ho gayi! ✅');
        this.router.navigate(['/admin/leads']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Lead add nahi hui, dobara try karo');
        this.loading = false;
      }
    });
  }
}