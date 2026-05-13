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

interface SubItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  children?: SubItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatSidenavModule,
    MatToolbarModule, MatListModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDividerModule, MatBadgeModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  currentUser: any;
  currentPageTitle = 'Dashboard';
  openMenus: Set<string> = new Set();

menuItems: MenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
  {
    icon: 'assignment',
    label: 'Leads',
    children: [
      { label: 'Lead Board', route: '/admin/leads', icon: 'view_list' },
      { label: 'New Lead', route: '/admin/leads/add', icon: 'add_circle_outline' },
      { label: 'Lead Management', route: '/admin/leadsmgmt', icon: 'add_circle_outline' },
    ]
  },
  {
    icon: 'engineering',
    label: 'Engineers',
    children: [
      { label: 'Engineer List', route: '/admin/engineers', icon: 'group' },
      { label: 'Add Engineer', route: '/admin/engineers/add', icon: 'person_add_alt' },
    ]
  },
  {
    icon: 'people',
    label: 'Customers',
    children: [
      { label: 'All Customers', route: '/admin/customers', icon: 'people_outline' },
    ]
  },
  {
    icon: 'inventory_2',
    label: 'Inventory',
    children: [
      { label: 'Parts List', route: '/admin/parts', icon: 'widgets' },
    ]
  },
  {
    icon: 'receipt_long',
    label: 'Billing',
    children: [
      { label: 'All Bills', route: '/admin/bills', icon: 'receipt' },
      { label: 'Create Bill', route: '/admin/bills/create', icon: 'add_circle_outline' },
    ]
  },
  {
    icon: 'verified_user',
    label: 'AMC',
    children: [
      { label: 'AMC Dashboard', route: '/admin/amc', icon: 'dashboard' },
      { label: 'All Contracts', route: '/admin/amc/list', icon: 'list_alt' },
      { label: 'New Contract', route: '/admin/amc/create', icon: 'add_circle_outline' },
      { label: 'Expiring Soon', route: '/admin/amc/expiring', icon: 'alarm', badge: '!' },
    ]
  },
  {
    icon: 'bar_chart',
    label: 'Reports',
    children: [
      { label: 'Analytics', route: '/admin/reports', icon: 'analytics' },
    ]
  },
];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncActiveMenu();
    });
    this.syncActiveMenu();
  }

  ngAfterViewInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenav.close();
        } else {
          this.sidenav.open();
        }
      });
  }

  syncActiveMenu() {
    const url = this.router.url;

    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActive = item.children.some(c => url.startsWith(c.route));
        if (hasActive) this.openMenus.add(item.label);
      }
    });

    const active = this.menuItems.find(item => {
      if (item.route) return url === item.route;
      if (item.children) return item.children.some(c => url.startsWith(c.route));
      return false;
    });
    this.currentPageTitle = active?.label || 'GrowMore';
  }

  toggleMenu(label: string) {
    if (this.openMenus.has(label)) {
      this.openMenus.delete(label);
    } else {
      this.openMenus.add(label);
    }
  }

  isMenuOpen(label: string): boolean {
    return this.openMenus.has(label);
  }

  isActiveParent(item: MenuItem): boolean {
    const url = this.router.url;
    if (item.route) return url === item.route;
    if (item.children) return item.children.some(c => url.startsWith(c.route));
    return false;
  }

  isActiveChild(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigate(route: string) {
    this.router.navigate([route]);
    if (this.isMobile) this.sidenav.close();
  }

  toggleSidenav() { this.sidenav.toggle(); }

  getUserInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() { this.authService.logout(); }
}