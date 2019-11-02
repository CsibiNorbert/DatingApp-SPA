import { Injectable } from "@angular/core"; // Allows us to inject things into our service
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root" // This is telling that in which module the service is provided
})
export class AuthService {
  baseUrl = "https://localhost:44378/api/auth/";

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
}
