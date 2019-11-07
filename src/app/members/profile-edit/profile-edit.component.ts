import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;

  user: User;

  // This will prevent user if accidentally will close the browser
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
      console.log('inside unloadnotif');
      return false;
    }
    console.log('outside unloadnotif');
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    // Retrieving our user details
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUserProfile() {
    console.log(this.user);
    this.alertify.success('Profile Saved Successfully');

    // this is to reset the current state of the form
    // So that the alert will dissapear & the button will be back to disabled
    this.editForm.reset(this.user);
  }
}
