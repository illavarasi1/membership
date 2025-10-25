import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from '../../../model/settings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent  implements OnInit {
  // settings = { system_name: '', currency: '' };
  settingsForm!: FormGroup;
  passwordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  successMessagePassword: string | null = null;
  errorMessagePassword: string | null = null;
  logo: File | null = null;
  logoFile: File | null = null;
  selectedFile: File | undefined;
  settings: Settings = { _id:0,system_name: '', currency: 0 }; // Initialize settings object
  fileToUpload: File | undefined;// To hold the uploaded file
  loading = false;
  userId!: string;
  fb=inject(FormBuilder)
  settingsService=inject(SettingsService)
  authService=inject(AuthService)
  router=inject(Router)
  route=inject(ActivatedRoute)
  system_name: string = '';
  currency: number = 0;
     // Initialize the forms
  
  //    constructor() {
  //     this.settingsForm = this.fb.group({
  //       systemName: ['', Validators.required],
  //       currency: ['', Validators.required],
  //     });
  //   this.passwordForm = this.fb.group({
  //     currentPassword: ['', Validators.required],
  //     newPassword: ['', Validators.required],
  //     confirmPassword: ['', Validators.required],
  //   });
  // }

 
  // fetchSettings() {
  //   this.settingsService.getSettings().subscribe({
  //     next: (data) => this.settingsForm.patchValue(data),
  //     error: (err) => (this.errorMessage = 'Failed to fetch settings')
  //   });
  // }

  // onFileChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     this.selectedFile = input.files[0];
  //   }
  // }

  // updateSettings() {
  //   const formData = new FormData();
  //   formData.append('systemName', this.settingsForm.value.systemName);
  //   formData.append('currency', this.settingsForm.value.currency);
  //   if (this.selectedFile) formData.append('logo', this.selectedFile);

  //   this.settingsService.updateSettings(formData).subscribe({
  //     next: (data) => (this.successMessage = 'Settings updated successfully'),
  //     error: (err) => (this.errorMessage = 'Failed to update settings')
  //   });
  // }

  // changePassword() {
  //   if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
  //     this.errorMessagePassword = 'Passwords do not match';
  //     return;
  //   }

  //   this.settingsService.changePassword(this.passwordForm.value).subscribe({
  //     next: (data) => (this.successMessagePassword = 'Password changed successfully'),
  //     error: (err) => (this.errorMessagePassword = 'Failed to change password')
  //   });
  // }
  
  ngOnInit(): void {
    this.initializeForms();

    // Fetch userId, assuming it's available as a route parameter or from a service
  
  // // Fetch the userId from AuthService
 
    this.loadSettings(1);
  }

  // Initialize the reactive forms
  initializeForms(): void {
    this.settingsForm = this.fb.group({
      system_name: ['', Validators.required],
      logo: [''],
      currency: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]  // Ensure currency is a number
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  loadSettings(id:number): void {
    this.settingsService.getSettingsById(id).subscribe({
      next: (response) => {
        this.settings = response; // Update the settings model
        this.settingsForm.patchValue(response); // Populate the form with fetched data
      },
      error: (error) => {
        this.errorMessage = 'Failed to load settings.';
        console.error('Error loading settings:', error);
      }
    });
  }
  
// onFileChange(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.fileToUpload = input.files[0]; // Assign the selected file
//   } else {
//     this.fileToUpload = undefined; // Reset if no file selected
//   }
// }
 // Handle file selection
 onFileChange(event: any): void {
  const file: File = event.target.files[0];
  this.selectedFile = file;
}
//  Handle logo file change
//  onFileChange(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     this.fileToUpload = file ? file : undefined;
//   }
// }
// updateSettings(): void {
//   if (this.selectedFile) {
//     this.settingsService.updateSettings(this.system_name, this.currency,  this.selectedFile)
//       .subscribe(
//         response => {
//           console.log('Settings updated successfully:', response);
//         // Handle the successful response
//         this.successMessage = 'Settings updated successfully!';
//         this.errorMessage = '';  // Clear error message if successful
//       },
      
//       (error) => {
//         // Handle the error response
//         this.errorMessage = 'Error updating settings: ' + error.message;
//         this.successMessage = '';  // Clear success message if error occurs
//       }
//     );
//   } else {
//     console.error('Please fill in all required fields.');
//   }
// }
updateSettings(): void {
  const formData = new FormData();
  formData.append('system_name', this.settingsForm.get('system_name')?.value);
  formData.append('currency', this.settingsForm.get('currency')?.value);

  if (this.selectedFile) {
    formData.append('logo', this.selectedFile); // Use the selected logo file
  }
  console.log([...Array.from((formData as any).entries())]); 
  this.successMessage = ''; // Clear previous success message
  this.errorMessage = '';  // Clear previous error message

  this.settingsService.updateSettings(formData).subscribe({
    next: (res) => {
      this.successMessage = 'Settings updated successfully!';
      this.settingsForm.markAsPristine(); // Optional: Mark form as unchanged
      this.logo = null; // Clear the logo file
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Failed to update settings.';
    }
  });
}

  // Submit password change form
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.errorMessagePassword = 'Please fill in all required fields correctly.';
      return;
    }

    const {  currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    this.authService.changePassword(currentPassword, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.successMessagePassword = 'Password changed successfully!';
        this.errorMessagePassword = null;
        this.passwordForm.reset(); // Clear the form after success
      },
      error: (error) => {
        this.successMessagePassword = null;
        this.errorMessagePassword = error.error?.message || 'Failed to change the password.';
      }
    });
  }
}
