import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Settings } from '../model/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  http=inject(HttpClient)
  authService=inject(AuthService)
  private apiUrl = 'http://localhost:8000/settings';  // Backend URL for settings
  private authToken = localStorage.getItem('authToken'); // Retrieve the auth token from local storage

  // Set up headers for authentication token
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authToken}`,
    'Content-Type': 'application/json'
  });


  constructor() {}

  // Method to get settings
  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  getSettingsById(id: number): Observable<any> {
    return this.http.get<Settings>(`${this.apiUrl}/${id}`);  // Send GET request with ID
  }
  updateSettings(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/settings`, formData);
  }
 // Update settings
//  updateSettings(system_name: string, currency: number, selectedFile?: File) {
//   const formData = new FormData();
//   formData.append('system_name', system_name);
//   formData.append('currency', currency.toString());
//   // if (selectedFile) {
//   //   formData.append('logo', selectedFile);
//   // }
//   if (selectedFile) {
//     formData.append('logo', selectedFile, selectedFile.name);
//   }

//   return this.http.put(`${this.apiUrl}/settings`, formData);
// }


 // Update settings with PUT method (including optional file upload)
 update(userId: string,settingsData: any, photoFile?: File): Observable<any> {
  const formData = new FormData();

  // Append the settings fields to FormData
  for (const key in settingsData) {
    if (settingsData[key] !== undefined) {
      formData.append(key, settingsData[key]);
    }
  }

  // Append the photo if it's provided
  if (photoFile) {
    formData.append('profilePicture', photoFile);
  }

  // Use HttpClient to make a POST or PUT request to the backend
  return this.http.post<any>(`${this.apiUrl}/settings/${userId}`, formData);
}
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }
}
