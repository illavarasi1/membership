import { Component,inject, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { RenewService } from '../../../services/renew.service';
import { IRenew } from '../../../model/renew';
import { Members } from '../../../model/members';
import { CurrencyPipe,CommonModule } from '@angular/common';
import { MembertypeService } from '../../../services/membertype.service';
import { MemberType } from '../../../model/membertype';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  totalMembers: number = 0;
  totalMembershipTypes: number = 0;
  membershipTypes: { type: string; count: number }[] = [];
  expiringSoon: number = 0;
  totalRevenue: string = '$0';
  newMembers: number = 0;
  expiredMembers: number = 0;
  recentMembers: any[] = [];
  renewals: IRenew[] = [];
  totalRenewals: number = 0;
  activeMembers: Members[] = [];
  members: Members[] = []; 
  isCollapsed: boolean = false;
  isRemoved: boolean = false;
  currentYear!: number; 
  totalRecords: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  search: string = '';
  totalPages: number = 0;

  dashboardService=inject(DashboardService)
  renewService=inject(RenewService)
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
  router=inject(Router)
  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.getTotalRenewals();
    this.fetchDashboardData();
    this.memberService.getmembers(1,1000,'').subscribe(response => {
      if (Array.isArray(response.data)) {
        this.members = response.data;  // Get the actual array from the 'data' field
        console.log('Members:', this.members);
      } else {
        console.error('Expected an array, but got:', response);
      }    });
    this.dashboardService.getTotalMembers().subscribe(data => {
      this.totalMembers = data.totalMembers;
    });
    this.dashboardService.getTotalMembershipTypes().subscribe(data => {
      this.totalMembershipTypes = data.totalMembershipTypes;
    });
    this.dashboardService.getExpiringSoon().subscribe(data => {
      this.expiringSoon = data.expiringSoonCount;
    });
    this.dashboardService.getTotalRevenue().subscribe(data => {
      this.totalRevenue = data.currency + data.totalRevenue;
    });
    this.dashboardService.getNewMembers().subscribe(data => {
      this.newMembers = data.newMembersCount;
    });
    this.dashboardService.getExpiredMembers().subscribe(data => {
      this.expiredMembers = data.expiredMembersCount;
    });
    this.dashboardService.getRecentMembers().subscribe(data => {
      this.recentMembers = data;
      
    });
  }
  getTotalRenewals(): void {
    this.renewService.getrenew().subscribe(
      (renewals) => {
        this.renewals = renewals; // Store renewals in the renewals array
        this.totalRenewals = renewals.length; // Calculate the total number of renewals
      },
      (error) => {
        console.error('Error fetching renewals', error);
      }
    );
  }
  fetchDashboardData(): void {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    this.memberService.getmembers(1,1000,'').subscribe(response => {
      // Check if data is available and is an array
      if (Array.isArray(response.data)) {
        
        this.members = response.data;
          // Assign the array to the members variable
      } else {
        console.error('Received data is not an array:', response);
      }
      // Membership Types Count
      const typeCounts: { [key: string]: number } = {};
      console.log('this.members:', this.members);
if (Array.isArray(this.members)) {
      this.members.forEach((member) => {
        console.log('Membership Type:', member.membership_type?.type);
        const type = member.membership_type?.type;
        console.log("type:",type)
        if (type) {
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        }
      });
    } else {
      console.error('Expected array, but got:', this.members);
    }
      this.membershipTypes = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
      }));

    })
  this.activeMembers=this.members.filter((member)=>
    member.status==='active'&&
  member.expiry_date &&
new Date(member.expiry_date)>today)
console.log('Active Members:', this.activeMembers);
  
(error:any) => {
  console.error('Error fetching members:', error);
}
  }
  viewAllMembers(): void {
    this.router.navigate(['admin/members']); // Adjust the route to match your app
  }
  toggleCard() {
    this.isCollapsed = !this.isCollapsed;
  }

  removeCard() {
    this.isRemoved = true;
  }
}
