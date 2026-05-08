import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { Layout } from './layout/layout';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    Layout
  ]
})
export class AdminModule {}