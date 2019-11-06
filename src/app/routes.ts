import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

// Array of routes
// ORDERING IS IMPORTANT
export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    // if we put something here, we can access the childs like e.g (localhost:4200/dummymembers).
    // But empty means the childs can be accessed like /members
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver }
        // canActivate: [AuthGuard] specification of our guards. We have only 1 This needs to be added everywhere
      },
      {
        path: 'members/:id', // which is how we specified the route parameter in the loadUder in member-details
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver } // this is the resolver for geting the id for specific user in the router.data
      },
      {
        path: 'messages',
        component: MessagesComponent
      },
      {
        path: 'lists',
        component: ListsComponent
      }
    ]
  },
  {
    path: '**', // anything which doesn`t match what we have here, it will redirect to the home
    redirectTo: '', // redirects to..
    pathMatch: 'full' // we want to match the full path to the url
  }
];
