import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const specificEndpoints = ['/upload-files', '/upload-folders', 'storage/upload-files', 'upload'];

    let isSpecificEndpoint = specificEndpoints.some(endpoint => request.url.includes(endpoint))

    if (isSpecificEndpoint) {

      // const boundary = this.generateBoundary();

      // request = request.clone({
      //   setHeaders: {
      //     "Content-Type": `multipart/form-data; boundary = ${boundary}`,
      //   },
      // });

    } else {

      request = request.clone({
        setHeaders: {
          "Content-type": "application/json"
        },
      });

    }



    return next.handle(request);
  }


  private generateBoundary(): string {


    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Generate a random ID
    const timestamp = Date.now().toString(36); // Convert the current timestamp to a string in base 36
    const boundary = randomId + timestamp;

    return boundary;
  }
}
