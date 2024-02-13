import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';

const TOKEN_KEY = 'ACCESS_TOKEN';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    // protected url = 'https://bcplusnews.com/bcadmin/api/';
    // protected url = 'http://54.165.53.79/bcadmin/api/';
    // protected url = 'http://bcplusnews.lr/api/';
    protected url = 'http://192.168.0.106:8000/api/';

    protected debug = false;
    protected appLanguage;

    constructor(
        private storage: Storage,
        private router: Router,
    ) {

    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // YOU CAN ALSO DO THIS
        // const token = this.authenticationService.getToke()

        return from(this.storage.get(TOKEN_KEY))
            .pipe(
                switchMap(token => {
                    if (token) {
                        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
                    }

                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
                    }

                    // request = request.clone({ headers: request.headers.set('Access-Control-Max-Age', '1000') });
                    // request = request.clone({ headers: request.headers.set('Cache-Control', 'max-age=1000') });


                    from(this.storage.get('BC_PLUS_LANG'))
                        .pipe().subscribe((language) => {
                            // console.log(language);
                            this.appLanguage = language;
                        });

                    if (this.appLanguage) {
                        // console.log(this.appLanguage);
                        request = request.clone({ headers: request.headers.set('Lets-BcNews-Language', this.appLanguage) });
                    }

                    if (request.url.indexOf('i18n') <= 0) {
                        // console.log(request.url, request.url.indexOf('http'));

                        if (this.debug) {
                            request = request.clone({ url: this.url + request.url + '?XDEBUG_SESSION_START=1' });
                        } else {
                            request = request.clone({ url: this.url + request.url });
                        }
                    }
                    return next.handle(request).pipe(
                        map((event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                                // do nothing for now
                                if (event && event.body && event.body.status_code && event.body.status_code == 401) {
                                    this.logout();
                                }
                                // console.log(request);
                                if (request.url.indexOf('i18n') <= 0) {
                                    this.updateAppSettings(event.headers.get('X-Bcnews-Settings'));
                                }
                                // console.log(event.headers.get('X-Bcnews-Settings'));
                            }
                            return event;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            const status = error.status;
                            // console.log('dfdf', error);
                            const reason = error && error.error.reason ? error.error.reason : '';
                            return throwError(error);
                        })
                    );
                })
            );

    }


    logout() {
        this.storage.remove("ACCESS_TOKEN");
        this.storage.remove("BC_PLUS_USER");
        this.router.navigate(['/login']);
    }

    updateAppSettings(timestamp) {
        this.storage.get('BC_SETTINGS_UPDATED').then((value) => {
            console.log(value, timestamp);
            // if (value != timestamp) {
            //     this.storage.remove('BC_APP_SETTINGS');
            //     this.storage.set('BC_SETTINGS_UPDATED', timestamp);
            //     window.location.reload();
            // }
        });
    }

    /* getAppLanguage() {
        return from(this.storage.get('APP_LANG'))
            .pipe().subscribe((language) => {
                // console.log(language);
                this.appLanguage = language;
            });
    } */
}
