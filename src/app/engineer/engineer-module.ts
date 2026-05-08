import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineerRoutingModule } from './engineer-routing-module';
import { EngineerLayout } from './layout/engineer-layout/engineer-layout';

@NgModule({
  imports: [
    CommonModule,
    EngineerRoutingModule,
    EngineerLayout
  ]
})
export class EngineerModule {}