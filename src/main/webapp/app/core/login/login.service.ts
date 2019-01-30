import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(private principal: Principal, private authServerProvider: AuthServerProvider) {}

    login() {
        this.authServerProvider.login();
    }

    logout() {
        this.authServerProvider.logout();
    }
}
