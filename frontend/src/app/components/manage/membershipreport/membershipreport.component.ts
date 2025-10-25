import { Component, inject,OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Members } from '../../../model/members';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembertypeService } from '../../../services/membertype.service';
import { MemberType } from '../../../model/membertype';
@Component({
  selector: 'app-membershipreport',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './membershipreport.component.html',
  styleUrl: './membershipreport.component.css'
})

export class MembershipreportComponent implements OnInit {
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
  members: Members[] = [];
  memberTypes: MemberType[] = [];
  reportData: Members[] = [];
  createdAt: string | null = null;
expiryDate: string | null = null;
totalRecords: number = 0;
currentPage: number = 1;
limit: number = 10;
search: string = '';
totalPages: number = 0;
  ngOnInit(): void {
    // Fetch members on component load
    this.memberService.getmembers(1, 1000, '').subscribe((result: any) => {
      this.members = result?.data || [];
    });
    
    this.membertypeService.getmembertype(1, 1000, '').subscribe({
      next: (response) => {
        this.memberTypes = response.data || [];
     
      this.loadMemberTypes();
      }
    });
   
  }
  // getMemberTypeName(membershipType: string | number): string {
  //   const memberType = this.memberTypes.find(type => type._id === Number(membershipType)); // Ensuring proper type comparison
  //   return memberType ? memberType.type : 'Unknown';
  // }
    // Function to get the type of a member by matching the membership_type ID with memberTypes
  // Function to get the type of a member by matching the membership_type ID with memberTypes


  getMemberTypeName(membershipType: string | number | { type: string; amount: number }): string {
    // Check if membershipType is a string or number
    if (typeof membershipType === 'string' || typeof membershipType === 'number') {
      const memberType = this.memberTypes.find(type => type._id === String(membershipType));
      return memberType ? memberType.type : 'Unknown';
    }
    
    // If membershipType is an object with type and amount, return the type directly
    if (membershipType && typeof membershipType === 'object' && 'type' in membershipType) {
      return membershipType.type;
    }
    
    return 'Unknown'; // Fallback if type is not string, number, or object with type
  }
  loadMemberTypes(): void {
    this.members.forEach(member => {
      const memberType = this.memberTypes.find(type => String(type._id) === String(member.membership_type));
      if (memberType) {
        member.membership_type = memberType;  // Assign the whole MemberType object
      } else {
        member.membership_type = { type: 'Unknown', amount: 0 };  // Provide a default object with type and amount
      }
    });
  }
  
  
  generateReport(): void {
    if (!this.createdAt || !this.expiryDate) {
      alert('Please select both Created At and Expiry Date.');
      return;
    }
    if (!Array.isArray(this.members)) {
      console.error('Error: members is not an array');
      alert('Unable to generate report. Members data is invalid.');
      return;
    }
    const createdAtDate = new Date(this.createdAt);
    const expiryDateDate = new Date(this.expiryDate);

    // Filter members based on the createdAt and expiryDate range
    this.reportData = this.members.filter(member => {
      const memberCreatedAt = new Date(member.created_at || '');
      const memberExpiryDate = new Date(member.expiry_date || '');

      return (
        memberCreatedAt >= createdAtDate &&
        memberExpiryDate <= expiryDateDate
      );
    });
  }
    printReport(): void {
    const tableContent = document.querySelector('table')?.outerHTML;

    if (!tableContent) {
      alert('No report data available to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Revenue Report</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <h2>Membership Report</h2>
            ${tableContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
