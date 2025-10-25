import { Component,ViewChild,inject,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { CommonModule } from '@angular/common';
import { MembershipstatusService } from '../../../services/membershipstatus.service';
import { MembershipcardComponent } from '../membershipcard/membershipcard.component';
import { Members } from '../../../model/members';
import { MatTableDataSource } from '@angular/material/table'; 
import { MembertypeService } from '../../../services/membertype.service';
import { MemberType } from '../../../model/membertype';
import { forkJoin } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';
import { MembertypeComponent } from '../membertype/membertype.component';
@Component({
  selector: 'app-memberprofile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    RouterModule,
    MembershipcardComponent
  ],
  templateUrl: './memberprofile.component.html',
  styleUrl: './memberprofile.component.css'
})
export class MemberprofileComponent implements OnInit {
  @Output() typeSelected = new EventEmitter<string>();
  @ViewChild(MembershipcardComponent) membershipCardComponent!: MembershipcardComponent;
  @ViewChild(MembertypeComponent) membertypeComponent!:MembertypeComponent; 
  

  dataSource: MatTableDataSource<Members>;
  membershipTypeNames: any[] = []; 
 id!: string;
  memberDetails: any = {};
  membershipStatus: string = ''; 
    systemName: string = '';
    photoUrl: string | null = null; 
    totalRecords: number = 0;
    currentPage: number = 1;
    currentYear!: number;
    limit: number = 10;
    search: string = '';
    totalPages: number = 0;
  memberService=inject(MemberService)
  membertypeService=inject(MembertypeService)
router=inject(Router)
route=inject(ActivatedRoute)
membershipStatusService=inject(MembershipstatusService)
selectType(type: string) {
  this.typeSelected.emit(type);
}

constructor() {
  this.dataSource = new MatTableDataSource([]as any);
}
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.getMemberDetails();
      this.getMembershipTypes(); 
    });
       
  }
  // ngAfterViewInit() {
  //   // Now it's safe to access @ViewChild since the view has been initialized
  //   if (this.membertypeComponent) {
  //     this.membertypeComponent.typeSelected.subscribe((selectedType: string) => {
  //       console.log('Selected type from MembertypeComponent:', selectedType);
  //       this.memberDetails.membership_type_name = selectedType;
  //     });
  //   } else {
  //     console.error('MembertypeComponent is not available');
  //   }
  // }

  private getMembershipTypes() {
    
    this.membertypeService.getmembertype(1,1000,'').subscribe((types: MemberType[]) => {
      this.membershipTypeNames = types;
      console.log('Membership Types:', this.membershipTypeNames);
      // if (Array.isArray(this.membershipTypeNames)) {
    //   this.membershipTypeNames.forEach(type => {
    //     console.log('ID:', type._id);  // Log the _id to check if it's present
    //     console.log('Type:', type.type); // Check if `_id` is present
    // });
  // }
  // else {
  //   console.error('membershipTypeNames is not an array:', this.membershipTypeNames);
  // }
    console.log('Filtered membership types:', this.membershipTypeNames);
  });
  
  this.membertypeService.getmembertype(1,1000,'').subscribe(response => {
    // console.log('API Response:', response);  // Log the API response to check its structure
    // this.membershipTypeNames = response.membershipTypes || []; // Assign the data to your class property
    // Ensure the response is an array before assigning it
     // Fallback to an empty array if `membershipTypes` is undefined or not an array
  this.membershipTypeNames = Array.isArray(response.membershipTypes) ? response.membershipTypes : [];
  
}, error => {
  console.error('Error fetching membership types:', error);
  this.membershipTypeNames = [];  // Default to empty array in case of error
});
}
private getMemberDetails() {
    this.memberService.getmembersbyid(this.id).subscribe(data => {
      console.log('data',data)
      console.log('Member Data:', data);
      this.memberDetails = data;
      this.checkMembershipStatus();

      if (this.membershipTypeNames && Array.isArray(this.membershipTypeNames)) {
      this.dataSource.data = [data].map((member: Members) => {
        // Check if expiry_date exists and is valid, else assign a default date or status
        const membershipType = this.membershipTypeNames.find(type => type._id=== member.membership_type);
        this.memberDetails.membership_type_name = membershipType ? membershipType.type : 'Unknown';
        return {
          ...member,

       membership_type: membershipType ? membershipType.type : 'N/A'
                  };
      });
      } else {
        console.error('membershipTypeNames is not available or not an array');
        this.dataSource.data = [data]; // Fallback to original data if membership types are unavailable
      }
   
       this.systemName = data.settings ? data.settings.system_name : '';
          // Check if the photo exists
    if (data.photo && data.photo !== '') {
      this.photoUrl = data.photo ? `http://localhost:8000/${data.photo}` : null;
    } else {console.log(`http://localhost:8000/images/${data.photo}`)
      this.photoUrl = 'images/default.jpg'; // fallback image if photo is not available
    }

    console.log('Computed Photo URL:', this.photoUrl);
   
    })
  
  }
  checkMembershipStatus() {
    const expiryDate = new Date(this.memberDetails.expiry_date);
    const currentDate = new Date();
    const daysDifference = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    this.membershipStatus = daysDifference < 0 ? 'Expired' : 'Active';
    this.membershipStatusService.setMembershipStatus(this.membershipStatus);
  }

  // printMembershipCard(): void {
  //   const printContent = `
  //     <html>
  //       <head>
  //         <title>Print Membership Card</title>
  //         <style>
  //           body { background: #222; padding: 2rem; font-family: helvetica; }
  //           .card {
  //             background: linear-gradient(36deg, rgba(192, 178, 195, 1) 0%, rgba(253, 243, 255, 1) 36%, rgba(246, 235, 248, 1) 64%, rgba(202, 187, 205, 1) 100%);
  //             border-radius: 10px;
  //             margin: auto;
  //             width: 500px;
  //             height: 280px;
  //             box-shadow: 2px 5px 15px 5px #00000030;
  //             display: flex;
  //             flex-flow: column;
  //             transition: all 1s;
  //           }
  //           .card:hover { box-shadow: 10px 10px 15px 5px #00000030; }
  //           .title { display: flex; justify-content: space-between; flex-flow: row-reverse; padding: 0.5rem 1.5rem; text-transform: uppercase; font-size: 12px; color: #00000090; }
  //           .emboss { padding: 1rem 1.5rem 0; font-size: 18px; color: black; font-family: courier; text-transform: uppercase; letter-spacing: 3px; }
  //           .emboss2 { padding: 1rem 1.5rem 0 10rem; font-size: 11px; color: black; text-transform: uppercase; letter-spacing: 1px; }
  //           .hologram { width: 6.5rem; height: 6.5rem; float: right; margin: -5rem 1.5rem 0 auto; }
  //           .photo { width: 5rem; height: 5rem; border-radius: 50%; overflow: hidden; margin: 1rem; float: right; }
  //           .photo img { width: 100%; height: 100%; object-fit: cover; }
  //         </style>
  //       </head>
  //       <body onload="window.print(); window.close();">
  //         <div class="card">
  //           <span class="title">Membership Card
  //             <img src="" alt="Logo" style="width: 50px; height: auto;">
  //           </span>
  //           <span class="emboss"><b>${this.systemName}</b></span>
  //           <span class="emboss"><b>#${this.memberDetails.membership_number}</b></span>
  //           <span class="emboss">${this.memberDetails.fullname}</span>
  //           <div>
  //             <span class="emboss">${this.memberDetails.address}, ${this.memberDetails.postcode}</span>
  //           </div>
  //           <div>
  //             <span class="emboss"><b>Membership: ${this.memberDetails.membership_type_name}</b></span>
  //             <div class="photo">
  //               <img src="${this.photoUrl}" alt="Member Photo" class="hologram">
  //             </div>
  //           </div>
  //           <div>
  //             <hr><small>
  //             <span class="emboss2">Valid till ${new Date(this.memberDetails.expiry_date).toLocaleDateString()}</span>
  //             </small>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   const printWindow = window.open('', '', 'width=800,height=600');
  //   if (printWindow) {
  //     printWindow.document.open();
  //     printWindow.document.write(printContent);
  //     printWindow.document.close();
  //   }
  // }
  // printMembershipCard(): void {
  //   if (this.membershipCardComponent) {
  //     this.membershipCardComponent.printMembershipCard();
  //   } else {
  //     console.error('Membership card component is not initialized');
  //   }
  // }
  // printMembershipCard() {
  //   // Assuming "membershipCard" is in the DOM for print
  //   const printContents = document.getElementById('membershipCard')?.outerHTML || '';
  //   const originalContents = document.body.innerHTML;

  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  // }
  // showMembershipCard(): void {
  //   // Pass `memberDetails` (not `this.member`) to the router state
  //   this.router.navigate(['admin/membershipcard'], {
  //     state: { member: this.memberDetails },
  //   });
  // }
  // printMembershipCard(): void {
  //   if (this.membershipCardComponent) {
  //     this.membershipCardComponent.showMembershipCard();
  //   } else {
  //     console.error('MembershipcardComponent is not available.');
  //   }
  // }
  // printMembershipCard(): void {
  //   const printContents = document.getElementById('memberProfile')?.innerHTML || '';
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents; // Restore original content after printing
  // }
  printMembershipCard(): void {
    // Get the membership card element's HTML content
    const printContents = document.getElementById('memberProfile')?.innerHTML;
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
            background: none;
            padding: 0;
        }

        .btn * {
            visibility: hidden;
        }

        .print-button {
            display: none;
        }

        .card-tools {
            display: none;
        }

        .card {
            border: 2px solid #000;
            border-radius: 10px;
            margin: 20px;
            padding: 20px;
            box-shadow: 2px 2px 5px #888888;
        }

        .card-body {
            padding: 20px;
        }

        .row {
            display: flex;
            justify-content: space-between;
             flex-wrap: wrap;
        }

        .col-md-5
      {
         width: 45%;
        }
            .col-md-2{
             display: flex;
                flex-direction: column;
            } 
     
      .img-thumbnail  {

            width: 100px;
            height: 100px;
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
  }

  
