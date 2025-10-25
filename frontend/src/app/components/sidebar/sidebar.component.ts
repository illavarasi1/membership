import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
   
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isAuthenticated: boolean = false;
  router=inject(Router)
  authService=inject(AuthService)
  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken(); // Check if user is logged in
  }
  isSubmenuOpen = false;

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
  // isLoginPage(): boolean {
  //   return this.router.url === 'admin/login'; // Adjust if your login route is different
  // }
  // handleKeydown(event: KeyboardEvent): void {
  //   if (event.key === 'ArrowRight') {
  //     this.isSubmenuOpen = true;
  //   } else if (event.key === 'ArrowLeft') {
  //     this.isSubmenuOpen = false;
  //   }
  // }
}
