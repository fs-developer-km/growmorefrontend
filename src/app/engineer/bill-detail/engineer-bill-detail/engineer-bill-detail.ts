import { Component } from '@angular/core';
// import { BillDetais } from '../../../admin/billing/bill-detail/bill-detail';
import { BillDetail } from '../../../admin/billing/bill-detail/bill-detail';

@Component({
  selector: 'app-engineer-bill-detail',
  standalone: true,
  imports: [BillDetail],
  template: `<app-bill-detail></app-bill-detail>`
})
export class EngineerBillDetail {}