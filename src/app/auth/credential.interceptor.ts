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
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth;
    if (localStorage.getItem('basic_creds')){
      auth = localStorage.getItem('basic_creds');
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${auth}`  
        }
      });
    }
    return next.handle(request);
  }
}