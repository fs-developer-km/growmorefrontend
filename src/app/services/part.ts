import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PartService {
  private api = `${environment.apiUrl}/parts`;

  constructor(private http: HttpClient) {}

  getAllParts() {
    return this.http.get(this.api);
  }

  addPart(data: any) {
    return this.http.post(this.api, data);
  }

  updatePart(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}