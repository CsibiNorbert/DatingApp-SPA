import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProfileEditComponent } from '../members/profile-edit/profile-edit.component';

@Injectable()
export class PreventUnsavedChanges
  implements CanDeactivate<ProfileEditComponent> {
      // If unsaved changes will be in the form
      // And the user will leave the page
      // It will ask user if he is sure
  canDeactivate(component: ProfileEditComponent) {
    if (component.editForm.dirty) {
      return confirm(
        'Any unsaved changes will be lost, are you sure you want to continue?'
      );
    }
    // return true if form is not dirty
    return true;
  }
}
