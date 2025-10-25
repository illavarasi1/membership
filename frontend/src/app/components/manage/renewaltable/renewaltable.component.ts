import { Component, OnInit,inject,ViewChild } from '@angular/core';
import { MembertypeService } from '../../../services/membertype.service';
import { MatTableDataSource } from '@angular/material/table'; 

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterModule } from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Members } from '../../../model/members';
import { MemberService } from '../../../services/member.service';
import { MemberType } from '../../../model/membertype';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-renewaltable',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
   MatInputModule,
   RouterLink,
   RouterModule,
    MatSortModule, 
    MatPaginator,
    MatSort,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
   FormsModule,
  ],
  templateUrl: './renewaltable.component.html',
  styleUrl: './renewaltable.component.css'
})
export class RenewaltableComponent implements OnInit {
  title: string = '';

  displayedColumns: string[] = ['membershipNumber','fullname', 'contact','email','address','type','expiry','status','action'];
  dataSource: MatTableDataSource<Members>;
  membershipTypeNames: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  search: string = '';
  // totalPages: number = 0;
  startRecord = 1;
  endRecord = 0;
  currentYear!: number;
  totalPages: number[] = [1, 2, 3, 4, 5];  
  // members: MemberType[] = []; 
  // newMembershipType = { type: '', amount: null };
  // membershipType: string = '';
  // membershipAmount: number = 0;
  successMessage: string | null = null;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
  route = inject(ActivatedRoute); 
  router=inject(Router)
  constructor() {


    this.dataSource = new MatTableDataSource([]as any);
  }
 
  ngOnInit(){
    this.currentYear = new Date().getFullYear();
    this.getMembershipTypes(); 
    this.getServerData()
    this.route.data.subscribe(data => {
      this.title = data['title'];
    });
   
  }
  private getMembershipTypes() {
    this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((response: any) => {
      if (Array.isArray(response.data)) {
      this.membershipTypeNames=response.data.map((type: MemberType) => ({
        _id: type._id, // Cast id to number if needed
        type: type.type// Handle missing type names
      }));
      this.totalRecords = response.totalRecords;
      console.log( this.totalRecords)
      this.totalPages = Array.from({ length: Math.ceil(this.totalRecords / this.limit) }, (_, i) => i + 1);
      this.updateRecordRange()
      this.membershipTypeNames.forEach(type => {
        console.log('ID:', type._id);  // Log the _id to check if it's present
        console.log('Type:', type.type); // Check if `_id` is present
    });
    console.log('Filtered membership types:', this.membershipTypeNames);
  } else {
    console.error('Expected an array but received:', response.data); // Log an error if types is not an array
    this.membershipTypeNames = [];
  }
}, (error) => {
  console.error('Error fetching membership types:', error); // Log any errors
});
  
  // this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe(response => {
  //   console.log('API Response:', response);  // Log the API response to check its structure
  //   this.membershipTypeNames = response; // Assign the data to your class property
  // });
}
  // getMembershipType(typeId: number): string {
  //   const type = this.membershipTypes.find(t => t._id === +typeId);
  //   return type ? type.type : 'Unknown';
  // }
  public getServerData(){
    this.memberService.getmembers(this.currentPage, this.limit, this.search).subscribe((response: any) => {
      if (Array.isArray(response.data)) {
      console.log(response.data)
      const currentDate = new Date();

      // Map the result to add a 'status' field for each member
      this.dataSource.data = response.data.map((member: Members) => {
        // Check if expiry_date exists and is valid, else assign a default date or status
        const expiryDate = member.expiry_date ? new Date(member.expiry_date) : null;
        // const membershipType = member.membership_type; 
        // const membership = membershipType ? { type: membershipType.type, amount: membershipType.amount } : { type: 'Unknown', amount: 0 };
        const membershipType = Array.isArray(this.membershipTypeNames) ? 
        this.membershipTypeNames.find((type) => type._id === member.membership_type) : null;

        console.log('Member ID:', member._id);
        console.log('Found membership type:', membershipType); 
        this.totalRecords = response.totalRecords;
        console.log( this.totalRecords)
        this.totalPages = Array.from({ length: Math.ceil(this.totalRecords / this.limit) }, (_, i) => i + 1);
        this.updateRecordRange();
        // let membershipTypeDisplay: string;
        // console.log('Membership Type:', member.membership_type);
        // if (typeof member.membership_type === 'string') {
        //   membershipTypeDisplay = member.membership_type; // If it's already a string, use it
        // } else if (typeof member.membership_type === 'number') {
        //   membershipTypeDisplay = member.membership_type.toString(); // If it's a number, convert it to string
        // } else if (typeof member.membership_type === 'object' && member.membership_type !== null) {
        //   membershipTypeDisplay = member.membership_type.type; // If it's an object, use the 'type' property
        // } else {
        //   membershipTypeDisplay = 'Unknown'; // Fallback in case of an unknown value
        // }
      
        return {
          ...member,
          status: expiryDate && expiryDate > currentDate ? 'Active' : 'Expired',
          membership_type: membershipType ? membershipType.type : 'N/A',
          remaining_days: expiryDate ? this.getRemainingDays(expiryDate.toISOString()) : 0 
          // membership_type: typeof member.membership_type === 'number' ? 
          // member.membership_type : 
          // member.membership_type || { type: 'Unknown', amount: 0 }
        };
      });
    } else {
      console.error('Expected an array but received:', response.data); // Log an error if result is not an array
    }
  }, (error) => {
    console.error('Error fetching data:', error); // Log any errors
  });
    
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  updateRecordRange(): void {
    this.startRecord = (this.currentPage - 1) * this.limit + 1;
    this.endRecord = Math.min(this.startRecord + this.limit - 1, this.totalRecords);
  }
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updateRecordRange();
      this.getServerData(); // Reload data for the selected page
    }
  }
  onSearchChange(event: Event) {
    this.search = (event.target as HTMLInputElement).value.trim();
    this.currentPage = 1; // Reset to the first page on search
    console.log('Search term:', this.search);
    this.getServerData();
  }
  delete(id:string){
    console.log(id)
    this.memberService.deletemembersbyid(id).subscribe((result:any)=>{
      if (confirm("Are you sure you want to delete this members?")) {
        this.getServerData()
        }
      })
  }
  loadMembers() {
    this.getServerData(); // Call the existing getMembers method
  }
  add(newMember: any): void {
    this.memberService.addmembers(newMember).subscribe((addedMember) => {
      console.log("New member added with membership number:", addedMember.membership_number);
      this.loadMembers();
    });
  }
//   getRemainingDays(expiryDate: string | undefined): number {
  
//     if (!expiryDate) return 0; // Handle undefined case
//   const today = new Date();
//   const expiry = new Date(expiryDate);
//   const difference = expiry.getTime() - today.getTime();
//   return Math.ceil(difference / (1000 * 60 * 60 * 24));
// }
getRemainingDays(expiryDate: string | Date | undefined): number {
  if (!expiryDate) return 0; // Handle undefined case
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const difference = expiry.getTime() - today.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
  
}

  renewMembership(member: any): void {
    // Logic for renewing the membership
    this.router.navigate(['/admin/renewal', member._id]);
    // console.log(`Renewing membership for ${member.fullname}`);
  }
  isMembershipExpired(expiryDate: string | Date | undefined): boolean {
    if (!expiryDate) {
      return true; // Treat as expired if no expiry date is provided
    }
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today; // Check if the expiry date is in the past
  }
  
}
