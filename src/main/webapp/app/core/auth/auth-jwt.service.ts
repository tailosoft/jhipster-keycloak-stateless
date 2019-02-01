import { Injectable } from '@angular/core';

import { map, take, tap } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
    constructor(public oidcSecurityService: OidcSecurityService) {}

    login() {
        this.oidcSecurityService.authorize();
    }

    logout() {
        this.oidcSecurityService.logoff();
    }

    getToken() {
        return this.oidcSecurityService.getIsAuthorized().pipe(
            take(1),
            map(() => this.oidcSecurityService.getToken())
        );
    }
}
