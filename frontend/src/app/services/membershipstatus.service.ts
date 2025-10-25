import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembershipstatusService {
  private membershipStatus: string = '';

  setMembershipStatus(status: string) {
    this.membershipStatus = status;
  }

  getMembershipStatus(): string {
    return this.membershipStatus;
  }
  constructor() { }
}
