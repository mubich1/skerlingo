import { NgModule, ChangeDetectorRef } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IOSFilePicker } from "@ionic-native/file-picker/ngx";
import { Base64 } from '@ionic-native/base64/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Media } from '@ionic-native/media/ngx';


import { MomentModule } from 'angular2-moment';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';

// FCM
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { CountdownModule, CountdownComponent, CountdownGlobalConfig, CountdownTimer } from 'ngx-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { callbackUri, clientId, domain } from './auth.service';
import { Smartlook } from '@awesome-cordova-plugins/smartlook/ngx';
import { AuthConfig, AuthModule } from '@auth0/auth0-angular';


const config: AuthConfig = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: callbackUri,
  }
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CountdownModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    MomentModule,
    HammerModule,
    AppRoutingModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    AuthModule.forRoot(config),
  ],
  providers: [
    Smartlook,
    Camera,
    Facebook,
    GooglePlus,
    SignInWithApple,
    File,
    FileChooser,
    IOSFilePicker,
    Base64,
    Downloader,
    NativeAudio,
    Media,
    CountdownComponent,
    AppVersion,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }