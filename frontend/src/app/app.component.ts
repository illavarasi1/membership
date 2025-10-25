import { Component, inject } from '@angular/core';
import { Router,ActivatedRoute, NavigationEnd ,RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './components/navbar/navbar.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
// import {MatSidenavModule} from '@angular/material/sidenav';
// import {MatToolbarModule} from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import {MatMenuModule} from '@angular/material/menu';
// import {MatDividerModule} from '@angular/material/divider';
// import {MatListModule} from '@angular/material/list';
// import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // NavbarComponent,
    // SidebarComponent,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatMenuModule,
    // MatDividerModule,
    // MatListModule,
    // CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  router=inject(Router)
//   route = inject(ActivatedRoute);
  authService=inject(AuthService)
  isAuthenticated: boolean = false;
//   currentRoute: string = '';
// // isLoginPage: boolean = false; 
//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('authToken'); // Check if the token exists
//   }
//   title = 'frontend';
//   sideBarOpen=true
//   sideBarToggler(){
//     this.sideBarOpen=!this.sideBarOpen
//   }
//   onResize(event: Event) {
//     const screenWidth = (event.target as Window).innerWidth;
//     this.sideBarOpen = screenWidth > 768; // Open sidebar if screen width is greater than 768px
//   }
//   isLoginPage(): boolean {
//     return this.router.url === 'admin/login';
//   }
//   // You can listen to the window resize event to toggle sidebar visibility
  ngOnInit() {
//     window.addEventListener('resize', this.onResize.bind(this));
//       // Subscribe to route changes
//       // this.isLoginPage = this.router.url === '/login'; 
//       // this.router.events.subscribe(event => {
//       //   if (event instanceof NavigationEnd) {
//       //     this.isLoginPage = event.url === 'admin/login';
//       //   }
//       // });
this.isAuthenticated = this.authService.isAuthenticated();
  }

//   ngOnDestroy() {
//     // Clean up the event listener when the component is destroyed
//     window.removeEventListener('resize', this.onResize.bind(this));
//   }
 
}
