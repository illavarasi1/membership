import {  OnInit,inject,ViewChild } from '@angular/core';
import { MembertypeService } from '../../../services/membertype.service';
import { MatTableDataSource } from '@angular/material/table'; 
import { MemberType } from '../../../model/membertype';
import { CommonModule,CurrencyPipe  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterModule } from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-membertype',
  standalone: true,
  imports: [CommonModule,
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
     CurrencyPipe 
    ],
  templateUrl: './membertype.component.html',
  styleUrl: './membertype.component.css'
})
export class MembertypeComponent implements OnInit{
  membershipTypes: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  currentYear!: number;
  limit: number = 10;
  search: string = '';
  startRecord = 1;
  endRecord = 0;
  totalPages: number[] = [1, 2, 3, 4, 5];  
  // @Output() typeSelected = new EventEmitter<string>();
  // selectType(type: string) {
  //   this.typeSelected.emit(type);
  // }
  title: string = '';

  displayedColumns: string[] = ['index', 'id','type', 'amount','action'];
  dataSource: MatTableDataSource<MemberType>;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  membertypeService=inject(MembertypeService)
  constructor() {


    this.dataSource = new MatTableDataSource([]as any);
  }
  route = inject(ActivatedRoute); 
  ngOnInit(){
    this.currentYear = new Date().getFullYear();
    this.getServerData()
    this.route.data.subscribe(data => {
      this.title = data['title'];
    });
  }
  public getServerData() {
    // this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((result) => {
    //   console.log(result);
    //   this.dataSource.data = result;
    // });
    this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((result) => {
      // Handle the response containing both data and pagination information
      this.membershipTypes = result.data;  // Assuming the data is under the 'data' field
      this.totalRecords = result.totalRecords;
      console.log( this.totalRecords)
      this.totalPages = Array.from({ length: Math.ceil(this.totalRecords / this.limit) }, (_, i) => i + 1);
      this.dataSource.data = this.membershipTypes;
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
    this.getServerData();
  }
  delete(id:string){
    console.log(id)
    this.membertypeService.deletemembertypebyid(id).subscribe((result:any)=>{
      if (confirm("Are you sure you want to delete this membership type?")) {
      this.getServerData()
      }
    })
  }
  getIndex(index: number): number {
    return index + 1;
  }

}




