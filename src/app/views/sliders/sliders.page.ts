import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeData } from '@models/business';
import { LoggerService } from '@services/utils';
import { HomeProvider } from '@providers';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppUserService } from '@services/api/app-user.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { CguPage } from '@views/cgu/cgu.page';
import { authentication, tokenAuth } from 'app/auth.service';
import { Capacitor } from '@capacitor/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sliders',
  templateUrl: 'sliders.page.html',
  styleUrls: ['sliders.page.scss']
})

export class SlidersPage implements OnInit, OnDestroy {
  private readonly TAG: string = 'HomePage';
  scrollDepthTriggered = false;
  private authSubscription: Subscription;
  readonly destroyed = new ReplaySubject(1);
  data: HomeData;
  sliders: any;
  slideOpts = {
    speed: 400,
    loop: false,
    autoplay: {
      delay: 200500,
      pauseOnMouseEnter: true,
    },
  };
  webApp: boolean;
  errors: any = [];
  constructor(
    private logger: LoggerService,
    private homePrv: HomeProvider,
    private http: HttpClient,
    private router: Router,
    private userPrv: AppUserService,
    private appUserService: AppUserService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.sliders = [
      {
        img: "assets/icon/sliders/1.svg",
        title: "It’s simple, and quick !",
        description: "In order to continue,you will need  to log-in  ou sign-up if you don’t have an account yet."
      },
    ];

    this.homePrv.data('list').subscribe(
      async (res) => {
        this.logger.log(this.TAG, 'home data', res);
        this.data = res;
      },
      (err) => console.log(''),
    );

    // if(!localStorage.getItem('userEmail') && !localStorage.getItem("logout")){
    //   this.createAccountAuth();
    // } else {
    //   if(!localStorage.getItem('userEmail') && localStorage.getItem("logout")){
    //     localStorage.removeItem("logout")
    //   }
    // }

  }

  ngOnDestroy() {
    console.log("destroy")
    this.authSubscription?.unsubscribe();
    this.authSubscription = undefined;
    // this.destroyed.next();
    this.destroyed.complete();
    this.logger.log(this.TAG, 'destroy');
  }

  ionViewWillLeave() {
    this.authSubscription?.unsubscribe();
    this.authSubscription = undefined;
  }

  page_categorie(categorie) {
    this.router.navigate([
      '/tabs/home/categorie',
      {
        id: categorie.id,
        count_prestations: categorie.count_prestations,
        count_categories: categorie.count_categories,
      },
    ]);
  }

  page_login() {
    this.router.navigate([
      '/login',
    ]);
  }

  page_inscription() {
    this.router.navigate([
      '/register',
    ]);
  }

