import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeadService } from '../../../services/lead';
import { EngineerService } from '../../../services/engineer';
import { BillService } from '../../../services/bill';
import { ToastService } from '../../../services/toast';


@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatDividerModule, MatTooltipModule
  ],
  templateUrl: './lead-detail.html',
  styleUrls: ['./lead-detail.scss']
})
export class LeadDetail implements OnInit {
  lead: any = null;
  engineers: any[] = [];
  loading = true;

  // Panel states
  activeTab = 'overview';
  tabs = [
    { key: 'overview', label: 'Overview', icon: 'dashboard' },
    { key: 'financial', label: 'Financials', icon: 'payments' },
    { key: 'timeline', label: 'Timeline', icon: 'timeline' },
    { key: 'notes', label: 'Notes', icon: 'sticky_note_2' },
    { key: 'happycall', label: 'Happy Call', icon: 'phone_in_talk' },
  ];

  // Inline editing
  editingField: string | null = null;
  editValues: any = {};

  // Actions loading
  assigningEngineer = false;
  updatingStatus = false;
  updatingFinancials = false;
  updatingHappyCall = false;
  addingNote = false;
  downloadingPdf = false;

  // Form values
  selectedEngineerId = '';
  selectedStatus = '';
  remarks = '';
  newNote = '';

  financialForm = {
    totalAmount: 0,
    partsLpCost: 0,
    finalAmount: 0,
    companyShare: 0,
    engineerShare: 0,
    workRemark: ''
  };

  happyCallForm = {
    called: false,
    satisfied: null as boolean | null,
    remarks: '',
    followUpRequired: false
  };

