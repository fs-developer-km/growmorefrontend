import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  showPassword = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectUser();
    }

    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { phone, password } = this.loginForm.value;

    this.authService.login(phone, password).subscribe({
      next: () => {
        this.loading = false;
        this.redirectUser();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Login fail ho gaya, dobara try karo';
      }
    });
  }

  redirectUser() {
  if (this.authService.isAdmin()) {
    this.router.navigate(['/admin/dashboard']);
  } else {
    this.router.navigate(['/engineer/dashboard']);
  }
}

  // redirectUser() {
  //   if (this.authService.isAdmin()) {
  //     this.router.navigate(['/admin/dashboard']);
  //   } else {
  //     this.router.navigate(['/engineer/dashboard']);
  //   }
  // }
}