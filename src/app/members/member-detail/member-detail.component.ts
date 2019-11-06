import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  // Members/4, We can bring the 4 with the activated route
  // The + is forcing to be a number
  loadUser() {
    this.userService
      .getUser(+this.route.snapshot.params['id'])
      .subscribe((user: User) => {
        this.user = user;
      }, error => {
        this.alertify.error(error);
      });
  }
}
