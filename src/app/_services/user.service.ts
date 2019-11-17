import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/User";
import { PaginatedResult } from "../_models/Pagination";
import { map } from "rxjs/operators";
import { Message } from "../_models/message";

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
    userParams?,
    likesParam?
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

    if (likesParam === "Likers") {
      params = params.append("likers", "true");
    }

    if (likesParam === "Likees") {
      params = params.append("likees", "true");
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

  sendLike(id: number, recipientId: number) {
    // parameters shuld match the API`s parameters
    return this.http.post(
      this.baseUrl + "users/" + id + "/like/" + recipientId,
      {}
    );
  }

  getMessages(userId: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params = params.append("MessageContainer", messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    return this.http
      .get<Message[]>(this.baseUrl + "users/" + userId + "/messages", {
        observe: "response",
        params
      })
      .pipe(
        map(response => {
          paginatedResult.result = response.body; // list of messages
          if (response.headers.get("pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("pagination")
            ); // get JSON string into an object so that we store it in the pagination
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number){
    return  this.http.get<Message[]>(this.baseUrl + 'users/'+userId+'/messages/thread/'+recipientId);
  }

  sendMessage(loggedInUserId: number, message: Message){
    return this.http.post(this.baseUrl+'users/' + loggedInUserId + '/messages', message);
  }
}
