import { Component } from '@angular/core';
// import { JobCardDetailComponent } from '../../admin/job-cards/job-card-detail/job-card-detail.component';
import { JobCardDetail } from '../../../admin/job-cards/job-card-detail/job-card-detail';

@Component({
  selector: 'app-engineer-job-detail',
  standalone: true,
  imports: [JobCardDetail],
  template: `<app-job-card-detail></app-job-card-detail>`
})
export class EngineerJobDetail {}