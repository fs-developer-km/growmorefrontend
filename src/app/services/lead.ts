import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private api = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) { }

  getAllLeads(filters: any = {}) {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    return this.http.get(this.api, { params });
  }

  getLeadById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  createLead(data: any) {
    return this.http.post(this.api, data);
  }

  assignLead(id: string, engineerId: string) {
    return this.http.patch(`${this.api}/${id}/assign`, { engineerId });
  }

  updateStatus(id: string, status: string, remarks: string = '') {
    return this.http.patch(`${this.api}/${id}/status`, { status, remarks });
  }

  getMyLeads() {
    return this.http.get(`${this.api}/mine`);
  }
}