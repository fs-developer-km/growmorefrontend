import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillService {
  private api = `${environment.apiUrl}/bills`;

  constructor(private http: HttpClient) {}

  createBill(data: any) {
    return this.http.post(this.api, data);
  }

  getAllBills(filters: any = {}) {
    let params = new HttpParams();
    if (filters.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    return this.http.get(this.api, { params });
  }

  getBillById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  downloadPdf(id: string) {
    return this.http.get(`${this.api}/${id}/pdf`, { responseType: 'blob' });
  }

  getWhatsappLink(id: string) {
    return this.http.get(`${this.api}/${id}/whatsapp`);
  }

  updatePayment(id: string, data: any) {
    return this.http.patch(`${this.api}/${id}/payment`, data);
  }
}