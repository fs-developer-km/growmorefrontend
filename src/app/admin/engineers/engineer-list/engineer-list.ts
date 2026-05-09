import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EngineerService } from '../../../services/engineer';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-engineer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './engineer-list.html',
  styleUrls: ['./engineer-list.scss']
})
export class EngineerList implements OnInit {
  engineers: any[] = [];
  loading = true;

  constructor(
    private engineerService: EngineerService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEngineers();
  }

  loadEngineers() {
    this.loading = true;
    this.engineerService.getAllEngineers().subscribe({
      next: (res: any) => {
        this.engineers = res.engineers || [];
        this.loading = false;
         this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Engineers load nahi hue');
        this.loading = false;
      }
    });
  }

  deactivate(id: string, name: string) {
    if (!confirm(`${name} ko deactivate karna chahte ho?`)) return;
    this.engineerService.deactivateEngineer(id).subscribe({
      next: () => {
        this.toast.success(`${name} deactivate ho gaya`);
        this.loadEngineers();
      },
      error: () => this.toast.error('Deactivate nahi hua')
    });
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EN';
  }
}