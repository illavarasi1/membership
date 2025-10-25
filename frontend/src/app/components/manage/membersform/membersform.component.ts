import { Component, inject , OnInit} from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Members } from '../../../model/members';
import { MemberType} from '../../../model/membertype';
import { CommonModule } from '@angular/common'; 
import { MembertypeService } from '../../../services/membertype.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
interface MembershipType {
  id: number; // or string, based on your actual data type
  type: string;
  amount: number; // Assuming there's an amount field
}

@Component({
  selector: 'app-membersform',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
   
  ],
  templateUrl: './membersform.component.html',
  styleUrl: './membersform.component.css'
})
export class MembersformComponent  implements OnInit {
  title: string = '';
  membersForm: FormGroup;
  members: Members[] = [];
membershipTypes: MemberType[] = []; 
memberService=inject(MemberService)
membertypeService=inject(MembertypeService)
router=inject(Router)
route=inject(ActivatedRoute)
fb=inject(FormBuilder)
selectedFile: File | null = null;
fullname: string = '';
totalRecords: number = 0;
currentPage: number = 1;
limit: number = 10;
search: string = '';
totalPages: number = 0;
dob!: Date;
gender: string = '';
contact_number!: string;
email: string = '';
address: string = '';
country: string = '';
postcode!: string;
occupation: string = '';
membership_type: string = '';
membership_number: string = '';
currentYear!: number;
created_at!: Date;
photo!: {
  data: Uint8Array | string; 
  contentType: string;
};
expiry_date!: Date;
  // Variables to store the messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

constructor() {
  this.membersForm = this.fb.group({
    fullname: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    contact_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    country: ['', Validators.required],
    postcode: ['', Validators.required],
    occupation: ['', Validators.required],
    membership_type: ['', Validators.required],
    // created_at: ['',Validators.required],
    photo: [null, Validators.required] 
    // expiry_date: ['',Validators.required]
})
}
isEdit=false
id!:string
ngOnInit() {
  this.currentYear = new Date().getFullYear();
  this.fetchMembers();
  this.fetchMembershipTypes();

 this.id=this.route.snapshot.params["id"]

  if(this.id){
    console.log('setting edit true')
    this.isEdit=true
    this.memberService.getmembersbyid(this.id).subscribe((result:any)=>{
      console.log(result)
      this.membersForm.patchValue({
        fullname: result.fullname,
        dob: result.dob,
        gender: result.gender,
        contact_number: result.contact_number,
        email: result.email,
        address: result.address,
        country: result.country,
        postcode: result.postcode,
        occupation: result.occupation,
        membership_type: result.membership_type?._id, // Assuming this is included in the result
        created_at: result.created_at,
        photo: result.photo, // Make sure this is correctly handled, e.g., if it's a file
        expiry_date: result.expiry_date
    })
  })
  }
  //   this.isEdit = this.route.snapshot.paramMap.get('mode') === 'edit';
  //   this.title = this.isEdit ? 'Edit Members' : 'Add Members';
  // this.id=this.route.snapshot.params['id']
  // console.log(this.id)
  // if(this.id){
  //   this.isEdit=true
  //   this.memberService.getmembersbyid(this.id).subscribe((result:any)=>{
  //     console.log(result)
  //     this.type=result.type
  //     this.amount=result.amount
  //   })
  // }
  
}
fetchMembers() {
  this.memberService.getmembers(this.currentPage, this.limit, this.search).subscribe((result: Members[]) => {
    console.log(result); 
    this.members = result; // Assign the fetched members data to the component property
  });
}
// fetchMembershipTypes() {
//   this.membertypeService.getmembertype(this.currentPage, this.limit, this.search).subscribe((types: MemberType[]) => {
//     console.log(types); 
//     this.membershipTypes = types; // Assign the fetched membership types data to the component property
//   });
// }
fetchMembershipTypes() {
  this.membertypeService.getmembertype(this.currentPage, this.limit, this.search)
    .subscribe({
      next: (response: any) => {
      // // If the response is an object with a data property that holds an array:
      // this.membershipTypes = response.data || [];  // Ensure it's an array
      // console.log('Fetched Membership Types:', this.membershipTypes);
      // },
      if (response && Array.isArray(response.data)) {
        this.membershipTypes = response.data;
      } else {
        this.membershipTypes = []; // fallback to empty array if data is invalid
        console.error('Invalid data format:', response);
      }
    
    },
      error: (err) => {
        console.error('Error fetching membership types:', err);
      }
    });
}

  add(){
    console.log('executing add button')
    this.membersForm.markAllAsTouched(); 
    console.log(this.membersForm.valid)
    if (this.membersForm.valid) {
      const formData = new FormData();

      Object.entries(this.membersForm.value).forEach(([key, value]) => {
        if (value instanceof Blob || typeof value === 'string') {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString()); // Convert Date to string if needed
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString()); // Convert other values to string
        }
      });
      console.log('Membership Type value:', this.membersForm.value.membership_type);
    // // This method will handle adding a new member
    const memberData: Partial<Members> = this.membersForm.value; // Get the values from the form
    // this.memberService.addmembers(memberData).subscribe(() => {
    //   // Handle success (e.g., redirect or show a message)
    //   this.router.navigate(['admin/members']); // Redirect to members list after adding
    // });
     // Handle adding the new member
     this.memberService.addmembers(memberData).subscribe({
      next: () => {
        // Success: Show success message
        this.successMessage = 'Member added successfully!';
        this.errorMessage = null;  // Clear any previous error message
        this.router.navigate(['admin/members']); // Redirect to members list after adding
      },
      error: (err) => {
        // Error: Show error message
        this.errorMessage = 'Failed to add member. Please try again later.';
        this.successMessage = null;  // Clear any previous success message
        console.error('Error adding member:', err);
      }
    });
  } else {
    this.errorMessage = 'Please fill out all required fields.';
    this.successMessage = null;  // Clear any previous success message
  }
  }
    
    onMembershipTypeChange(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedValue = selectElement.value;
      // Add logic to handle the selected membership type
      const selectedMemberType = this.membershipTypes.find(type =>  type._id ===selectedValue);
      console.log('Selected Membership Type ID:', selectedMemberType);
      console.log('Selected Membership Type ID:', selectedValue);
      if (selectedMemberType) {
        console.log('Selected Membership Type:', selectedMemberType);
        // If you need to, you can set any additional fields based on the selected member type
        this.membersForm.patchValue({
          membership_type: selectedMemberType._id,// Display the name of the type if needed
        });
      }
    }
     // Capture the file when the user selects it
  onFileChange(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      // Set the form control to the selected file
      this.membersForm.patchValue({
        photo: this.selectedFile
      });
    }
  }
}
