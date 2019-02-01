import './vendor.ts';

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { JhipsterSharedModule } from 'app/shared';
import { JhipsterCoreModule } from 'app/core';
import { JhipsterAppRoutingModule } from './app-routing.module';
import { JhipsterHomeModule } from './home/home.module';
import { JhipsterEntityModule } from './entities/entity.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import {
    AuthModule,
    AuthWellKnownEndpoints,
    OidcConfigService,
    OidcSecurityService,
    OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';
import { SERVER_API_URL } from 'app/app.constants';
import { filter, take } from 'rxjs/operators';

const STS_SERVER = 'http://keycloak:9080/auth/realms/jhipster';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_custom_stsServer(`${STS_SERVER}/.well-known/openid-configuration`);
}

@NgModule({
    imports: [
        BrowserModule,
        JhipsterAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        JhipsterSharedModule,
        JhipsterCoreModule,
        JhipsterHomeModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        JhipsterEntityModule,
        AuthModule.forRoot()
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        },
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class JhipsterAppModule {
    constructor(
        private dpConfig: NgbDatepickerConfig,
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService
    ) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
        // remove fragment also as redirectUrl MUST NOT include fragment: https://tools.ietf.org/html/rfc6749#section-3.1.2
        const BASE_PATH = SERVER_API_URL ? SERVER_API_URL : window.location.origin + '/';
        const INITIAL_URL = window.location.href;
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.stsServer = STS_SERVER;
            openIDImplicitFlowConfiguration.redirect_url = BASE_PATH;
            // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
            // identified by the iss (issuer) Claim as an audience.
            // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
            // or if it contains additional audiences not trusted by the Client.
            openIDImplicitFlowConfiguration.client_id = 'web_app';
            openIDImplicitFlowConfiguration.response_type = 'code';
            openIDImplicitFlowConfiguration.scope = 'roles jhipster openid';
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.silent_renew_url = `${BASE_PATH}silent-renew.html`;
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = BASE_PATH;
            openIDImplicitFlowConfiguration.trigger_authorization_result_event = true;
            openIDImplicitFlowConfiguration.log_console_warning_active = true;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
            this.oidcSecurityService
                .getIsModuleSetup()
                .pipe(
                    filter((isModuleSetup: boolean) => isModuleSetup),
                    take(1)
                )
                .subscribe((isModuleSetup: boolean) => {
                    this.oidcSecurityService.authorizedCallbackWithCode(INITIAL_URL);
                });
        });
    }
}
