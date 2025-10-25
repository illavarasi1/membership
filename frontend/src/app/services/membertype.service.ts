import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberType } from '../model/membertype';
@Injectable({
  providedIn: 'root'
})
export class MembertypeService {
http=inject(HttpClient)
  constructor() { }
  getmembertype(  page: number,
    limit: number,
    search: string
  ): Observable<any> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('search', search);
    return this.http.get<MemberType[]>('http://localhost:8000/membertype', { params });
  }
  getmembertypebyid(id:string) {
    return this.http.get<MemberType>('http://localhost:8000/membertype/'+id);
  }
  addmembertype(type: string, amount: number) {
    return this.http.post('http://localhost:8000/membertype',{
      type:type,
      amount:amount
    });

  }
  updatemembertype(id:string,type: string, amount: number) {
    return this.http.put('http://localhost:8000/membertype/'+id,{
      type:type,
      amount:amount
    });

  }
  deletemembertypebyid(id:string){
    return this.http.delete('http://localhost:8000/membertype/'+id);
  }
}
