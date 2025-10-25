import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IRenew} from '../model/renew';
import { MemberService } from './member.service'; 
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RenewService {
  http=inject(HttpClient)
  memberService=inject(MemberService)
  constructor() { }
  getrenew() {
    return this.http.get<IRenew[]>('http://localhost:8000/renew');
  }
  getrenewbyid(id: string): Observable<IRenew> {
    // Fetch renewal by ID
    return this.http.get<IRenew>('http://localhost:8000/renew/' + id).pipe(
      // After fetching renewal data, check if member_id exists
      switchMap((renewalData: IRenew) => {
        // Check if the renewal has a populated member with a membership_type
        if (renewalData?.member_id?. membership_type?.type) {
          return of(renewalData); // Return as is
        }
        // Additional logic if needed
        return of(renewalData);
      }),
      catchError((error) => {
        console.error('Error fetching renewal by ID:', error);
        return of({} as IRenew);
      })
    );
  }
  
  addrenew(member_id: string,total_amount: number): Observable<any> {
    return this.http.post('http://localhost:8000/renew',{
      member_id: member_id,
      total_amount: total_amount,
    });

  }
  updaterenew(id: string, total_amount: number) {
    return this.http.put('http://localhost:8000/renew/'+id,{
      total_amount: total_amount,
    });

  }
}
