import { Component } from '@angular/core';
// import { JobCardCreateComponent } from '../../admin/job-cards/job-card-create/job-card-create.component';
import { JobCardCreate } from '../../../admin/job-cards/job-card-create/job-card-create';

@Component({
  selector: 'app-engineer-job-card',
  standalone: true,
  imports: [JobCardCreate],
  template: `<app-job-card-create></app-job-card-create>`
})
export class EngineerJobCard {}