import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PartService } from '../../../services/part';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './part-list.html',
  styleUrls: ['./part-list.scss']
})
export class PartList implements OnInit {
  parts: any[] = [];
  loading = true;
  showForm = false;
  formLoading = false;
  editingPart: any = null;

  partForm!: FormGroup;

  categories = ['AC', 'Refrigerator', 'Washing Machine', 'Geyser', 'General', 'Other'];
  units = ['piece', 'cylinder', 'meter', 'liter', 'set', 'pair'];

  constructor(
    private partService: PartService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadParts();
  }

  initForm() {
    this.partForm = this.fb.group({
      name: ['', Validators.required],
      category: ['General'],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      unit: ['piece'],
      lowStockAlert: [2]
    });
  }

  loadParts() {
    this.loading = true;
    this.partService.getAllParts().subscribe({
      next: (res: any) => {
        this.parts = res.parts || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Parts load nahi hue');
        this.loading = false;
      }
    });
  }

  openAddForm() {
    this.editingPart = null;
    this.partForm.reset({
      name: '', category: 'General',
      purchasePrice: 0, salePrice: 0,
      stock: 0, unit: 'piece', lowStockAlert: 2
    });
    this.showForm = true;
  }

  openEditForm(part: any) {
    this.editingPart = part;
    this.partForm.patchValue({
      name: part.name,
      category: part.category,
      purchasePrice: part.purchasePrice,
      salePrice: part.salePrice,
      stock: part.stock,
      unit: part.unit,
      lowStockAlert: part.lowStockAlert
    });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingPart = null;
  }

  onSubmit() {
    if (this.partForm.invalid) return;
    this.formLoading = true;

    const data = this.partForm.value;

    if (this.editingPart) {
      this.partService.updatePart(this.editingPart._id, data).subscribe({
        next: () => {
          this.toast.success('Part update ho gaya! ✅');
          this.loadParts();
          this.closeForm();
          this.formLoading = false;
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Update nahi hua');
          this.formLoading = false;
        }
      });
    } else {
      this.partService.addPart(data).subscribe({
        next: () => {
          this.toast.success('Part add ho gaya! ✅');
          this.loadParts();
          this.closeForm();
          this.formLoading = false;
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Part add nahi hua');
          this.formLoading = false;
        }
      });
    }
  }

  getProfit(part: any): number {
    return part.salePrice - part.purchasePrice;
  }

  isLowStock(part: any): boolean {
    return part.stock <= part.lowStockAlert;
  }

  getCategoryColor(category: string): string {
    const map: any = {
      'AC': '#6366F1',
      'Refrigerator': '#06B6D4',
      'Washing Machine': '#8B5CF6',
      'Geyser': '#EF4444',
      'General': '#10B981',
      'Other': '#F59E0B'
    };
    return map[category] || '#6366F1';
  }
}