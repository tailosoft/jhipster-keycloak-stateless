import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';
import { AuthServerProvider } from 'app/core';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authServer: AuthServerProvider) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request || !request.url || (/^http/.test(request.url) && !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)))) {
            return next.handle(request);
        }

        return this.authServer.getToken().pipe(
            catchError(_ => of(undefined)),
            switchMap(token => {
                if (!!token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: 'Bearer ' + token
                        }
                    });
                }
                return next.handle(request);
            })
        );
    }
}
