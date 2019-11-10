import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

/* temporary solution to send token to the server, This is no longer needed because we use the jwt in the app module
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id /*,httpOptions*/);
  }

  // If we return observable of type N
  // The get should be specified with type N as well
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users' /*, httpOptions*/);
  }

  updateUser(id: number, user: User) {
    // In the body of the request we pass the user object
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  // id represents the photo id
  // a post request expects to send something in the body. This is an empty object because we don`t want to send anything
  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }
}
