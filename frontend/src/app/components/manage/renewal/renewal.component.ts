import { Component, OnInit,inject,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { MembertypeService } from '../../../services/membertype.service';
import { Members } from '../../../model/members';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table'; 
import {  EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterModule } from '@angular/router';


import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl } from '@angular/forms';
import { MemberType } from '../../../model/membertype';
import { IRenew } from '../../../model/renew';
import { RenewService } from '../../../services/renew.service';
@Component({
  selector: 'app-renewal',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule,
    FormsModule,
    MatExpansionModule,
    CommonModule,
    MatSortModule, 
    MatPaginator,
    MatSort,
    MatPaginatorModule,
FormsModule
  ],
  templateUrl: './renewal.component.html',
  styleUrl: './renewal.component.css'
})
export class RenewalComponent implements OnInit {
  router=inject(Router)
  // row: any = {};
membershipTypeNames: any[] = []; 
membershipTypes: MemberType[] = [];
member: Members | null = null;
selectedMembershipType: string = ''; 
renewalDuration: number = 1;
totalAmount: number = 0;   
renewal: IRenew | undefined;
fullname: string | undefined;  // New property for fullname
membershipNumber: string | undefined; 
  renewService=inject(RenewService)
  route = inject(ActivatedRoute);
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
  selectedRenewalDuration: number = 1; 
  selectedMembershipDetails?: MemberType;
  selectedFile: File | null = null; 
  totalRecords: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  search: string = '';
  totalPages: number = 0;
  renewDuration!: number;
  expiryDate!: string;
  currentYear!: number;
  // memberForm: FormGroup;
  createdAt: Date | undefined; // Store the created_at date
  newExpiryDate: Date | undefined;
  renewalDurations = [1, 3, 6, 12]; // Durations in months
  // renewalDuration: number = 1; // Default value
  // member: any = { created_at: '2023-11-01T00:00:00Z' }; // Example member data
  // newExpiryDate: Date | null = null; // Calculated expiry date
 
  ngOnInit(){
    this.currentYear = new Date().getFullYear();
    this.getMembershipTypes(); 
    // this.fetchMembershipTypes();
    const memberId = this.route.snapshot.paramMap.get('id');

    if (memberId) {
      // Fetch member data using the ID
      this.memberService.getmembersbyid(memberId).subscribe({
        next: (data) => {
          console.log('Data fetched:', data),
          this.member = {
            ...data,
            expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
          };
  
          if (this.member?.expiry_date && isNaN(new Date(this.member.expiry_date).getTime())) {
            console.error('Invalid expiry date from server:', this.member.expiry_date);
            alert('Received invalid expiry date from server.');
            return;
          }
  
          this.calculateExpiryDate();
        },
        error: (err) => {
          console.error('Error fetching member data:', err);
        },
      });
    }
  }
 
  getMembershipTypes(): void {
    // this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((types: MemberType[]) => {
    //   this.membershipTypes = types;
    //   console.log('Fetched membership types:', this.membershipTypes);
    // });
    const page = 1; // Default page
    const limit = 10; // Default limit
    const search = ''; // Default empty search string

    this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe({
      next: (response) => {
        this.membershipTypes = response.data || []; // Assuming API returns { data: MemberType[] }
      },
      error: (err) => console.error('Error fetching membership types:', err),
    });
  
  }
  onMembershipTypeChange(): void {
    const selectedType = this.membershipTypes.find(type => String(type._id) === String(this.selectedMembershipType));
    if (selectedType) {
      this.totalAmount = selectedType.amount * this.renewalDuration; // Set the total amount from the selected type
    }
  }
  // onMembershipTypeChange(): void {
  //   console.log('Selected Membership Type ID:', this.selectedMembershipType);
  //   const selectedType = this.membershipTypes.find(
  //     type => String(type._id) === String(this.selectedMembershipType)
  //   );
  
