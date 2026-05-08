import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-engineer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './engineer-layout.html',
  styleUrls: ['./engineer-layout.scss']
})
export class EngineerLayout implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  currentUser: any;
  currentPageTitle = 'Dashboard';

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/engineer/dashboard' },
    { icon: 'assignment', label: 'My Leads', route: '/engineer/leads' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.sidenav) {
          result.matches ? this.sidenav.close() : this.sidenav.open();
        }
      });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      if (url.includes('dashboard')) this.currentPageTitle = 'Dashboard';
      else if (url.includes('leads')) this.currentPageTitle = 'My Leads';
      else if (url.includes('jobs')) this.currentPageTitle = 'Job Card';
      else if (url.includes('bills')) this.currentPageTitle = 'Bill';
      else this.currentPageTitle = 'GrowMore';
    });
  }

  toggleSidenav() { this.sidenav.toggle(); }

  closeMobile() {
    if (this.isMobile) this.sidenav.close();
  }

  getUserInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() { this.authService.logout(); }
}