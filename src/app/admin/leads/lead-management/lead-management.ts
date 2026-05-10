import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { LeadService } from '../../../services/lead';
import { EngineerService } from '../../../services/engineer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-lead-management',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatMenuModule,
    MatTooltipModule, MatChipsModule, MatDividerModule,
  ],
  templateUrl: './lead-management.html',
  styleUrls: ['./lead-management.scss']
})
export class LeadManagement implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data
  leads: any[] = [];
  filteredLeads: any[] = [];
  engineers: any[] = [];
  stats: any = null;

  // State
  loading = true;
  statsLoading = true;
  searching = false;
  exporting = false;

  // View
  viewMode: 'table' | 'kanban' = 'table';

  // Search
  searchQuery = '';
  searchResults: any[] = [];
  detectedCustomer: any = null;
  showSearchDropdown = false;

  // Filters
  filters = {
    status: '',
    assignedTo: '',
    applianceType: '',
    serviceType: '',
    priority: '',
    source: '',
    startDate: '',
    endDate: '',
    search: ''
  };

  appliedFilterCount = 0;
  showFilters = false;

  // Selection
  selectedLeads: Set<string> = new Set();
  selectAll = false;
  showBulkBar = false;

  // Detail Panel
  selectedLead: any = null;
  showDetailPanel = false;
  panelLoading = false;
  newNote = '';
  addingNote = false;

  // Bulk Actions
  bulkAssignEngineerId = '';
  bulkStatusValue = '';

  // Pagination
  totalLeads = 0;
  currentPage = 1;
  pageSize = 50;

  // Sort
  sortBy = 'createdAt';
  sortOrder = 'desc';

  // Options
  statusOptions = ['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
  applianceOptions = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser', 'Microwave', 'TV', 'Cooler', 'Other'];
  serviceOptions = ['Repair', 'Installation', 'Uninstallation', 'Shifting', 'AMC', 'Inspection', 'Other'];
  priorityOptions = ['High', 'Medium', 'Low'];
  sourceOptions = ['Phone Call', 'Website', 'WhatsApp', 'Referral', 'Walk-in', 'Other'];

  kanbanColumns = [
    { key: 'New', label: 'New', color: '#6366F1', icon: '🆕' },
    { key: 'Assigned', label: 'Assigned', color: '#F59E0B', icon: '👷' },
    { key: 'In Progress', label: 'In Progress', color: '#8B5CF6', icon: '🔄' },
    { key: 'Completed', label: 'Completed', color: '#10B981', icon: '✅' },
    { key: 'Cancelled', label: 'Cancelled', color: '#EF4444', icon: '❌' }
  ];

  constructor(
    private leadService: LeadService,
    private engineerService: EngineerService,
    private toast: ToastService,
          private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadLeads();
    this.loadEngineers();

    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(q => {
      if (q.length >= 2) this.smartSearch(q);
      else {
        this.searchResults = [];
        this.detectedCustomer = null;
        this.showSearchDropdown = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats() {
    this.statsLoading = true;
    this.leadService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res.stats;
        this.statsLoading = false;
           this.cdr.detectChanges();
      },
      error: () => { this.statsLoading = false; }
    });
  }

  loadLeads() {
    this.loading = true;
    const params = {
      ...this.filters,
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.leadService.getAllLeads(params).subscribe({
      next: (res: any) => {
        this.leads = res.leads || [];
        this.filteredLeads = this.leads;
        this.totalLeads = res.total || 0;
        this.loading = false;
           this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Leads load nahi hui');
        this.loading = false;
      }
    });
  }

  loadEngineers() {
    this.engineerService.getAllEngineers().subscribe({
      next: (res: any) => { this.engineers = res.engineers || []; },
      error: () => {}
    });
  }

  // SMART SEARCH
  onSearchInput(q: string) {
    this.searchSubject.next(q);
  }

  smartSearch(q: string) {
    this.searching = true;
    this.leadService.searchLeads(q).subscribe({
      next: (res: any) => {
        this.searchResults = res.leads || [];
        this.detectedCustomer = res.customer;
        this.showSearchDropdown = true;
        this.searching = false;
      },
      error: () => { this.searching = false; }
    });
  }

  selectSearchResult(lead: any) {
    this.showSearchDropdown = false;
    this.openDetailPanel(lead._id);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.detectedCustomer = null;
    this.showSearchDropdown = false;
    this.filters.search = '';
    this.loadLeads();
  }

  applySearch() {
    this.filters.search = this.searchQuery;
    this.showSearchDropdown = false;
    this.currentPage = 1;
    this.loadLeads();
  }

  // FILTERS
  applyFilters() {
    this.currentPage = 1;
    this.countFilters();
    this.loadLeads();
  }

  countFilters() {
    this.appliedFilterCount = Object.values(this.filters)
      .filter(v => v !== '').length;
  }

  clearFilters() {
    this.filters = {
      status: '', assignedTo: '', applianceType: '',
      serviceType: '', priority: '', source: '',
      startDate: '', endDate: '', search: ''
    };
    this.searchQuery = '';
    this.appliedFilterCount = 0;
    this.currentPage = 1;
    this.loadLeads();
  }

  quickFilter(status: string) {
    this.filters.status = this.filters.status === status ? '' : status;
    this.applyFilters();
  }

  // SORT
  sortTable(col: string) {
    if (this.sortBy === col) {
      this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortBy = col;
      this.sortOrder = 'desc';
    }
    this.loadLeads();
  }

  // SELECTION
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.leads.forEach(l => this.selectedLeads.add(l._id));
    } else {
      this.selectedLeads.clear();
    }
    this.showBulkBar = this.selectedLeads.size > 0;
  }

  toggleSelect(leadId: string) {
    if (this.selectedLeads.has(leadId)) {
      this.selectedLeads.delete(leadId);
    } else {
      this.selectedLeads.add(leadId);
    }
    this.showBulkBar = this.selectedLeads.size > 0;
    this.selectAll = this.selectedLeads.size === this.leads.length;
  }

  isSelected(leadId: string): boolean {
    return this.selectedLeads.has(leadId);
  }

  clearSelection() {
    this.selectedLeads.clear();
    this.selectAll = false;
    this.showBulkBar = false;
  }

  // BULK ACTIONS
  doBulkAssign() {
    if (!this.bulkAssignEngineerId) {
      this.toast.error('Engineer select karo');
      return;
    }
    this.leadService.bulkAssign(
      Array.from(this.selectedLeads),
      this.bulkAssignEngineerId
    ).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.clearSelection();
        this.loadLeads();
        this.loadStats();
      },
      error: () => this.toast.error('Bulk assign nahi hua')
    });
  }

  doBulkStatus() {
    if (!this.bulkStatusValue) {
      this.toast.error('Status select karo');
      return;
    }
    this.leadService.bulkStatus(
      Array.from(this.selectedLeads),
      this.bulkStatusValue
    ).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.clearSelection();
        this.loadLeads();
        this.loadStats();
      },
      error: () => this.toast.error('Bulk status update nahi hua')
    });
  }

  // DETAIL PANEL
  openDetailPanel(leadId: string) {
    this.panelLoading = true;
    this.showDetailPanel = true;

    this.leadService.getLeadById(leadId).subscribe({
      next: (res: any) => {
        this.selectedLead = res.lead;
        this.panelLoading = false;
           this.cdr.detectChanges();
      },
      error: () => { this.panelLoading = false; }
    });
  }

  closeDetailPanel() {
    this.showDetailPanel = false;
    this.selectedLead = null;
  }

  // PIN
  togglePin(lead: any, event: Event) {
    event.stopPropagation();
    this.leadService.togglePin(lead._id).subscribe({
      next: (res: any) => {
        lead.isPinned = res.isPinned;
        this.toast.success(res.message);
      },
      error: () => this.toast.error('Pin nahi hua')
    });
  }

  // NOTES
  addNote() {
    if (!this.newNote.trim() || !this.selectedLead) return;
    this.addingNote = true;

    this.leadService.addNote(this.selectedLead._id, this.newNote).subscribe({
      next: (res: any) => {
        this.selectedLead.notes = res.notes;
        this.newNote = '';
        this.addingNote = false;
        this.toast.success('Note add ho gaya!');
      },
      error: () => {
        this.addingNote = false;
        this.toast.error('Note add nahi hua');
      }
    });
  }

  // ASSIGN FROM PANEL
  assignFromPanel(engineerId: string) {
    if (!engineerId || !this.selectedLead) return;
    this.leadService.assignLead(this.selectedLead._id, engineerId).subscribe({
      next: (res: any) => {
        this.selectedLead = res.lead;
        this.toast.success('Engineer assign ho gaya!');
        this.loadLeads();
        this.loadStats();
      },
      error: () => this.toast.error('Assign nahi hua')
    });
  }

  // STATUS FROM PANEL
  updateStatusFromPanel(status: string) {
    if (!this.selectedLead) return;
    this.leadService.updateStatus(this.selectedLead._id, status).subscribe({
      next: () => {
        this.selectedLead.status = status;
        this.toast.success('Status update ho gaya!');
        this.loadLeads();
        this.loadStats();
      },
      error: () => this.toast.error('Status update nahi hua')
    });
  }

  // EXPORT
  exportToExcel(type: 'all' | 'filtered' | 'selected') {
    this.exporting = true;
    let params: any = {};

    if (type === 'filtered') params = { ...this.filters };
    else if (type === 'selected') params = { ids: Array.from(this.selectedLeads).join(',') };

    this.leadService.exportExcel(params).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${type}-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Excel download ho gaya!');
        this.exporting = false;
      },
      error: () => {
        this.toast.error('Export nahi hua');
        this.exporting = false;
      }
    });
  }

  // KANBAN
  getKanbanLeads(status: string) {
    return this.leads.filter(l => l.status === status);
  }

  // HELPERS
  getStatusClass(status: string): string {
    const map: any = {
      'New': 'new', 'Assigned': 'assigned',
      'In Progress': 'in-progress',
      'Completed': 'completed', 'Cancelled': 'cancelled'
    };
    return map[status] || '';
  }

  getPriorityClass(priority: string): string {
    const map: any = { 'High': 'high', 'Medium': 'medium', 'Low': 'low' };
    return map[priority] || '';
  }

  getApplianceEmoji(type: string): string {
    const map: any = {
      'AC': '❄️', 'Refrigerator': '🧊', 'Washing Machine': '🌀',
      'Geyser': '🔥', 'TV': '📺', 'Microwave': '🍱',
      'Cooler': '💨', 'Other': '🔧'
    };
    return map[type] || '🔧';
  }

  getEngineerName(id: string): string {
    const eng = this.engineers.find(e => e._id === id);
    return eng?.name || 'Select';
  }

  getTotalPages(): number {
    return Math.ceil(this.totalLeads / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadLeads();
  }

  getPages(): number[] {
    const total = this.getTotalPages();
    const pages = [];
    for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i);
    return pages;
  }
}