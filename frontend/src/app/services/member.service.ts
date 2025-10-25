import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Members } from '../model/members';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  http=inject(HttpClient)
  constructor() { }
  getRecentMembers(): Observable<Members[]> {
    return this.http.get<Members[]>('http://localhost:8000/members'); // Adjust the URL if needed
}
  getmembers( page: number,
    limit: number,
    search: string): Observable<any> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('search', search);
    return this.http.get<Members[]>('http://localhost:8000/members', { params });
  }
  getmembersbyid(id:string) {
    return this.http.get<Members>('http://localhost:8000/members/'+id);
  }
  addmembers(memberData: Partial<Members>, photoFile?: File): Observable<Members> {
    const formData = new FormData();
  // Validate the member_id if it's included in the memberData
  if (memberData._id && (typeof memberData._id !== 'string' || memberData._id.length !== 24)) {
    throw new Error('Invalid member ID');
  }
    // Append each field to FormData
    for (const key in memberData) {
      if (memberData[key as keyof Members] !== undefined) {
        formData.append(key, memberData[key as keyof Members] as string);
      }
    }
    if (typeof memberData.membership_type === 'string') {
      formData.append('membership_type', memberData.membership_type); // Assuming the backend handles this
    } else if (memberData.membership_type && memberData.membership_type._id) {
      // If 'membership_type' is an object with _id, append the ID
      formData.append('membership_type', memberData.membership_type._id);
    } else if (memberData.membership_type) {
      // If 'membership_type' is an object, send the whole object
      formData.append('membership_type', JSON.stringify(memberData.membership_type));
    }
  
    // Append the photo if it's provided
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    return this.http.post<Members>('http://localhost:8000/members',formData)
    }
    updatemembers(id: string, memberData: any, photoFile?: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('fullname', memberData.fullname);
      formData.append('dob', memberData.dob);
      formData.append('gender', memberData.gender);
      formData.append('contact_number', memberData.contact_number);
      formData.append('email', memberData.email);
      formData.append('address', memberData.address);
      formData.append('country', memberData.country);
      formData.append('postcode', memberData.postcode);
      formData.append('occupation', memberData.occupation);
      formData.append('membership_type', memberData.membership_type);
      formData.append('created_at', memberData.created_at);
      // formData.append('photo', photo, photo.name);
    // Add expiry_date if provided
    if (memberData.expiry_date) {
      formData.append('expiry_date', memberData.expiry_date.toISOString()); // Convert the date to ISO string format
    }
    if (photoFile) {
          formData.append('photo', photoFile);
        }
      const headers = new HttpHeaders();
  
      return this.http.put<Members>(`http://localhost:8000/members/`+id,formData);
    }
  
  // updatemembers(id: string, memberData: Partial<Members>, photoFile?: File): Observable<Members> {
  //   const formData = new FormData();

  //   for (const key in memberData) {
  //     if (memberData[key as keyof Members] !== undefined) {
  //       formData.append(key, memberData[key as keyof Members] as string);
  //     }
  //   }
  //     //  // Handle the 'membership_type' field (ensure it's a string or send the whole object as a string)
  //     //  if (typeof memberData.membership_type === 'string') {
  //     //   formData.append('membership_type', (memberData.membership_type as { _id: string })._id);
  //     // } else if (memberData.membership_type) {
  //     //   formData.append('membership_type', JSON.stringify(memberData.membership_type));
  //     // }

  //   if (photoFile) {
  //     formData.append('photo', photoFile);
  //   }
  //   return this.http.put<Members>(`http://localhost:8000/members/`+id,formData);

  // }
  deletemembersbyid(id: string): Observable<void> {
    return this.http.delete<void>('http://localhost:8000/members/'+id);
  }
}
