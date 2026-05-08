import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { JobCardService } from '../../../services/job-card';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-job-card-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './job-card-detail.html',
  styleUrls: ['./job-card-detail.scss']
})
export class JobCardDetail implements OnInit {
  jobCard: any = null;
  loading = true;
  completing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobCardService: JobCardService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadJobCard(id);
  }

  loadJobCard(id: string) {
    this.loading = true;
    this.jobCardService.getJobCard(id).subscribe({
      next: (res: any) => {
        this.jobCard = res.jobCard;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Job card load nahi hua');
        this.loading = false;
      }
    });
  }

  completeJob() {
    if (!confirm('Job complete mark karna chahte ho?')) return;
    this.completing = true;
    this.jobCardService.completeJob(this.jobCard._id).subscribe({
      next: () => {
        this.toast.success('Job complete ho gaya! ✅');
        this.jobCard.status = 'Completed';
        this.completing = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Complete nahi hua');
        this.completing = false;
      }
    });
  }

  goToBilling() {
    this.router.navigate(['/admin/bills/create'], {
      queryParams: {
        jobCardId: this.jobCard._id,
        customerId: this.jobCard.customer?._id,
        leadId: this.jobCard.lead
      }
    });
  }

  getPartsTotal(): number {
    if (!this.jobCard?.partsUsed) return 0;
    return this.jobCard.partsUsed.reduce((sum: number, p: any) => sum + (p.totalPrice || 0), 0);
  }

  getGrandTotal(): number {
    return this.getPartsTotal() + (this.jobCard?.serviceCharge || 0);
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Open': 'open',
      'In Progress': 'in-progress',
      'Completed': 'completed'
    };
    return map[status] || '';
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊',
      'Washing Machine': '🌀', 'Geyser': '🔥',
      'TV': '📺', 'Microwave': '🍱',
      'Cooler': '💨', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }
}