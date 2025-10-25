import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
// router=inject(Router)
// login() {
//   // Simulate successful login
//   localStorage.setItem('authToken', 'mock-token');
//   this.router.navigate(['admin/home']); // Redirect to dashboard
// }

email: string = '';
password: string = '';
errorMessage: string | null = null;
returnUrl: string = '';

http=inject(HttpClient)
router=inject(Router)
route=inject(ActivatedRoute)
authService=inject(AuthService)
constructor() {}
ngOnInit() {
 
  // Get the returnUrl from the query parameters
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/home';
}
// onSubmit() {
//   this.authService.login({ email: this.email, password: this.password }).subscribe(
//       (response: any) => {
//         alert(response.message); // Show success message
//         localStorage.setItem('token', response.token); // Store token
//       },
//       (error) => {
//         this.errorMessage = error.message; // Show error message
//       }
//     );
// }

onSubmit(): void {
  console.log("Submitting login with email:", this.email, "password:", this.password);
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      if (response.token) {
        // Store the token
        this.authService.storeToken(response.token);

        // Get the return URL from query parameters or default to /admin/home
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/home';

        // Navigate to the return URL
        this.router.navigate(['/admin/home']); 
      } else {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    },
    error: (err) => {
      this.errorMessage = 'Error during login. Please try again.';
    }
  });
}
}
