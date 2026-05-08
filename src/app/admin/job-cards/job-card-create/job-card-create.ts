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
import { MatDividerModule } from '@angular/material/divider';
import { JobCardService } from '../../../services/job-card';
import { LeadService } from '../../../services/lead';
import { PartService } from '../../../services/part';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-job-card-create',
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
    MatDividerModule
  ],
  templateUrl: './job-card-create.html',
  styleUrls: ['./job-card-create.scss']
})
export class JobCardCreate implements OnInit {
  jobForm!: FormGroup;
  loading = false;
  lead: any = null;
  parts: any[] = [];
  leadId = '';

  applianceTypes = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser', 'Microwave', 'TV', 'Cooler', 'Other'];
  serviceTypes = ['Repair', 'Installation', 'Uninstallation', 'Shifting', 'AMC', 'Inspection', 'Other'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobCardService: JobCardService,
    private leadService: LeadService,
    private partService: PartService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.leadId = this.route.snapshot.paramMap.get('leadId') || '';

    this.jobForm = this.fb.group({
      applianceType: ['', Validators.required],
      serviceType: ['', Validators.required],
      problemDescription: [''],
      workDone: ['', Validators.required],
      partsUsed: this.fb.array([]),
      serviceCharge: [0],
      remarks: ['']
    });

    if (this.leadId) this.loadLead();
    this.loadParts();
  }

  loadLead() {
    this.leadService.getLeadById(this.leadId).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.jobForm.patchValue({
          applianceType: this.lead.applianceType,
          serviceType: this.lead.serviceType,
          problemDescription: this.lead.description
        });
      },
      error: () => this.toast.error('Lead load nahi hua')
    });
  }

  loadParts() {
    this.partService.getAllParts().subscribe({
      next: (res: any) => { this.parts = res.parts || []; },
      error: () => {}
    });
  }

  get partsArray(): FormArray {
    return this.jobForm.get('partsUsed') as FormArray;
  }

  addPart() {
    this.partsArray.push(this.fb.group({
      partId: [''],
      quantity: [1, [Validators.min(1)]]
    }));
  }

  removePart(index: number) {
    this.partsArray.removeAt(index);
  }

  getPartName(partId: string): string {
    const part = this.parts.find(p => p._id === partId);
    return part ? `${part.name} (Stock: ${part.stock})` : '';
  }

  calculateTotal(): number {
    let total = Number(this.jobForm.get('serviceCharge')?.value) || 0;
    this.partsArray.controls.forEach(ctrl => {
      const partId = ctrl.get('partId')?.value;
      const qty = ctrl.get('quantity')?.value || 0;
      const part = this.parts.find(p => p._id === partId);
      if (part) total += part.salePrice * qty;
    });
    return total;
  }

  onSubmit() {
    if (this.jobForm.invalid || !this.lead) return;
    this.loading = true;

    const formVal = this.jobForm.value;
    const payload = {
      leadId: this.leadId,
      customerId: this.lead.customer._id,
      applianceType: formVal.applianceType,
      serviceType: formVal.serviceType,
      problemDescription: formVal.problemDescription,
      workDone: formVal.workDone,
      partsUsed: formVal.partsUsed.filter((p: any) => p.partId),
      serviceCharge: formVal.serviceCharge,
      remarks: formVal.remarks
    };

    this.jobCardService.createJobCard(payload).subscribe({
      next: (res: any) => {
        this.toast.success('Job Card ban gaya! ✅');
        this.router.navigate(['/admin/jobs', res.jobCard._id]);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Job card nahi bana');
        this.loading = false;
      }
    });
  }
}