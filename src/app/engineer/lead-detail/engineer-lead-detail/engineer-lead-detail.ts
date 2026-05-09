import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { LeadService } from '../../../services/lead';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-engineer-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './engineer-lead-detail.html',
  styleUrls: ['./engineer-lead-detail.scss']
})
export class EngineerLeadDetail implements OnInit {
  lead: any = null;
  loading = true;
  updatingStatus = false;

  selectedStatus = '';
  remarks = '';
  statusOptions = ['Assigned', 'In Progress', 'Completed', 'Cancelled'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private toast: ToastService,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadLead(id);
  }

  loadLead(id: string) {
    this.loading = true;
    this.leadService.getLeadById(id).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.selectedStatus = this.lead.status;
        this.loading = false;
          this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Lead load nahi hui');
        this.loading = false;
      }
    });
  }

  updateStatus() {
    this.updatingStatus = true;
    this.leadService.updateStatus(this.lead._id, this.selectedStatus, this.remarks).subscribe({
      next: () => {
        this.lead.status = this.selectedStatus;
        this.toast.success('Status update ho gaya! ✅');
        this.updatingStatus = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Update nahi hua');
        this.updatingStatus = false;
      }
    });
  }

  goToJobCard() {
    this.router.navigate(['/engineer/jobs/create', this.lead._id]);
  }

  goToBill() {
    this.router.navigate(['/engineer/bills/create'], {
      queryParams: {
        customerId: this.lead.customer?._id,
        leadId: this.lead._id
      }
    });
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊', 'Washing Machine': '🌀',
      'Geyser': '🔥', 'TV': '📺', 'Microwave': '🍱', 'Cooler': '💨', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }

  getBadgeClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress', 'Completed': 'completed', 'Cancelled': 'cancelled'
    };
    return map[status] || '';
  }
}