  page_giveaway(giveaway) {
    this.router.navigate([
      '/tabs/home/giveaway',
      {
        id: giveaway.id,
      },
    ]);
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 10) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }

  profil_page() {
    this.router.navigate(['/app/profil']);
  }

  logChoice(choice) {
  };

  /**
   * toaster message
   * @param message message
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top', // Position: 'top', 'bottom', 'middle'
      color: 'danger', // Optional color: 'primary', 'secondary', 'success', 'warning', 'danger'
    });
    toast.present();
  }

  /**
   * user login information
   * @param userLoginInfo user login info
   */
  userLogin(userLoginInfo) {
    this.userPrv.login(userLoginInfo).subscribe(
      (res) => {

        console.log('userLogin', res);
        if (res && res.token) {

          this.loadingController.dismiss();
          this.router.navigate(['']);

        }
      },
      (err) => {

        console.log('err: ', err);
        this.loadingController.dismiss();
      },
    );
  }

  async cgu_page() {
    // return false;
    // if (this.webApp) {
    //   //window.open(environment.webBaseUrl+'./politiques', '_blank');
    // } else {

    //   const modal = await this.modalCtrl.create({
    //     component: CguPage,
    //     cssClass: 'my-custom-class',
    //     componentProps: {},
    //   });
    //   await modal.present();
    //   await modal.onDidDismiss().then((result) => {
    //     if (result.data?.dismiss) {
    //     }
    //   });
    // }

  }

  async createAccountAuth() {
    let tempSubs: any = {};
    tempSubs = null;
    //Auth0
    const platform = Capacitor.getPlatform()
    if (platform === "web") {
      await this.auth?.loginWithPopup().subscribe(async (popupResponse) => {
        console.log('popupResponse: ', popupResponse);
      }, (error) => {
        loading.dismiss();
        console.error(error);
      });
    } else {
      this.auth
        .loginWithRedirect({
          async openUrl(url: string) {
            return Browser.open({ url, windowName: '_self' });
          }
        }).subscribe(res => {
          console.log("ressss", res)
        }, (error) => {
          console.log('error: ', error);

        });
    }


    let email = ''
    let authUser: any = {};
    console.log('authUser: ', authUser);
    tempSubs = await this.auth.user$;
    const loading = await this.loadingController.create({
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
    });
    console.log('tempSubs: ', tempSubs);
    this.auth.idTokenClaims$.subscribe(res => {
      localStorage.setItem("authToken", res.__raw)
    });
    const accessToken = localStorage.getItem("authToken");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken ? accessToken : authentication.accessToken}`
      //     'Authorization': `Bearer ${accessToken !== tokenAuth ? tokenAuth : accessToken}`
    });
    if (tempSubs) {
      console.log("1")
      await loading.present();
      this.authSubscription = tempSubs.pipe(takeUntil(this.destroyed)).subscribe(async (user) => {
        if (user) {
          console.log("2")

          const loading2 = await this.loadingController.create({
            spinner: 'circular',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: false,
          });

          await loading2.present();
          console.log('user:  user__Run', user);
          authUser = user;
          if (Object.keys(authUser).length) {
            email = authUser.email; console.log("3")


            const params = new HttpParams().set('q', `email:"${authUser.email}"`).set('search_engine', 'v3');

            this.http.get(authentication.apiUrlForUsers, { headers, params }).pipe(takeUntil(this.destroyed)).subscribe(
              (response: any[]) => {
                if (response.length > 1) {
                  console.log("4")

                  const value: any = this.http.delete(`${authentication.apiUrlForUsers}/${user.sub}`, { headers });
                  value.subscribe((data) => {
                    this.presentToast('Account with same email already exists');
                    delete window.localStorage['authUserId'];
                    delete window.localStorage['userEmail'];
                    loading.dismiss();
                    this.auth.logout();
                    this.appUserService.logout();
                  }, (err) => {
                    console.log("5")

                    console.log('err: ', err);
                    loading2.dismiss();
                  });
                }
                else {
                  console.log("6")

                  this.userPrv.emailExist(email).pipe(takeUntil(this.destroyed)).subscribe(
                    (res) => {
                      console.log("7")

                      let usernamePart = authUser.nickname.slice(0, 3);
                      let emailPart = authUser.email.slice(0, 3);
                      let password = `${usernamePart}${emailPart}`;
                      // user auth0 info set to local storage
                      window.localStorage[`authUserId`] = authUser.sub;
                      window.localStorage[`userEmail`] = authUser.email;
                      if (res.message === 'Exist') {
                        console.log("8")

                        const userLoginInfo = {
                          email: email,
                          password: password,
                          deviceType: '',
                        }
                        this.userLogin(userLoginInfo);
                        loading.dismiss();
                      }
                      else {
                        console.log("9")

                        const signUpData = {
                          email: email,
                          firstName: "",
                          lastName: authUser.nickname,
                          password: password,
                          provider: 'false',
                          passwordC: '',
                        }
                        this.userPrv.signup(signUpData).pipe(takeUntil(this.destroyed)).subscribe(
                          (res) => {
                            console.log("10")

                            this.logger.log(this.TAG, 'Signup Page', res);
                            if (res.success) {
                              const userLoginInfo = {
                                email: email,
                                password: password,
                                deviceType: '',
                              }
                              this.userLogin(userLoginInfo);
                              loading2.dismiss();
                            }
                          },
                          (err) => {
                            console.log("11")

                            console.log('err: ', err);
                            loading2.dismiss();
                          },
                        );
                      }
                    },
                    (err) => {
                      console.log("12")

                      loading2.dismiss();
                      console.log(err + '___');
                      loading2.dismiss();
                    });

                }
              },
              (error) => {
                console.log("13")

                console.error(error);
                loading2.dismiss();
              });
          }
        }
        else {
          loading.dismiss()

        }
      });
    }
    else {
      loading.dismiss()
    }
  }

  /**
   * remove users lessons records from the Local Stoarge
   */
  //  getAllKeysFromLocalStorage() {
  //   for (let i = 0; i < localStorage.length; i++) {
  //     if(localStorage.key(i).includes("hiragana_")  ){
  //       localStorage.removeItem(localStorage.key(i))
  //     }
  //     else if(localStorage.key(i).includes("katakana_")){
  //       localStorage.removeItem(localStorage.key(i))
  //     }
  //   }
  // }

}
