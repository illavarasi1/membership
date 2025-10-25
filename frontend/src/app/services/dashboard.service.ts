import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
http=inject(HttpClient)
  constructor() { }
  getTotalMembers(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/total-members`);
  }

  getTotalMembershipTypes(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/total-membership-types`);
  }

  getExpiringSoon(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/expiring-soon`);
  }

  getTotalRevenue(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/total-revenue`);
  }

  getNewMembers(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/new-members`);
  }

  getExpiredMembers(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/expired-members`);
  }

  getRecentMembers(): Observable<any> {
    return this.http.get(`http://localhost:8000/dashboard/recent-members`);
  }
}
