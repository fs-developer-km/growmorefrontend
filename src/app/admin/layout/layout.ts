import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
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
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  currentUser: any;
  currentPageTitle = 'Dashboard';

menuItems = [
  { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
  { icon: 'assignment', label: 'Leads', route: '/admin/leads' },
  { icon: 'engineering', label: 'Engineers', route: '/admin/engineers' },
  { icon: 'people', label: 'Customers', route: '/admin/customers' },
  { icon: 'inventory_2', label: 'Parts', route: '/admin/parts' },
  { icon: 'receipt_long', label: 'Bills', route: '/admin/bills' },
  { icon: 'bar_chart', label: 'Reports', route: '/admin/reports' },
];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    // Sirf page title yahan — sidenav touch mat karo ngOnInit mein
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      const item = this.menuItems.find(m => url.includes(m.route));
      this.currentPageTitle = item ? item.label : 'GrowMore';
    });
  }

  ngAfterViewInit() {
    // ViewChild sidenav ab ready hai — yahan breakpoint observer chalao
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenav.close();
        } else {
          this.sidenav.open(); // Desktop pe pehli baar bhi open hoga
        }
      });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  getUserInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() {
    this.authService.logout();
  }
}