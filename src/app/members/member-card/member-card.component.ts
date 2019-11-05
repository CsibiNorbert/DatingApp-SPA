import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';

// child component of member-list component
@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  // This needs to match the input in the html selector of the parent
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
