import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  user: User;
  registerForm: FormGroup;

  // We declare it partial because we don`t want to initialize everything in the date picker
  // Partial class means all of the prop are optional
  bsConfig: Partial<BsDatepickerConfig>;
  colorDatePickerTheme = 'theme-dark-blue';

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = Object.assign({
      containerClass: this.colorDatePickerTheme
    });
    this.createRegisterForm();
  }

  createRegisterForm() {
    // fb.group is equivalent to new FormGroup
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(12)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Create custom validator
  passwordMatchValidator(form: FormGroup) {
    // it takes string of a path that we want to validate
    // return object if it doesn`t match
    return form.get('password').value === form.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      // JS method object.assign will take the inputs from the form and it will add it to the user.
      // clones the value into the empty object {} and we assign the object to user
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.alertify.success('Registration successful');
        },
        error => {
          this.alertify.error(error);
        },
        () => {
          // On complete
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        }
      );
    }
    // this.authService.register(this.registerModel).subscribe(
    //   () => {
    //     this.alertify.success('registration successful');
    //   },
    //   error => {
    //     this.alertify.error(error);
    //   }
    // );
  }

  cancel() {
    // Sends back to the parent component the value false, so that we can toggle the divs
    this.cancelRegister.emit(false);
  }
}
