import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private api = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getAllLeads(filters: any = {}) {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(this.api, { params });
  }

  searchLeads(q: string) {
    return this.http.get(`${this.api}/search`, {
      params: new HttpParams().set('q', q)
    });
  }

  getStats() { return this.http.get(`${this.api}/stats`); }
  getLeadById(id: string) { return this.http.get(`${this.api}/${id}`); }
  getMyLeads() { return this.http.get(`${this.api}/mine`); }
  createLead(data: any) { return this.http.post(this.api, data); }
  updateLead(id: string, data: any) { return this.http.put(`${this.api}/${id}`, data); }

  assignLead(id: string, engineerId: string) {
    return this.http.patch(`${this.api}/${id}/assign`, { engineerId });
  }

  updateStatus(id: string, status: string, remarks: string = '') {
    return this.http.patch(`${this.api}/${id}/status`, { status, remarks });
  }

  updateHappyCall(id: string, data: any) {
    return this.http.patch(`${this.api}/${id}/happy-call`, data);
  }

  updateFinancials(id: string, data: any) {
    return this.http.patch(`${this.api}/${id}/financials`, data);
  }

  bulkAssign(leadIds: string[], engineerId: string) {
    return this.http.post(`${this.api}/bulk-assign`, { leadIds, engineerId });
  }

  bulkStatus(leadIds: string[], status: string) {
    return this.http.post(`${this.api}/bulk-status`, { leadIds, status });
  }

  addNote(id: string, text: string) {
    return this.http.post(`${this.api}/${id}/notes`, { text });
  }

  togglePin(id: string) {
    return this.http.patch(`${this.api}/${id}/pin`, {});
  }

  exportExcel(filters: any = {}) {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get(`${this.api}/export/excel`, { params, responseType: 'blob' });
  }
}