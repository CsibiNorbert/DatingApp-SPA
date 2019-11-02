import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() registerToggleFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  registerModel: any = {};

  constructor() { }

  ngOnInit() {
  }

  register(){
    console.log('register hit', this.registerModel);
  }

  cancel(){
    // Sends back to the parent component the value false, so that we can toggle the divs
    this.cancelRegister.emit(false);
    console.log('canceled');
  }
}
