import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    // resolver already subscribe to the method
    return this.userService.getUsers().pipe(
        catchError(error => {
            this.alertify.error('Problem retrieving data with users');
            // navigate back to members if error
            this.router.navigate(['/home']);

            // returns an observable of null
            return of(null);
        })
    );
  }
}
