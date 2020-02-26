import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}
  // We need the snapshot so that we can get access to the data property inside the route
  canActivate(next: ActivatedRouteSnapshot): boolean {
    // get the roles that are listed in the data property in the routes
    // Because the guard is protecting the child routes we use firstChild
    const roles = next.firstChild.data['roles'] as Array<string>;

    // Check if anything is inside the roles
    if (roles) {
      const match = this.authService.roleMatch(roles);

      if (match) {
        return true;
      } else {
        this.router.navigate(['/members']);
        this.alertify.error('Not authorized to access this area');
      }
    }
    if (this.authService.isLoggedIn()) {
      return true;
    } else {

      this.alertify.error('You have no access using this landscape');

      this.router.navigate(['/home']);

      return false;
    }
  }
}
