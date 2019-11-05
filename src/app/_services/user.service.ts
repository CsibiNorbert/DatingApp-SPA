import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

// temporary solution to send token to the server
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id,httpOptions );
  }

  // If we return observable of type N
  // The get should be specified with type N as well
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);
  }
}
