import { Component, OnInit,inject,ViewChild } from '@angular/core';
import { MembertypeService } from '../../../services/membertype.service';
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
import { ActivatedRoute } from '@angular/router';
import { Members } from '../../../model/members';
import { MemberService } from '../../../services/member.service';
import { MembertypeComponent } from '../membertype/membertype.component';
import { MemberType } from '../../../model/membertype';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-members',
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
     MembertypeComponent,
  MatExpansionModule,
     FormsModule,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent  implements OnInit  {
  id!: string;
  title: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  limit: number = 10;
search: string = ''; 
  // totalPages: number = 0;
  startRecord = 1;
  endRecord = 0;
  currentYear!: number;
  totalPages: number[] = [1, 2, 3, 4, 5];  
  displayedColumns: string[] = ['membershipNumber','fullname', 'contact','email','address','type','status','action'];
  dataSource: MatTableDataSource<Members>;
  membershipTypeNames: any[] = [];

  
  // newMembershipType = { type: '', amount: null };
  // membershipType: string = '';
  // membershipAmount: number = 0;
  successMessage: string | null = null;
  // @Output() typeSelected = new EventEmitter<string>();
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
  // selectType(type: string) {
  //   this.typeSelected.emit(type);
  // }
  constructor() {


    this.dataSource = new MatTableDataSource([]as any);
  }
  route = inject(ActivatedRoute); 
  ngOnInit(){
    this.currentYear = new Date().getFullYear();
    this.getMembershipTypes(); 
    this.getServerData()
    this.route.data.subscribe(data => {
      this.title = data['title'];
    });
   
  }
  // private getMembershipTypes() {
  //   this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((types: MemberType[]) => {
  //     console.log('Fetched membership types:', types);
  
  //     // Only store the type and ignore the amount
  //     this.membershipTypeNames = types.map(type => ({
  //       _id: type._id,
  //       type: type.type // Only include the type field
  //     }));
  //     this.membershipTypeNames.forEach(type => {
  //       console.log('ID:', type._id);  // Log the _id to check if it's present
  //       console.log('Type:', type.type); // Check if `_id` is present
  //     });
  //     console.log('Filtered membership types:', this.membershipTypeNames);
  //   });
  //   this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe(response => {
  //     console.log('API Response:', response);  // Log the API response to check its structure
  //     this.membershipTypeNames = response; // Assign the data to your class property
  //   });
  // }
  private getMembershipTypes() {
    // Fetch membership types from the API
    this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);  // Log the API response to check its structure
        
        // Assuming response.data contains the array of types
        if (response && Array.isArray(response.data)) {
          // Map the data to extract only _id and type
          this.membershipTypeNames = response.data.map((type: any) => ({
            _id: type._id,
            type: type.type // Only include the type field
          }));
          this.totalRecords = response.totalRecords;
          console.log( this.totalRecords)
          this.totalPages = Array.from({ length: Math.ceil(this.totalRecords / this.limit) }, (_, i) => i + 1);
          this.updateRecordRange()
          // Log the filtered data
          this.membershipTypeNames.forEach(type => {
            console.log('ID:', type._id);  // Log the _id to check if it's present
            console.log('Type:', type.type); // Log the type to verify
          });
          console.log('Filtered membership types:', this.membershipTypeNames);
        }
      },
      error: (err) => {
        console.error('Error fetching membership types:', err);
      }
    });
  }
  
  public  getServerData(){
    console.log('Fetching data with parameters:', {
      page: this.currentPage,
      limit: this.limit,
      search: this.search
    });
    this.memberService.getmembers(this.currentPage, this.limit, this.search).subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
      console.log("member data",response.data)
      console.log("Available membership types:", this.membershipTypeNames);
      const currentDate = new Date();

      // Map the result to add a 'status' field for each member
      this.dataSource.data =  response.data.map((member: Members) => {
        // Check if expiry_date exists and is valid, else assign a default date or status
        const expiryDate = member.expiry_date ? new Date(member.expiry_date) : null;
        // const membershipType = member.membership_type;
       // Only include the 'type' field of the membership_type
       const membershipType = this.membershipTypeNames.find(
        (type) => type._id === member.membership_type
      );

          console.log('Member ID:', member._id);
          console.log('Found membership type:', membershipType); 
        this.totalRecords = response.totalRecords;
          console.log( this.totalRecords)
          this.totalPages = Array.from({ length: Math.ceil(this.totalRecords / this.limit) }, (_, i) => i + 1);
          this.updateRecordRange();
        return {
          ...member,
          status: expiryDate && expiryDate > currentDate ? 'Active' : 'Expired',
      membership_type: membershipType ? membershipType.type : 'N/A'
        
        };
        
      });
      // this .dataSource.data=result
      
      console.log("Updated member data with membership types:", this.dataSource.data);
    } 
  else {
    console.error("Invalid response format: 'data' is not an array or 'response' is null/undefined.");
    }
  
    error: (error: any) => {
    console.error('Error fetching members:', error); // Log errors if any
  }
}
    })
  
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
  //   onSearchChange(event: any) {
  //   this.search = event.target.value; // Capture the search query
  //   console.log('Search query:', this.search);
  //   this.getServerData(); // Fetch data based on search query
  // }
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
  getRemainingDays(expiryDate: string): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffInTime = expiry.getTime() - today.getTime();
    return Math.floor(diffInTime / (1000 * 3600 * 24));
  }
  // add(newMember: any): void {
  //   this.memberService.addmembers(newMember).subscribe((addedMember) => {
  //     console.log("New member added with membership number:", addedMember.membership_number);
  //     this.loadMembers();
  //   });
  // }
  isMembershipExpired(expiryDate: string | Date): boolean {
    if (!expiryDate) {
      return true; // Treat as expired if no expiry date is provided
    }
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today; // Check if the expiry date is in the past
  }
  isMembershipRenewed(member: any): boolean {
    // Check if the renewal date exists and if it is in the past
    return member.renewal_date ? new Date(member.renewal_date) > new Date() : false;
}
}

