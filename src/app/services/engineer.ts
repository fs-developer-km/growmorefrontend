import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EngineerService {
  private api = `${environment.apiUrl}/engineers`;

  constructor(private http: HttpClient) {}

  getAllEngineers() {
    return this.http.get(this.api);
  }

  getEngineerById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  addEngineer(data: any) {
    return this.http.post(this.api, data);
  }

  updateEngineer(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deactivateEngineer(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}