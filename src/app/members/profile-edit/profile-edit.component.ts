import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user: User;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Retrieving our user details
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }
}
