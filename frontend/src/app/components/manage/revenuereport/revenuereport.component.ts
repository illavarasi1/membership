import { Component, inject,OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Members } from '../../../model/members';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RenewService } from '../../../services/renew.service';
import { IRenew } from '../../../model/renew';

@Component({
  selector: 'app-revenuereport',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './revenuereport.component.html',
  styleUrl: './revenuereport.component.css'
})
export class RevenuereportComponent implements OnInit  {
  renewService = inject(RenewService);
  renewData: IRenew[] = [];
  memberService=inject(MemberService)
  members: Members[] = [];
  reportData: any[] = []; 
  createdAt: string | null = null;
  expiryDate: string | null = null;
  totalRecords: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  search: string = '';
  totalPages: number = 0;

ngOnInit(): void {
  // Fetch members on component load
  this.memberService.getmembers(this.currentPage, this.limit, this.search).subscribe((result: Members[]) => {

    this.members = result || [];
  });
  this.renewService.getrenew().subscribe((data: IRenew[]) => {
    this.renewData = data || [];
  });
}
  // Generate the report based on the date range
  generateReport(): void {
    if (!this.createdAt || !this.expiryDate) {
      alert('Please select both Created At and Expiry Date.');
      return;
    }

    const createdAtDate = new Date(this.createdAt);
    const expiryDateDate = new Date(this.expiryDate);

    // Filter members based on the createdAt and expiryDate range
    this.reportData = this.renewData.filter((renewal: IRenew) => {
      const renewDate = new Date(renewal.renew_date || '');
      return renewDate >= createdAtDate && renewDate <= expiryDateDate;
    

      // return (
      //   memberCreatedAt &&
      //   memberExpiryDate &&
      //   memberCreatedAt >= createdAtDate &&
      //   memberExpiryDate <= expiryDateDate
      // );
    });
  }
  // printReport() {
  //   window.print();
  // }
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
            <h2>Revenue Report</h2>
            ${tableContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
