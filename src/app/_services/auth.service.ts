import { Injectable } from "@angular/core"; // Allows us to inject things into our service
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: "root" // This is telling that in which module the service is provided
})
export class AuthService {
  baseUrl = "https://localhost:44378/api/auth/";
  jwtHelper = new JwtHelperService();

  constructor(private apiservice: HttpClient) {}

  // pipe allows us to chain rxgx (transform response)
  login(navModel: any) {
    return this.apiservice.post(this.baseUrl + 'login', navModel).pipe(
      map((response: any) => {
        const userToken = response;

        if (userToken) {
          localStorage.setItem('token', userToken.token);
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
