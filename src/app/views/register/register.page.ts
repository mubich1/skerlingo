import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AppUserService } from '../../services/api/app-user.service';
import {
  LoadingController,
  AlertController,
  ToastController,
  ModalController,
  NavController,
  PopoverController,
  Platform,
} from '@ionic/angular';
import { LoggerService } from '@services/utils';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { OauthCordova } from "ng2-cordova-oauth/platform/cordova";
import { LinkedIn } from "ng2-cordova-oauth/core";
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { environment } from "../../../environments/environment";
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { CguPage } from '@views/cgu/cgu.page';
import { HomeProvider } from '@providers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  //encapsulation: ViewEncapsulation.None, // added
})
export class RegisterPage implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  // TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Morocco, CountryISO.France];

  public registerForm: FormGroup;
  public registerFormRecruteur: FormGroup;
  isSubmited: boolean = false;
  formType: Number;
  stepView: String = 'second';
  prevStepView: String = '';
  snapshot: any;
  snapshot_id: any;
  message: any;
  errors: any = [];

  webApp: boolean;

  private readonly TAG: string = 'RegisterPage';

  pwdIcon = 'eye-outline';
  showPwd = false;

  linkedinClientId: string;
  linkedinRedirectUri: string;

  popovered: any;

  authorizationCode: string;
  oAuthToken: string;
  oAuthVerifier: string;
  // popup related
  private windowHandle: Window;   // reference to the window object we will create
  private intervalId: any = null;  // For setting interval time between we check for authorization code or token
  private loopCount = 6000;   // the count until which the check will be done, or after window be closed automatically.
  private intervalLength = 100;   // the gap in which the check will be done for code.

  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    title_h4: {
      fr: 'J\'apprends',
      en: 'Lessons'
    },
    order_trait: {
      fr: 'Ordre de trait',
      en: 'Stroke order'
    },
    feedback: {
      fr: 'Donnez votre avis sur cette carte',
      en: 'Give a comment on this card'
    },
  };


  constructor(
    private logger: LoggerService,
    private userPrv: AppUserService,
    public platform: Platform,
    public toastController: ToastController,
    private googlePlus: GooglePlus,
    public signInWithApple: SignInWithApple,
    private fb: Facebook,
    private homePrv: HomeProvider,
    private popoverCtrl: PopoverController,
    private nav: NavController,
    public formBuilder: FormBuilder,
    private router: Router,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private appUserService: AppUserService,
    public loadingController: LoadingController,
  ) {

    this.registerForm = formBuilder.group({
      provider: [false, Validators.nullValidator],
      terms: [false, Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.nullValidator],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        [Validators.required],
      ],
    });

    this.registerFormRecruteur = formBuilder.group({
      terms: [false, Validators.required],
      fullname: ['', Validators.required],
      phone: ['', Validators.required],
      companyname: ['', Validators.required],
      description: ['', Validators.required],
      mail: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.fb
      .isDataAccessExpired()
      .then((res: any) => {
        this.fb.logout();
      })
      .catch((e) => {
      });
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.snapshot = params.snapshot as string;
      this.snapshot_id = params.snapshot_id as string;
    });
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? 'eye-off-outline' : 'eye-outline';
  }

  dismissForm() {
    this.popoverCtrl.dismiss({
      dismiss: true,
    });
  }

  async onSignUp() {
    if (this.registerForm.valid && this.registerForm.value.terms) {
      const loading = await this.loadingController.create({
        spinner: 'circular',
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: false,
      });
      await loading.present();
      this.userPrv.signup(this.registerForm.getRawValue()).subscribe(
        (res) => {
          this.logger.log(this.TAG, 'Signup Page', res);
          loading.dismiss();
          if (res.success) {
            this.registerForm.reset();
            let paramsSnap = {};
            if (this.snapshot && this.snapshot !== 'null') {
              paramsSnap = {
                id: this.snapshot_id,
              };
            }
            this.router.navigate([
              this.snapshot && this.snapshot !== 'null' ? this.snapshot : '/tabs/home',
              paramsSnap,
            ]);
          } else {
            this.alertError(res);
          }
        },
        (err) => {
          loading.dismiss();
        },
      );
    } else {
      this.errors = [];
      if (!this.registerForm.value.terms)
        this.errors.push('terms');
      Object.keys(this.registerForm.controls).forEach((key) => {
        if (!this.registerForm.controls[key].valid && !this.registerForm.controls[key].disabled) this.errors.push(key);
      });
    }
  }

  async check_provider(data) {
    const loading = await this.loadingController.create({
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
    });
    await loading.present();
    this.userPrv.check_provider(data).subscribe(
      (res) => {
        this.logger.log(this.TAG, 'Signup Page', res);
        loading.dismiss();
        if (res.success && res.user) {
          this.nav.navigateRoot('/tabs/home');
          if (this.popovered)
            this.popoverCtrl.dismiss({
              dismiss: true,
            });
        } else if (res.success) {
          this.registerForm.controls['email'].disable();
          this.registerForm.get('firstName').setValue(data.firstName);
          this.registerForm.get('lastName').setValue(data.lastName);
          this.registerForm.get('email').setValue(data.email);
          this.registerForm.get('provider').setValue(data.provider);

          this.change_view('third');
        } else {
          loading.dismiss();
          this.alertError(res);
        }
      },
      (err) => {
        loading.dismiss();
      },
    );
  }

  register_apple() {

    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
      .then((res: AppleSignInResponse) => {
        if (res.email)
          this.check_provider({ email: res.email, provider: 'google', lastName: res.fullName.familyName, firstName: res.fullName.givenName });
        else
          this.change_view('third');
      })
      .catch((error: AppleSignInErrorResponse) => {
        this.change_view('third');
      });
  }

  register_gp() {

    return false;
    this.googlePlus
      .login({})
      .then((res) => {
        this.googlePlus.logout();
        this.check_provider({
          email: res.email,
          provider: 'google',
          lastName: res.familyName,
          firstName: res.givenName,
        });
      })
      .catch((e) => {
        this.googlePlus.logout();
      });
  }

  doAuthorization(url?: string, socialMediaProvider?: string, isRegisterAction?: boolean) {
    /* isRegisterAction flag i am using to check if the process is for registration or Login */
    /* socialMediaProvider is for name of social media , it is optional*/

    let loopCount = this.loopCount;

    /* Create the window object by passing url and optional window title */
    this.windowHandle = this.createOauthWindow("https://www.linkedin.com/oauth/v2/authorization?response_type=code&scope=r_emailaddress,r_liteprofile&client_id=" + this.linkedinClientId + "&redirect_uri=" + this.linkedinRedirectUri, 'OAuth login');

    /* Now start the timer for which the window will stay, and after time over window will be closed */
    this.intervalId = window.setInterval(() => {
      if (loopCount-- < 0) {
        window.clearInterval(this.intervalId);
        this.windowHandle.close();
      } else {
        let href: string;  // For referencing window url
        try {
          href = this.windowHandle.location.href; // set window location to href string
        } catch (e) {
        }

        if (href != null) {
          if (href && (href).indexOf(this.linkedinRedirectUri) === 0 && href.match('code')) {
            // for google , fb, github, linkedin
            loopCount = -1;
            window.clearInterval(this.intervalId);
            this.authorizationCode = this.getQueryString('code', href);
            //this.register_ln_process(this.authorizationCode, this.linkedinRedirectUri);
            this.windowHandle.close();
          }
        }
      }
    }, this.intervalLength);
  }

  // Method for getting query parameters from query string
  getQueryString = function (field: any, url: string) {
    const windowLocationUrl = url;
    const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    const string = reg.exec(windowLocationUrl);
    return string ? string[1] : null;
  }

  createOauthWindow(url: string, name = 'Authorization', width = 500, height = 600, left = 0, top = 0) {
    if (url == null) {
      return null;
    }
    const options = `width=${width},height=${height},left=${left},top=${top}`;
    return window.open(url, name, options);
  }

  register_fb() {

    return false;

    this.fb
      .login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api('me?fields=id,name,email,first_name,last_name', []).then((profile) => {
          this.fb.logout();
          this.check_provider({
            email: profile['email'],
            provider: 'facebook',
            lastName: profile['last_name'],
            firstName: profile['first_name'],
          });
        });
      })
      .catch((e) => {
        this.fb.logout();
      });
  }

  async alertError(res) {
    const errors = res.message;
    const toast = await this.toastController.create({
      position: 'top',
      cssClass: 'toast-error',
      message: errors,
      duration: 2000,
    });
    toast.present();
  }

  page_login() {
    this.router.navigate([
      '/app/profil/login',
      {
        snapshot: this.snapshot && this.snapshot !== 'null' ? this.snapshot : null,
      },
    ]);
  }

  open_gmail() {
    window.location.href = 'mailto:';
    if (!this.webApp) {
      this.nav.navigateRoot('/sliders');
    }
  }

  type_form(type) {
    this.formType = type;
  }

  public onKeyUpTel(event: any) {
    if (this.registerFormRecruteur.get('phone').value)
      this.registerFormRecruteur.get('phone').setValue(this.registerFormRecruteur.get('phone').value.replace(new RegExp("[^0-9.]", 'g'), ''));
  }

  change_view(step = null) {
    if (!step) {
      this.stepView = this.prevStepView;
      if (this.stepView == 'third')
        this.prevStepView = 'second';
      else
        this.prevStepView = null;
    } else {

      if (step == 'second') {
        // || !this.registerForm.value.terms
        if (!this.formType) return false;
      }

      this.prevStepView = step != 'success' ? this.stepView : null;
      this.stepView = step;
    }
  }

  async cgu_page() {
    return false;
    if (this.webApp) {
      //window.open(environment.webBaseUrl+'./politiques', '_blank');
    } else {

      const modal = await this.modalCtrl.create({
        component: CguPage,
        cssClass: 'my-custom-class',
        componentProps: {},
      });
      await modal.present();
      await modal.onDidDismiss().then((result) => {
        if (result.data?.dismiss) {
        }
      });
    }

  }

  matchValues(
    matchTo: string, // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value && control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }
}