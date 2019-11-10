import { Injectable } from '@angular/core'; // Allows us to inject things into our service
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root' // This is telling that in which module the service is provided
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  // This is user to have all the information about the user and set it in the local storage
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  // This can be accessed in any component, we are able to subscribe to this prop
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private apiservice: HttpClient) {}

  // This is the method we use to update our photo with the next photo
  // When user logs in, this method is called, so that the url will be updated
  changeMemberPhoto(photoUrl: string) {
    // This will update the URL with the photo url passed in
    this.photoUrl.next(photoUrl);
  }

  // pipe allows us to chain rxgx (transform response)
  login(navModel: any) {
    return this.apiservice.post(this.baseUrl + 'login', navModel).pipe(
      map((response: any) => {
        const userToken = response;

        if (userToken) {
          localStorage.setItem('token', userToken.token);
          // Match what is coming back from the server
          localStorage.setItem('user', JSON.stringify(userToken.user));

          // Decode the token so that we get the information inside the token
          // E.g we can use it to reflect the user`s name when they are logged in
          this.decodedToken = this.jwtHelper.decodeToken(userToken.token);
          // This will take the response from the server called user
          this.currentUser = userToken.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(registerModel: any) {
    return this.apiservice.post(this.baseUrl + 'register', registerModel);
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');

    // Check if token is expired
    return !this.jwtHelper.isTokenExpired(token);
  }
}
