import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  navModel: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {}

  login() {
    // we allways need to subscribe to observables
    // And we do something with that observable inside it
    this.authService.login(this.navModel).subscribe(
      next => {
        this.alertify.success("Logged in succsessfully");
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  logout() {

    // This is not a security risk, because our server creates the token and validates the token
    // We cannot validate the token on the client side, currently we validate it into our server
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
