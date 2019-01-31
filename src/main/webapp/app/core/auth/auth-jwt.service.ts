import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { KEYCLOAK_URL } from 'app/app.constants';

import * as Keycloak from 'keycloak-js';
import { shareReplay, switchMap, map, tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
    // TODO this code uses keycloak js adapter which:
    // 1- should be changed since incpmatible with OKTA
    // 2- doesn't share refresh token between multiple tabs (bad)
    // 3- detects logout using iframe (good)
    // 4- is now using the standard flow instead hybrid (bad)
    private keycloak: Keycloak.KeycloakInstance;

    initialized$: Observable<boolean>;

    constructor(private http: HttpClient, private localStrorage: LocalStorageService, private sessionStorage: SessionStorageService) {
        this.keycloak = Keycloak({ url: KEYCLOAK_URL, realm: 'jhipster', clientId: 'web_app' });
        this.initialized$ = from(this.keycloak.init({ flow: 'hybrid', promiseType: 'native' })).pipe(
            tap(x => console.log('keycloak init called: ', x)),
            shareReplay(1)
        );
        // eager keycloak init
        this.initialized$.subscribe();
    }

    getToken(): Observable<string> {
        return this.initialized$.pipe(
            // when using the hybrid flow and trying to retrieve the access token before the refresh token is received
            // updateToken fails since the refresh token is not already there
            // we should in this case still try to use existing token
            // worst case scenario there is none or it expired and we'll receive a 403
            // we therefore catch the error and do nothing
            // to summarize: we try it get a new token and if it fails we use an old one
            switchMap(_ => from(this.keycloak.updateToken(5)).pipe(catchError(() => of(undefined)))),
            map(_ => this.keycloak.token)
        );
    }

    login(): void {
        const redirectUri = location.href;
        const scope = 'roles jhipster openid';
        this.keycloak.login({ redirectUri, scope });
    }

    logout() {
        this.keycloak.logout();
    }
}
