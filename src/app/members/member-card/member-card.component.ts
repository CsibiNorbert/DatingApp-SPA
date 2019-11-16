import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/_models/User";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";
import { AlertifyService } from "src/app/_services/alertify.service";

// child component of member-list component
@Component({
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
  styleUrls: ["./member-card.component.css"]
})
export class MemberCardComponent implements OnInit {
  // This needs to match the input in the html selector of the parent
  @Input() user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {}

  sendLike(recipientId: number) {
    // when user clicks on the heart, the recipient id is being sent here
    this.userService
      .sendLike(this.authService.decodedToken.nameid, recipientId)
      .subscribe(data => {
        this.alertify.success("You have liked " + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      });
  }
}
