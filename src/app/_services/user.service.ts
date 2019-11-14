import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/User";
import { PaginatedResult } from "../_models/Pagination";
import { map } from "rxjs/operators";

/* temporary solution to send token to the server, This is no longer needed because we use the jwt in the app module
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};*/

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id /*,httpOptions*/);
  }

  // If we return observable of type N
  // The get should be specified with type N as well
  getUsers(
    page?,
    itemsPerPage?,
    userParams?
  ): Observable<PaginatedResult<User[]>> {
    // create the type of PaginatedResult and the a new instance of it
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    if (userParams != null) {
      params = params.append("minAge", userParams.minAge);
      params = params.append("maxAge", userParams.maxAge);
      params = params.append("gender", userParams.gender);
      params = params.append("orderBy", userParams.orderBy);
    }
    // the observe response will give us the full view of http response
    // Map allows us to manipulate what is coming back
    return this.http
      .get<User[]>(this.baseUrl + "users", { observe: "response", params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body; // this will contain our users
          if (response.headers.get("pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("pagination")
            );
          }
          return paginatedResult;
        })
      );
  }

  updateUser(id: number, user: User) {
    // In the body of the request we pass the user object
    return this.http.put(this.baseUrl + "users/" + id, user);
  }

  // id represents the photo id
  // a post request expects to send something in the body. This is an empty object because we don`t want to send anything
  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + "users/" + userId + "/photos/" + id + "/setMain",
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + "users/" + userId + "/photos/" + id);
  }
}
