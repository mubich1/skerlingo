import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../services/api/app-user.service';
import { LoadingController, AlertController, ToastController, NavController, PopoverController } from '@ionic/angular';
import { LoggerService } from '@services/utils';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})

export class PasswordPage implements OnInit {
  public passwordForm: FormGroup;
  isSubmited: boolean = false;
  stepView: String = 'first';
  message: any;
  snapshot: any;
  snapshot_id: any;
  webApp: boolean;
  errors: any = [];
  popovered: any;

  private readonly TAG: string = 'PasswordPage';

  constructor(
    private logger: LoggerService,
    private userPrv: AppUserService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private appUserService: AppUserService,
    private router: Router,
    private popoverCtrl: PopoverController,
    public toastController: ToastController,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    private nav: NavController,
  ) {

    this.appUserService.currentisWebApp.subscribe((data) => {
      this.webApp = data;
    });

    this.passwordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.snapshot = params.snapshot as string;
      this.snapshot_id = params.snapshot_id as string;
    });
  }

  async onSignIn() {
    if (this.passwordForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'circular',
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: false,
      });
      await loading.present();
      this.userPrv.forgot_password(this.passwordForm.value.email).subscribe(
        (res) => {
          this.logger.log(this.TAG, 'Signup Page', res);
          loading.dismiss();
          this.passwordForm.reset();
          if (res.success) {
            this.message = res.message;
            this.stepView = 'success';
          } else {
            this.alertError(res.message);
          }
        },
        (err) => {
          loading.dismiss();
          console.log(err + '___');
        },
      );
    } else {
      this.errors = [];
      if (!this.passwordForm.value.terms)
        this.errors.push('terms');
      Object.keys(this.passwordForm.controls).forEach((key) => {
        if (!this.passwordForm.controls[key].valid && !this.passwordForm.controls[key].disabled) this.errors.push(key);
      });
    }
  }

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  ionViewWillLeave() {
    console.log('yes leaveeeee');
    let rString = this.randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    let paramsSnap = {};
    paramsSnap = {
      return: rString,
    };
    this.router.navigate(['/tabs/home', paramsSnap]);
  }

  async alertDone(res) {
    const alert = await this.alertController.create({
      cssClass: 'skerlingo-alert', mode: "md",
      header: res.title,
      message: res.message,
      buttons: ['Fermer'],
    });

    await alert.present();
  }

  async alertError(message) {
    const toast = await this.toastController.create({
      position: 'top',
      cssClass: 'toast-error',
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  page_register() {
    this.router.navigate([
      '/app/profil/register',
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

  async page_login() {

    this.popoverCtrl.dismiss({
      dismiss: true
    });

  }


  dismissForm() {
    this.popoverCtrl.dismiss({
      dismiss: true
    });
  }

  onClickYes() {
    this.stepView = 'success';
  }

  async copyMail() {
    navigator.clipboard.writeText('fathioussama@gmail.com');
    const toast = await this.toastController.create({
      position: 'bottom',
      cssClass: 'toast-error',
      message: 'Copied',
      duration: 1000,
    });
    toast.present();
  }

  ondissmiss() {
    this.nav.navigateRoot('/sliders');
  }


}