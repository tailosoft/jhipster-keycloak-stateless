import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthServerProvider } from 'app/core';

@Component({
    selector: 'jhi-docs',
    templateUrl: './docs.component.html'
})
export class JhiDocsComponent implements OnInit {
    @ViewChild('swaggerIframe')
    iframe: ElementRef;

    constructor(private authServerProvider: AuthServerProvider) {}

    ngOnInit() {
        this.iframe.nativeElement.contentWindow.refreshToken = () => this.refreshToken();
    }

    // TODO this is just for my tests, swagger should supported in a better way, there is a way with newe swagger 3.0
    refreshToken() {
        this.authServerProvider.getToken().subscribe(token => {
            this.iframe.nativeElement.contentWindow.authToken = token;
        });
    }
}
