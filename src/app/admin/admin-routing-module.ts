import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'leads',
        loadComponent: () => import('./leads/lead-list/lead-list').then(m => m.LeadList)
      },
      {
        path: 'leadsmgmt',
        loadComponent: () => import('./leads/lead-management/lead-management')
          .then(m => m.LeadManagement)
      },
      {
        path: 'leads/add',
        loadComponent: () => import('./leads/lead-add/lead-add').then(m => m.LeadAdd)
      },
      {
        path: 'leads/:id',
        loadComponent: () => import('./leads/lead-detail/lead-detail').then(m => m.LeadDetail)
      },
      {
        path: 'engineers',
        loadComponent: () => import('./engineers/engineer-list/engineer-list').then(m => m.EngineerList)
      },
      {
        path: 'engineers/add',
        loadComponent: () => import('./engineers/engineer-add/engineer-add').then(m => m.EngineerAdd)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customer-list/customer-list').then(m => m.CustomerList)
      },
      {
        path: 'bills',
        loadComponent: () => import('./billing/bill-list/bill-list').then(m => m.BillList)
      },
      {
        path: 'bills/create',
        loadComponent: () => import('./billing/bill-create/bill-create').then(m => m.BillCreate)
      },

      {
        path: 'customers/:id',
        loadComponent: () => import('./customers/customer-detail/customer-detail')
          .then(m => m.CustomerDetail)
      },

      {
        path: 'jobs/create/:leadId',
        loadComponent: () => import('./job-cards/job-card-create/job-card-create')
          .then(m => m.JobCardCreate)
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./job-cards/job-card-detail/job-card-detail')
          .then(m => m.JobCardDetail)
      },
      {
        path: 'parts',
        loadComponent: () => import('./parts/part-list/part-list')
          .then(m => m.PartList)
      },
      {
        path: 'bills/:id',
        loadComponent: () => import('./billing/bill-detail/bill-detail')
          .then(m => m.BillDetail)
      },

      {
        path: 'reports',
        loadComponent: () => import('./reports/reports/reports')
          .then(m => m.Reports)
      },


      // amc routing module 


      {
        path: 'amc',
        loadComponent: () => import('./amc/amc-dashboard/amc-dashboard')
          .then(m => m.AmcDashboard)
      },
      {
        path: 'amc/list',
        loadComponent: () => import('./amc/amc-list/amc-list')
          .then(m => m.AmcList)
      },
      {
        path: 'amc/create',
        loadComponent: () => import('./amc/amc-create/amc-create')
          .then(m => m.AmcCreate)
      },
      {
        path: 'amc/expiring',
        loadComponent: () => import('./amc/amc-expiring/amc-expiring')
          .then(m => m.AmcExpiring)
      },
      {
        path: 'amc/:id',
        loadComponent: () => import('./amc/amc-detail/amc-detail')
          .then(m => m.AmcDetail)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }