import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Smartlook } from '@awesome-cordova-plugins/smartlook/ngx';
import { authentication } from 'app/auth.service';

@Injectable({
    providedIn: 'root',
})

export class SmartlookService {
    constructor(
        private readonly smartlook: Smartlook,
        private readonly http: HttpClient) {
    }

    runSmartlook() {
        this.smartlook.setProjectKey({ key: authentication.smartLookSecretKey });
        this.smartlook.start();
        this.smartlook.trackNavigationEnter({ eventName: "test tracking" })
        this.smartlook.openNewSession()

        const sessionUrl = this.smartlook.getSessionUrl().then(res => {
            console.log('sessionUrl: ', res);
        })

        const sessionUrlWithTimestamp = this.smartlook.getSessionUrlWithTimestamp().then(res => {
            console.log('sessionUrlWithTimestamp: ', res);
        })
        let rec = this.smartlook.isRecording().then(res => {
            console.log('res: ', res);
        })

        setTimeout(() => { this.smartlook.stop() }, 0);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authentication.smartlookAuthToken}`,
                'cache-control': 'no-cache'
            })
        };

        this.http.get('https://api.eu.smartlook.cloud/api/v1/events', httpOptions).subscribe((x) => {
            console.log("x", x)
        })
    }

}