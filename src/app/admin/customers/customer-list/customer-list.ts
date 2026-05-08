import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CustomerService } from '../../../services/customer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss']
})
export class CustomerList implements OnInit {
  customers: any[] = [];
  loading = true;
  searchQuery = '';
  totalCustomers = 0;
  private searchSubject = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadCustomers();

    // Search debounce — 400ms baad search karo
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.loadCustomers(query);
    });
  }

  loadCustomers(search: string = '') {
    this.loading = true;
    this.customerService.getAllCustomers(search).subscribe({
      next: (res: any) => {
        this.customers = res.customers || [];
        this.totalCustomers = res.total || 0;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Customers load nahi hue');
        this.loading = false;
      }
    });
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadCustomers();
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CU';
  }

  getAvatarColor(name: string): string {
    const colors = [
      'linear-gradient(135deg, #1565C0, #42A5F5)',
      'linear-gradient(135deg, #2E7D32, #66BB6A)',
      'linear-gradient(135deg, #6A1B9A, #AB47BC)',
      'linear-gradient(135deg, #E65100, #FFA726)',
      'linear-gradient(135deg, #00695C, #26A69A)',
      'linear-gradient(135deg, #B71C1C, #EF5350)',
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  }
}