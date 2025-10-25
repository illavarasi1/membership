import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { authService } from './auth.service'; 
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root' // This ensures it is provided globally
})
export class authGuard implements CanActivate {
  authService=inject(AuthService)
 router=inject(Router)
 canActivate(
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean {
  const isAuthenticated = this.authService.isAuthenticated();  // Check if the user is authenticated

      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/admin/login']);  // Redirect to login if not authenticated
        return false;
      }
}
};
