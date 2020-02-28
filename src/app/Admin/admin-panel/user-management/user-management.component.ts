import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  bsModalRef: BsModalRef;
  users: User[];

  constructor(private adminService: AdminService,
              private alertify: AlertifyService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(){
    this.adminService.getUsersWithRoles().subscribe( (userRoles: User[]) => {
      this.users = userRoles;
    }, error => {
      this.alertify.error('An error occured while retrieving users with roles ' + error);
    });
  }

  editRolesModal(user: User) {
    const initialState = {
     user,
     roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    
    // We subscribe to the output which is in the modal so that we can get the values
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        // spread opperator and pass values that are checked
        // *Spread operator spreads the values into a new array and it`s gonna be assigned to roleNames
        // The roleName needs to be passed, hence we use map
        roleNames: [...values.filter( el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate)
          .subscribe(()=> {
            // it will create a new array and it will be passed into the user.roles
            // And update the browser
            user.roles = [...rolesToUpdate.roleNames];
          }, err => {
            this.alertify.error('An error occured while assigning roles' + err);
          });
      }
    });
  }

  private getRolesArray(user){
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Member', value: 'Member'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'VIP', value: 'VIP'},
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;

      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }

      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
