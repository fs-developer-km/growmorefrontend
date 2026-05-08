import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineerLayout } from './layout/engineer-layout/engineer-layout';

const routes: Routes = [
  {
    path: '',
    component: EngineerLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/engineer-dashboard/engineer-dashboard')
          .then(m => m.EngineerDashboard)
      },
      {
        path: 'leads',
        loadComponent: () => import('./leads/engineer-leads/engineer-leads')
          .then(m => m.EngineerLeads)
      },
      {
        path: 'leads/:id',
        loadComponent: () => import('./lead-detail/engineer-lead-detail/engineer-lead-detail')
          .then(m => m.EngineerLeadDetail)
      },
      {
        path: 'jobs/create/:leadId',
        loadComponent: () => import('./job-card/engineer-job-card/engineer-job-card')
          .then(m => m.EngineerJobCard)
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./job-detail/engineer-job-detail/engineer-job-detail')
          .then(m => m.EngineerJobDetail)
      },
      {
        path: 'bills/create',
        loadComponent: () => import('./bill/engineer-bill/engineer-bill')
          .then(m => m.EngineerBill)
      },
      {
        path: 'bills/:id',
        loadComponent: () => import('./bill-detail/engineer-bill-detail/engineer-bill-detail')
          .then(m => m.EngineerBillDetail)
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
export class EngineerRoutingModule {}