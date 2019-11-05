import { Injectable } from "@angular/core"; // Allows us to inject things into our service
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: "root" // This is telling that in which module the service is provided
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private apiservice: HttpClient) {}

  // pipe allows us to chain rxgx (transform response)
  login(navModel: any) {
    return this.apiservice.post(this.baseUrl + 'login', navModel).pipe(
      map((response: any) => {
        const userToken = response;

        if (userToken) {
          localStorage.setItem('token', userToken.token);

          // Decode the token so that we get the information inside the token
          // E.g we can use it to reflect the user`s name when they are logged in
          this.decodedToken = this.jwtHelper.decodeToken(userToken.token);
        }
      })
    );
  }

  register(registerModel: any){
    return this.apiservice.post(this.baseUrl + 'register', registerModel);
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');

    // Check if token is expired
    return !this.jwtHelper.isTokenExpired(token);
  }
}
