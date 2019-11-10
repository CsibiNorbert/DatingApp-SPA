import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // get token from localstorage
    const token = localStorage.getItem('token');

    // Turn string into an object
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      // Add the decoded token to the decodedToken in authService once the app is loaded.
      // This is created because when we are already logged in to decode the token again
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if (user) {
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
