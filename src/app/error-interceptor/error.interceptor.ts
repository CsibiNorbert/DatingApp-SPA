import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(errorResponse => {
            if (errorResponse.status === 401) {
                return throwError(errorResponse.statusText);
            }
            if (errorResponse instanceof HttpErrorResponse) {
                // these are exception returned back from our server
                // This needs to match how we called it in our middleware/API
                // This is how we deal with 500 type errors
                const applicationError = errorResponse.headers.get('application-error');

                // 500 status errors
                if (applicationError) {
                    return throwError(applicationError);
                }

                // Model state errors
                // 1st error param is the error we are getting in the DOM, the 2nd error is one step inside the first error
                // This is used when we throw one single error in our app
                const  serverError = errorResponse.error;

                // Validation errors
                let modalStateErrors = '';

                // the reason we check for typeof is because we want to make sure it is an object
                // in order to loop inside the object
                // This is useful when we have array of errors such as password required etc
                if (serverError.errors && typeof serverError.errors === 'object') {
                    for (const key in serverError.errors) {
                        // get the error with the key, behaves like the index in arrays
                       if (serverError.errors[key]) {
                        modalStateErrors += serverError.errors[key] + '\n';
                       }
                    }
                }

                // If we get 'Server Error' it means that we didn`t captured inside here and needs investigation
                return throwError(modalStateErrors || serverError || 'Server Error');
            }
        })
    );
  }
}

// This needs to be added in our providers array,
// we are just registering an interceptor provider to the angular http provider list which already exists
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true // can have multiple interceptors
};
