import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobCardService {
  private api = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  createJobCard(data: any) {
    return this.http.post(this.api, data);
  }

  getJobCard(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  updateJobCard(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  completeJob(id: string) {
    return this.http.patch(`${this.api}/${id}/complete`, {});
  }
}