import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private api = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAllCustomers(search: string = '', page: number = 1) {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    params = params.set('page', page.toString());
    params = params.set('limit', '20');
    return this.http.get(this.api, { params });
  }

  getCustomerById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  addCustomer(data: any) {
    return this.http.post(this.api, data);
  }

  updateCustomer(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}