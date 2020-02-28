import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getUsersWithRoles(){
  return this.http.get(this.baseUrl + 'admin/usersWithRoles');
}

// the roles are type of object
updateUserRoles(user: User, roles: {}){
  // matches the path which is in the API
  // Roles are an object in the body
  return this.http.post(this.baseUrl + 'admin/editRoles/' + user.userName, roles);
}
}
