import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';

// Array of routes
// ORDERING IS IMPORTANT
export const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'members',
    component: MemberListComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'lists',
    component: ListsComponent
  },
  {
    path: '**', // anything which doesn`t match what we have here, it will redirect to the home
    redirectTo: 'home', // redirects to..
    pathMatch: 'full' // we want to match the full path to the url
  }
];
