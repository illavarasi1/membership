import { Members } from './members';  
import { MemberType } from './membertype';  
export interface IRenew {
    _id: number; // ID of the renewal
    member_id: Members;
    membership_type: { type: string; amount: number }; 
    total_amount: number; // Total renewal amount
    renew_date?: Date; // Renewal date (optional because it defaults to Date.now)
  }
  