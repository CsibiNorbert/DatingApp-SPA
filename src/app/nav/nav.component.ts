import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  navModel: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login(){
    // we allways need to subscribe to observables
    // And we do something with that observable inside it
    this.authService.login(this.navModel).subscribe(next => {
      console.log('Logged in succesfully');
    }, error => {
      console.log('failed to login');
    }); 
  }
}