  statusOptions = ['New', 'Scheduled', 'Assigned', 'In Progress', 'Pending', 'Completed', 'Cancelled'];
  timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '10:00-11:00 AM',
               '11:00 AM', '12:00 PM', '12:00-02:00 PM',
               '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 'Flexible'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private engineerService: EngineerService,
    private billService: BillService,
    private toast: ToastService,
        private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.loadLead(id); this.loadEngineers(); }
  }

  loadLead(id: string) {
    this.loading = true;
    this.leadService.getLeadById(id).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.selectedStatus = this.lead.status;
        this.selectedEngineerId = this.lead.assignedTo?._id || '';
        this.syncFinancialForm();
        this.syncHappyCallForm();
        this.loading = false;
          this.cdr.detectChanges();
      },
      error: () => { this.toast.error('Failed to load lead'); this.loading = false; }
    });
  }

  loadEngineers() {
    this.engineerService.getAllEngineers().subscribe({
      next: (res: any) => { this.engineers = res.engineers || []; },
      error: () => {}
    });
  }

  syncFinancialForm() {
    this.financialForm = {
      totalAmount: this.lead.totalAmount || 0,
      partsLpCost: this.lead.partsLpCost || 0,
      finalAmount: this.lead.finalAmount || 0,
      companyShare: this.lead.companyShare || 0,
      engineerShare: this.lead.engineerShare || 0,
      workRemark: this.lead.workRemark || ''
    };
  }

  syncHappyCallForm() {
    this.happyCallForm = {
      called: this.lead.happyCall?.called || false,
      satisfied: this.lead.happyCall?.satisfied ?? null,
      remarks: this.lead.happyCall?.remarks || '',
      followUpRequired: this.lead.happyCall?.followUpRequired || false
    };
  }

  // Auto calculate company share
  autoCalculate() {
    const total = this.financialForm.finalAmount || 0;
    const lp = this.financialForm.partsLpCost || 0;
    const engShare = this.financialForm.engineerShare || 0;
    this.financialForm.companyShare = Math.max(0, total - lp - engShare);
  }

  assignEngineer() {
    if (!this.selectedEngineerId) return this.toast.error('Please select an engineer');
    this.assigningEngineer = true;
    this.leadService.assignLead(this.lead._id, this.selectedEngineerId).subscribe({
      next: (res: any) => {
        this.lead = res.lead;
        this.toast.success('Engineer assigned successfully!');
        this.assigningEngineer = false;
      },
      error: (err) => { this.toast.error(err.error?.message || 'Failed'); this.assigningEngineer = false; }
    });
  }

  updateStatus() {
    this.updatingStatus = true;
    this.leadService.updateStatus(this.lead._id, this.selectedStatus, this.remarks).subscribe({
      next: () => {
        this.lead.status = this.selectedStatus;
        this.toast.success('Status updated!');
        this.updatingStatus = false;
        this.remarks = '';
      },
      error: () => { this.toast.error('Failed'); this.updatingStatus = false; }
    });
  }

  saveFinancials() {
    this.updatingFinancials = true;
    this.leadService.updateFinancials(this.lead._id, this.financialForm).subscribe({
      next: () => {
        Object.assign(this.lead, this.financialForm);
        this.toast.success('Financials saved!');
        this.updatingFinancials = false;
      },
      error: () => { this.toast.error('Failed'); this.updatingFinancials = false; }
    });
  }

  saveHappyCall() {
    this.updatingHappyCall = true;
    this.leadService.updateHappyCall(this.lead._id, this.happyCallForm).subscribe({
      next: (res: any) => {
        this.lead.happyCall = res.happyCall;
        this.toast.success('Happy call recorded!');
        this.updatingHappyCall = false;
      },
      error: () => { this.toast.error('Failed'); this.updatingHappyCall = false; }
    });
  }

  addNote() {
    if (!this.newNote.trim()) return;
    this.addingNote = true;
    this.leadService.addNote(this.lead._id, this.newNote).subscribe({
      next: (res: any) => {
        this.lead.notes = res.notes;
        this.newNote = '';
        this.toast.success('Note added!');
        this.addingNote = false;
      },
      error: () => { this.addingNote = false; }
    });
  }

  togglePin() {
    this.leadService.togglePin(this.lead._id).subscribe({
      next: (res: any) => {
        this.lead.isPinned = res.isPinned;
        this.toast.success(res.isPinned ? 'Lead pinned!' : 'Lead unpinned!');
      }
    });
  }

  createBill() {
    this.router.navigate(['/admin/bills/create'], {
      queryParams: { customerId: this.lead.customer?._id, leadId: this.lead._id }
    });
  }

  createJobCard() {
    this.router.navigate(['/admin/jobs/create', this.lead._id]);
  }

  openWhatsApp() {
    window.open('https://wa.me/91' + this.lead.customer?.phone, '_blank');
  }

  getStatusClass(status: string): string {
    const map: any = {
      'New': 'status-new', 'Scheduled': 'status-scheduled',
      'Assigned': 'status-assigned', 'In Progress': 'status-progress',
      'Pending': 'status-pending', 'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || '';
  }

  getPriorityClass(p: string): string {
    return p === 'High' ? 'priority-high' : p === 'Low' ? 'priority-low' : 'priority-medium';
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊', 'Washing Machine': '🌀',
      'Geyser': '🔥', 'TV': '📺', 'Microwave': '🍱',
      'Cooler': '💨', 'LED': '💡', 'Chimney': '🏭', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }

  getProfit(): number {
    return (this.lead.finalAmount || 0) - (this.lead.partsLpCost || 0) - (this.lead.engineerShare || 0);
  }

  getDaysAgo(): string {
    const diff = Math.floor((Date.now() - new Date(this.lead.createdAt).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  }

  getTimelineIcon(action: string): string {
    const map: any = {
      'created': 'add_circle', 'assigned': 'assignment_ind',
      'status_changed': 'swap_horiz', 'note_added': 'sticky_note_2',
      'updated': 'edit', 'happy_call': 'phone_in_talk'
    };
    return map[action] || 'circle';
  }


  getNoteUserName(note: any): string {
  return note?.addedBy?.name || 'Admin';
}

getNoteUserInitial(note: any): string {
  return note?.addedBy?.name?.charAt(0) || 'A';
}

getNoteText(note: any): string {
  return note?.text || '';
}

getNoteDate(note: any): any {
  return note?.addedAt || null;
}
}