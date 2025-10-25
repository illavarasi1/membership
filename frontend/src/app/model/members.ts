import { MemberType } from "./membertype";

export interface Members{
  _id?: string;
    fullname:string;
    dob:Date;
    gender: string;
    contact_number: string;
    email: string;
    address: string;
    country: string;
    postcode: string;
    occupation: string;
    membership_type:MemberType; 
    membership_number: string;
    created_at?: Date; // Optional property, if not required initially
    photo: string | null;
    expiry_date?: Date; 
    settings?: { system_name: string };  
    status?: string;
      }