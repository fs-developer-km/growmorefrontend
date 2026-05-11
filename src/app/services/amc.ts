import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AmcService {
  private api = `${environment.apiUrl}/amc`;

  constructor(private http: HttpClient) {}

  getStats() { return this.http.get(`${this.api}/stats`); }

  getExpiringContracts() { return this.http.get(`${this.api}/expiring`); }

  getAllContracts(filters: any = {}) {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      if (filters[k]) params = params.set(k, filters[k]);
    });
    return this.http.get(`${this.api}/contracts`, { params });
  }

  getContractById(id: string) {
    return this.http.get(`${this.api}/contracts/${id}`);
  }

  createContract(data: any) {
    return this.http.post(`${this.api}/contracts`, data);
  }

  updateContract(id: string, data: any) {
    return this.http.put(`${this.api}/contracts/${id}`, data);
  }

  renewContract(id: string, data: any) {
    return this.http.patch(`${this.api}/contracts/${id}/renew`, data);
  }

  cancelContract(id: string) {
    return this.http.patch(`${this.api}/contracts/${id}/cancel`, {});
  }

  addVisit(id: string, data: any) {
    return this.http.post(`${this.api}/contracts/${id}/visits`, data);
  }

  addPayment(id: string, data: any) {
    return this.http.post(`${this.api}/contracts/${id}/payment`, data);
  }

  downloadPdf(id: string) {
    return this.http.get(`${this.api}/contracts/${id}/pdf`, { responseType: 'blob' });
  }

  getWhatsappLink(id: string) {
    return this.http.get(`${this.api}/contracts/${id}/whatsapp`);
  }

  exportExcel(status: string = '') {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get(`${this.api}/export`, { params, responseType: 'blob' });
  }
}