import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private API_URL = 'http://localhost:8000/auth'; // Backend URL

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8000/auth';  // The URL of your backend API

  // Method to handle login
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        // Assuming the response includes both token and userId
        if (response.token) {
          this.storeToken(response.token);   // Store JWT token
        }
        if (response.userId) {
          this.storeUserId(response.userId); // Store userId
        }
      }))
    
  }
  // Store the token in localStorage after successful login
  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
// Method to store userId in localStorage
storeUserId(userId: string): void {
  localStorage.setItem('user_id', userId);
}

// Method to retrieve the stored userId
getUserId(): string | null {
  return localStorage.getItem('user_id');
}
  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  // isAuthenticated(): boolean {
  //   // Replace with your actual authentication check, e.g., check for a valid token in localStorage
  //   const token = localStorage.getItem('auth_token');
  //   return !!token; 
  // }
  isAuthenticated(): boolean {
    return !!this.getToken(); // Returns true if token exists
  }

    // Method to add the token to headers for authenticated requests
    getAuthHeaders(): HttpHeaders {
      const token = this.getToken();
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    logout(): void {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
    }
    getProtectedData(): Observable<any> {
      const headers = this.getAuthHeaders();
      return this.http.get<any>('http://localhost:8000/protected-data', { headers });
    }
    changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
      const body = { currentPassword, newPassword, confirmPassword };
      return this.http.post<any>(`http://localhost:8000/settings/change-password`, body, { headers });
    }
 
  // Example API call to load settings with token authentication
  getSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`http://localhost:8000/settings`, { headers });
  }

  // Example of a POST request to update settings
  updateSettings(data: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`http://localhost:8000/settings/settings`, data, { headers });
  }
}
