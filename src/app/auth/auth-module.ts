import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    Login  // declare not, import yet
  ]
})
export class AuthModule {}