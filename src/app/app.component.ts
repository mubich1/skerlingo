import { Component, NgZone, ViewChild ,OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Platform, ModalController, AlertController, IonRouterOutlet, NavController, isPlatform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Browser } from '@capacitor/browser';
import { AppUserService } from './services/api/app-user.service';
import { UpdatePage } from '@views/update/update.page';
import { Profile } from '@models/users';
import { callbackUri } from './auth.service';
import { LoggerService, SmartlookService } from '@services/utils';
import { AuthService } from '@auth0/auth0-angular';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  private readonly TAG: string = 'AppComponent';
  _currentProfile: Profile;
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private appVersion: AppVersion,
    private nav: NavController,
    public alertController: AlertController,
    private logger: LoggerService,
    private router: Router,
    private modalCtrl: ModalController,
    private appUserService: AppUserService,
    private fcm: FCM,
    private smartlookService: SmartlookService,
    private ngZone: NgZone,
    public auth: AuthService,
  ) {
    this.initializeApp();
    // run smartlook
    this.smartlookService.runSmartlook();
  }

  initializeApp() {
    SplashScreen.show();
    this.appUserService.init();
    this.appUserService.currentProfile.subscribe((data) => {
      this._currentProfile = data;
    });
    this.platform.ready().then(() => {

      SplashScreen.hide();
      this.initilizeAdMob();

      // get FCM token
      this.fcm.getToken().then((token) => {
        console.log(token);
        this.appUserService.fcm_token({ token: token }).subscribe((data) => {
          console.log(data);
        });
      });

      this.appVersion.getVersionNumber().then((versionNumber) => {
        this.appUserService.check_version({ version: versionNumber }).subscribe((data) => {
          console.log(data);
          if (data.failed) {
            setTimeout(async () => {
              const modal = await this.modalCtrl.create({
                component: UpdatePage,
                cssClass: 'my-custom-class',
                componentProps: {
                  data: data,
                },
              });
              await modal.present();
              await modal.onDidDismiss().then((result) => {
                if (result.data?.done) {
                }
              });
            }, 3000);
          }
        });
      });

      // ionic push notification example
      this.fcm.onNotification().subscribe(async (data) => {
        if (data.wasTapped) {
          console.log('Received in background');
        } else {
          console.log('Received in foreground');
        }

        const alert = await this.alertController.create({
          cssClass: 'chic-choc-alert',
          header: data.title,
          message: data.body,
          buttons: [
            {
              text: 'Fermer',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              },
            },
          ],
        });

        await alert.present();
      }, (err) => console.log(JSON.stringify(err)));

      // refresh the FCM token
      this.fcm.onTokenRefresh().subscribe((token) => {
        console.log(token);
      }, (err) => console.log(JSON.stringify(err)));

      // unsubscribe from a topic
      // this.fcm.unsubscribeFromTopic('offers');
    });

    // if(!localStorage.getItem('userEmail')){
    //   this.router.navigate(['/sliders'])
    // }



  }

  ngOnInit() {
    //this.fixBackToQuit();

    this.auth.idTokenClaims$.subscribe(res => {
      console.log('res tiken response: ', res);
      if (res) {
        localStorage.setItem("authToken", res.__raw)
      }
    });
    App.addListener('appUrlOpen', ({ url }) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      this.ngZone.run(() => {
        if (url?.startsWith(callbackUri)) {
          if (
            url.includes('state=') &&
            (url.includes('error=') || url.includes('code='))
          ) {
            this.auth
              .handleRedirectCallback(url)
              .pipe(mergeMap(() => {
                return Browser.close()
              }))
              .subscribe(
              );
          } else {
            Browser.close();
          }
        }
      });
    });
  }

  private fixBackToQuit() {
    this.logger.log(this.TAG, 'on start check if can go back', this.routerOutlet.canGoBack());

    this.platform.backButton.subscribeWithPriority(-1, (next) => {
      this.logger.log(this.TAG, 'back button from', this.router.url);
      if (!this.routerOutlet.canGoBack()) {
        const url = this.router.url;
        if (url.startsWith('/tabs/') || url.startsWith('/tabs')) {
          this.logger.log(this.TAG, 'back button action quit');
          navigator['app'].exitApp();
        } else {
          this.logger.log(this.TAG, 'back button action go home');
          this.nav.navigateRoot('');
        }
      }

      next();
    });
  }

  async initilizeAdMob(){
    const {status} = await AdMob.trackingAuthorizationStatus()
    console.log('status: ', status);
    AdMob.initialize()      
  }

  logOut() {
    this.appUserService.logout();
    this.router.navigate(['/tabs/home']);
  }

  ngOnDestroy() {
    console.log("destroy APPP")

  }
}