  //   if (selectedType) {
  //     console.log('Selected Membership Type Details:', selectedType);
  //     this.totalAmount = selectedType.amount * this.renewalDuration;
  //     console.log('Total Amount Calculated:', this.totalAmount);
  //   } else {
  //     console.warn('Invalid Membership Type selected.');
  //     this.totalAmount = 0; // Reset total amount if invalid type
  //   }
  // }
  
  // calculateExpiryDate(): void {
  //   if (this.member && this.member.expiry_date) {
  //     const expiryDate = new Date(this.member.expiry_date);
  //     expiryDate.setMonth(expiryDate.getMonth() + this.renewDuration);
  //     this.newExpiryDate = expiryDate;
  //   }
  // }
  calculateExpiryDate(): void {
    if (this.member && this.member.expiry_date) {
      const currentExpiry = new Date(this.member.expiry_date);
      if (isNaN(currentExpiry.getTime())) {
        console.error('Invalid expiry date in member data:', this.member.expiry_date);
        alert('Member expiry date is invalid.');
        return;
      }
      currentExpiry.setMonth(currentExpiry.getMonth() + this.renewalDuration);
      this.newExpiryDate = currentExpiry; // Set a valid Date object
    } else {
      alert('Member data or expiry date is missing.');
    }
  }
  
  // Calculate total amount based on membership type and renewal duration
  calculateTotalAmount(): void {
    this.onMembershipTypeChange();
  }
  // calculateTotalAmount(): void {
  //   if (!this.selectedMembershipType || !this.renewalDuration) {
  //     console.warn('Membership type or renewal duration not selected.');
  //     return;
  //   }
  //   this.onMembershipTypeChange();
  // }
 
  submitRenewal(): void {
    console.log('Renewal submitted');
    if (this.member && this.selectedMembershipType && this.newExpiryDate) {
      const validExpiryDate =
      this.newExpiryDate instanceof Date && !isNaN(this.newExpiryDate.getTime())
        ? this.newExpiryDate
        : new Date(this.newExpiryDate);

    if (isNaN(validExpiryDate.getTime())) {
      console.error('Invalid expiry date:', this.newExpiryDate);
      alert('Invalid expiry date.');
      return;
    }
      console.log('Selected Membership Type:', this.selectedMembershipType);
      const selectedType = this.membershipTypes.find(type => String(type._id) === String(this.selectedMembershipType));
  
      if (selectedType) {
        const updatedMemberData = {
          ...this.member,
          membership_type: this.selectedMembershipType, // New membership type
          expiry_date: validExpiryDate,
        };
  
  
        console.log('Updating member with data:', updatedMemberData);
        console.log('expiry date',this.newExpiryDate);
        console.log('Updating member:', this.member._id!);
       // Ensure a file is selected before passing it
      const fileToSend = this.selectedFile || new File([], "");
        this.memberService.updatemembers(this.member._id!, updatedMemberData,fileToSend).subscribe({
          next: (response) => {
            
            console.log('Membership updated successfully:', response);
  
            // Use saveRenewalRecord
            this.saveRenewalRecord(this.member?._id!, this.totalAmount);
          },
          error: (error) => {
            console.error('Error updating membership:', error.message, error.error);
            alert('Error occurred while renewing membership.');
          }
      });
      } else {
        alert('Invalid membership type selected.');
      }
    } else {
      alert('Please complete all required fields.');
    }
  }
  saveRenewalRecord(member_id: string,total_amount: number): void {
    console.log('Attempting to save renewal record with:', member_id, total_amount);
    this.renewService.addrenew(member_id, total_amount).subscribe({
      next: (response) => {
        console.log('Renewal record saved successfully:', response);
        alert('Renewal record saved successfully!');
      },
      error: (error) => {
        console.error('Error saving renewal record:', error);
        alert('An error occurred while saving the renewal record.');
      },
    });
  }
  
  
  }
 
