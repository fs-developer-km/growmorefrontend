import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EngineerService } from '../../../services/engineer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-engineer-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './engineer-add.html',
  styleUrls: ['./engineer-add.scss']
})
export class EngineerAdd implements OnInit {
  engineerForm!: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private engineerService: EngineerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.engineerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: [''],
      address: ['']
    });
  }

  onSubmit() {
    if (this.engineerForm.invalid) return;
    this.loading = true;
    this.engineerService.addEngineer(this.engineerForm.value).subscribe({
      next: () => {
        this.toast.success('Engineer add ho gaya! ✅');
        this.router.navigate(['/admin/engineers']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Engineer add nahi hua');
        this.loading = false;
      }
    });
  }
}