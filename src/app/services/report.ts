import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getOverview(period: string) {
    return this.http.get(`${this.api}/overview`, {
      params: new HttpParams().set('period', period)
    });
  }

  getRevenueChart(period: string) {
    return this.http.get(`${this.api}/revenue-chart`, {
      params: new HttpParams().set('period', period)
    });
  }

  getEngineerPerformance(period: string) {
    return this.http.get(`${this.api}/engineer-performance`, {
      params: new HttpParams().set('period', period)
    });
  }

  getServiceBreakdown(period: string) {
    return this.http.get(`${this.api}/service-breakdown`, {
      params: new HttpParams().set('period', period)
    });
  }

  exportReport(type: string, period: string) {
    return this.http.get(`${this.api}/export`, {
      params: new HttpParams().set('type', type).set('period', period),
      responseType: 'blob'
    });
  }
}