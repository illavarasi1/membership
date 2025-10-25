import { Component , ViewChild,inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { CommonModule } from '@angular/common';
import { Members } from '../../../model/members';
import { Router } from '@angular/router';
import { MembershipstatusService } from '../../../services/membershipstatus.service';
import { RouterLink,RouterModule } from '@angular/router'; 
import { Settings } from '../../../model/settings';
import { SettingsService } from '../../../services/settings.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-membershipcard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
   
  ],
  templateUrl: './membershipcard.component.html',
  styleUrl: './membershipcard.component.css'
})
export class MembershipcardComponent  implements OnInit  {
  @ViewChild('printableCard') 
  member: any;
  membershipStatus: string = '';
  systemName: string | null = null;  // To hold the system name
  logoUrl: string | null = null; 
   photoUrl: string | null = null; 
  showCard: boolean = false; 
  settings: any;
id?: string = '';
userId!: string;
logo: string = ''; 
memberDetails: any = {};
  membershipType: string = '';
  route=inject(ActivatedRoute)
  memberService=inject(MemberService)
  router=inject(Router)
  membershipStatusService=inject(MembershipstatusService)
  settingsService=inject(SettingsService)
  authService=inject(AuthService)
  cdr=inject(ChangeDetectorRef)
  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // Get ID from route
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId')!;  // Retrieve userId from URL (adjust according to your routing structure)
    });
    this.loadMembershipDetails(id);
    this.getMemberDetails();
    this.fetchSystemSettings(1); 
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.membershipStatus = this.membershipStatusService.getMembershipStatus();
    }
 
    this.memberService.getmembersbyid(id).subscribe({
      next: (response) => {
      this.member = response;
      console.log('Membership Type:', this.member.membership_type.type);
      this.membershipStatus = response?.expiry_date ? (new Date(response.expiry_date) < new Date() ? 'Expired' : 'Active') : 'Unknown';
      // if (response && response.settings) {
      //   this.systemName = response.settings.system_name;
      // } else {
      //   this.systemName = 'Unknown';
      // }
      this.photoUrl = response?.photo 
      ? `http://localhost:8000/${response.photo}` 
      : '';
      // setTimeout(() => this.printMembershipCard(), 500);
      // this.cdr.detectChanges();
      }
    });
  
    // setTimeout(() => this.printMembershipCard(), 500);
  }
  getMemberDetails() {
    if (this.id) { // Use `this.id` instead of just `id`
      this.memberService.getmembersbyid(this.id).subscribe(data => {
        this.memberDetails = data;
      });
    }
    setTimeout(() => this.printMembershipCard(), 500);
  }
  
 // Fetch system settings (like system name and logo)
 fetchSystemSettings(id: number): void {
  this.settingsService.getSettingsById(id).subscribe({
    next: (response) => {
      console.log('Settings response:', response);
      if (response) {
        this.systemName = response.system_name;
       
        // this.logoUrl = response.logo;
        this.logoUrl = response.logo
        ? `http://localhost:8000/${response.logo}`
        : null;
    }
    },
    error: (error) => {
      console.error('Error fetching settings:', error);
    }
  });
   
}
  showMembershipCard(): void {
    this.showCard = true;
  }

loadMembershipDetails(id: string): void {
    this.memberService.getmembersbyid(id).subscribe((response: Members) => {
      this.memberDetails = response;
      this.membershipStatus = response.expiry_date
        ? new Date(response.expiry_date) < new Date()
          ? 'Expired'
          : 'Active'
        : 'Unknown';

      this.photoUrl = response?.photo
        ? `http://localhost:8000/${response.photo}`
        : null;

      // Trigger print after loading details
      // setTimeout(() => this.printMembershipCard(), 500);
    });
  }
  printMembershipCard(): void {
    // Get the membership card element's HTML content
    const printContents = document.getElementById('membershipCard')?.innerHTML;
    if (!printContents) return;
  
    // Open a new print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Write the membership card HTML into the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Membership Card</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                // align-items: center;
                background: #f3f3f3;
                height: 100vh;
              }
              .card {
                width: 500px;
                height: 280px;
                border-radius: 10px;
                background: #ffffff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border: 1px solid #ddd;
                position: relative;
              }
              .title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
              }
              .title img {
                width: 50px;
                height: auto;
              }
              .title span {
                font-weight: bold;
                font-size: 14px;
                text-transform: uppercase;
              }
              .details {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-top: 20px;
              }
              .info {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }
              .info .emboss {
                font-size: 14px;
                font-weight: bold;
              }
              .photo-container {
                width: 120px;
                height: 120px;
                border: 1px solid #ddd;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #f4f4f4;
              }
              .photo-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .footer {
                border-top: 1px solid #ddd;
                padding-top: 10px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body onload="window.print();">
            <div class="card">
              ${printContents}
            </div>
          </body>
        </html>
      `);
  
      // Close the document writing to ensure it renders properly
      printWindow.document.close();
  
      // Optional: Listen for when the print dialog is closed
      printWindow.onafterprint = () => {
        printWindow.close(); // Close the print window after printing
      };
    }
  }
  
  

  // Print the membership card
  // printMembershipCard(): void {
  //   const printContents = document.getElementById('membershipCard')?.innerHTML;
  //   const originalContents = document.body.innerHTML;
  
  //   if (printContents) {
  //     document.body.innerHTML = printContents; // Temporarily replace body content with the card content
  //     window.print();
  //     document.body.innerHTML = originalContents; // Restore original content after printing
  //     window.location.reload();  // Reload to reset the component state
  //   }
  // }
 
  // if (selectedPhotoFile) {
  //   this.selectedPhotoUrl = URL.createObjectURL(this.selectedPhotoFile);
  // }
  // printMembershipCard(): void {
  //   const printContents = this.printableCard.nativeElement.innerHTML;
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Membership Card</title>
  //           <style>
  //             body {
  //               font-family: helvetica;
  //               padding: 20px;
  //               background: #f4f4f4;
  //             }
  //             .card {
  //               /* Same styles as in your original code */
  //               background: rgb(192, 178, 195);
  //               border-radius: 10px;
  //               margin: auto;
  //               width: 500px;
  //               height: 280px;
  //               box-shadow: 2px 5px 15px 5px #00000030;
  //               display: flex;
  //               flex-flow: column;
  //             }
  //             img {
  //               width: 5rem;
  //               height: 4rem;
  //             }
  //             .emboss {
  //               font-size: 18px;
  //               font-family: courier;
  //               text-transform: uppercase;
  //               letter-spacing: 3px;
  //             }
  //           </style>
  //         </head>
  //         <body onload="window.print(); window.close();">
  //           ${printContents}
  //         </body>
  //       </html>
  //     `);
  //     printWindow.document.close();
  //   }
  // }
}
