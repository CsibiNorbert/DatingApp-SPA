import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs'; // bringing the library, we don`t have type safety

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

  // We give message but also a function to say what happens next
  confirm(message:string, okCallback: () => any) {
    alertify.confirm(message, (event: any) =>{
      // if there is an event, the user pressed ok
      if (event){
        okCallback();
      }else{
        // here we canceling the notification, we do nothing
      }
    });
  }

  success(message: string){
    alertify.success(message);
  }

  error(message: string){
    alertify.error(message);
  }

  warning(message: string){
    alertify.warning(message);
  }

  message(message: string){
    alertify.message(message);
  }
}
