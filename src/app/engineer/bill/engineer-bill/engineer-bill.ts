import { Component } from '@angular/core';
// import { BillCreateComponent } from '../../admin/billing/bill-create/bill-create.component';
import { BillCreate } from '../../../admin/billing/bill-create/bill-create';

@Component({
  selector: 'app-engineer-bill',
  standalone: true,
  imports: [BillCreate],
  template: `<app-bill-create></app-bill-create>`
})
export class EngineerBill {}