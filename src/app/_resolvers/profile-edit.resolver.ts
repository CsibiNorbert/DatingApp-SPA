import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class ProfileEditResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService // because we need the token
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    // resolver already subscribe to the method
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
        catchError(error => {
            this.alertify.error('Problem retrieving your data');
            // navigate back to members if error
            this.router.navigate(['/members']);

            // returns an observable of null
            return of(null);
        })
    );
  }
}
