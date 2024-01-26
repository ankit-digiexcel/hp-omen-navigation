import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private app_service: AppService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.app_service.getToken();
    const authRequest = request.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
        'X-CSCAPI-KEY':
          'QktMNDhVWVMxck5mQ3Mxc1Jkbzl1YjBEVVFpYUN0bWlHdUFyOVZ3Rw==',
        Accept: 'application/json',
      }),
    });
    return next.handle(authRequest).pipe(
      tap(
        (event) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            // logout after status 401
            if (error.status === 401) {
              this.app_service.logout();
            }
          }
        }
      )
    );
  }
}
