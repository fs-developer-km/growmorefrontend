import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage() {
    const user = localStorage.getItem('growmore_user');
    return user ? JSON.parse(user) : null;
  }

  login(phone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { phone, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('growmore_token', res.token);
        localStorage.setItem('growmore_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('growmore_token');
    localStorage.removeItem('growmore_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('growmore_token');
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isEngineer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'engineer';
  }
}