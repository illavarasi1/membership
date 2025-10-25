import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MembertypeService } from '../../../services/membertype.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membertype-form',
  standalone: true,
  imports: [FormsModule,
    RouterLink,
     RouterModule ,
     MatDividerModule,
    CommonModule],
  templateUrl: './membertype-form.component.html',
  styleUrl: './membertype-form.component.css'
})
export class MembertypeFormComponent {
  title: string = '';
  type!:string;
  amount!:number;
  currentYear!: number;
membertypeService=inject(MembertypeService)
router=inject(Router)
route=inject(ActivatedRoute)
isEdit=false
id!:string
 // Success and Error messages
 successMessage: string = '';
 errorMessage: string = '';
ngOnInit(){
  this.currentYear = new Date().getFullYear();
  this.isEdit = this.route.snapshot.paramMap.get('mode') === 'edit';
  this.title = this.isEdit ? 'Edit Membership Type' : 'Add Membership Type';
this.id=this.route.snapshot.params['id']
console.log(this.id)
if(this.id){
  this.isEdit=true
  this.membertypeService.getmembertypebyid(this.id).subscribe((result:any)=>{
    console.log(result)
    this.type=result.type
    this.amount=result.amount
  })
}
}
// add(){
// console.log(this.type)
// console.log(this.amount)
// this.membertypeService.addmembertype(this.type,this.amount).subscribe((result:any)=>{
//   alert('member added')
//   this.router.navigateByUrl('/admin/membertypes/add')
// })
// }
add() {
  console.log(this.type);
  console.log(this.amount);
  if (!this.type || !this.amount) {
    this.errorMessage = 'Please fill in all the required fields.';
    this.successMessage = ''; // Clear success message if there's an error
    return;
  }

  this.membertypeService.addmembertype(this.type, this.amount).subscribe(
    (result: any) => {
      this.successMessage = 'Membership type added successfully!';
      this.errorMessage = ''; // Clear any previous error messages
      this.router.navigateByUrl('/admin/membertypes/add');
    },
    (error) => {
      this.errorMessage = 'An error occurred while adding the membership type.';
      this.successMessage = ''; // Clear success message if there's an error
    }
  );
}
// update(){
//   console.log(this.type)
// console.log(this.amount)
// this.membertypeService.updatemembertype(this.id,this.type,this.amount).subscribe((result:any)=>{
//   alert('member updated')
//   this.router.navigateByUrl('/admin/membertypes')
// })
// }
update() {
  console.log(this.type);
  console.log(this.amount);
  if (!this.type || !this.amount) {
    this.errorMessage = 'Please fill in all the required fields.';
    this.successMessage = ''; // Clear success message if there's an error
    return;
  }

  this.membertypeService.updatemembertype(this.id, this.type, this.amount).subscribe(
    (result: any) => {
      this.successMessage = 'Membership type updated successfully!';
      this.errorMessage = ''; // Clear any previous error messages
      this.router.navigateByUrl('/admin/membertypes');
    },
    (error) => {
      this.errorMessage = 'An error occurred while updating the membership type.';
      this.successMessage = ''; // Clear success message if there's an error
    }
  );
}
}
