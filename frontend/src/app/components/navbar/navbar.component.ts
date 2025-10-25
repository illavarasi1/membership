import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule,
    MatToolbarModule,SidebarComponent,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService=inject(AuthService)
  router=inject(Router)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check if the token exists
  }

  @Output() toggleSidebarForMe: EventEmitter<any>=new EventEmitter()
  toggleSidebar(){
this.toggleSidebarForMe.emit()
  }
  isLoginPage(): boolean {
    return this.router.url === 'admin/login'; // Adjust if your login route is different
  }
}
