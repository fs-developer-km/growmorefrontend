import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { LeadService } from '../../../services/lead';
import { EngineerService } from '../../../services/engineer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './lead-detail.html',
  styleUrls: ['./lead-detail.scss']
})
export class LeadDetail implements OnInit {
  lead: any = null;
  engineers: any[] = [];
  loading = true;
  assigning = false;
  updatingStatus = false;

  selectedEngineerId = '';
  selectedStatus = '';
  remarks = '';

  statusOptions = ['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private engineerService: EngineerService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLead(id);
      this.loadEngineers();
    }
  }

  loadLead(id: string) {
    this.loading = true;
    this.leadService.getLeadById(id).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.selectedStatus = this.lead.status;
        this.selectedEngineerId = this.lead.assignedTo?._id || '';
        this.loading = false;
      },
      error: () => {
        this.toast.error('Lead load nahi hui');
        this.loading = false;
      }
    });
  }

  loadEngineers() {
    this.engineerService.getAllEngineers().subscribe({
      next: (res: any) => {
        this.engineers = res.engineers || [];
      },
      error: () => {}
    });
  }

  assignEngineer() {
    if (!this.selectedEngineerId) {
      this.toast.error('Pehle engineer select karo');
      return;
    }
    this.assigning = true;
    this.leadService.assignLead(this.lead._id, this.selectedEngineerId).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.toast.success('Engineer assign ho gaya! ✅');
        this.assigning = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Assign nahi hua');
        this.assigning = false;
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
        this.toast.error(err.error?.message || 'Status update nahi hua');
        this.updatingStatus = false;
      }
    });
  }

  getBadgeClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress',
      'Completed': 'completed', 'Cancelled': 'cancelled'
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