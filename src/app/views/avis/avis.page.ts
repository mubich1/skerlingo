import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, LoadingController, AlertController, ToastController, NavController, PopoverController } from '@ionic/angular';
import { LoggerService } from '@services/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-avis',
  templateUrl: './avis.page.html',
  styleUrls: ['./avis.page.scss'],
})
export class AvisPage implements OnInit {
  public loginForm: FormGroup;
  isSubmited: boolean = false;
  snapshot: any;
  snapshot_id: any;
  @Input() avis_infos: any;

  private readonly TAG: string = 'LoginPage';

  pwdIcon = "eye-outline";
  showPwd = false;

  popovered: any;
  id_like: any;
  code: any;

  public avisForm: FormGroup;
  errors: any = [];

  currentLang = window.localStorage['appLang'] ?  window.localStorage['appLang'] : 'en';
  dataText = {
    title_h4 : {
      fr: 'Donnez votre avis sur cette carte!',
      en: 'What do you think about this card?'
    },
    description : {
      fr: 'Cette carte était-elle utile pour vous? pas utile? donnez-nous votre avis sur le champs ci-dessous !',
      en: 'Was it helpful for you? It wasn’t useful? There was something you didn’t understand?'
    },
    commentaire : {
      fr: 'Ecrivez votre avis ici ...',
      en: 'Write your opinion here ...'
    },
    btn : {
      fr: 'Envoyer',
      en: 'Send'
    },
  };

  constructor(
    private logger: LoggerService,
    public formBuilder: FormBuilder,
    public platform: Platform,
    private router: Router,
    public toastController: ToastController,
    private nav: NavController,
    private popoverCtrl: PopoverController,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
  ) {

    this.avisForm = formBuilder.group({
      id_like: ['', Validators.required],
      code: ['', Validators.nullValidator],
      title: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      duree: ['', Validators.required],
      description: ['', Validators.nullValidator],
    });

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.snapshot = params.snapshot as string;
      this.snapshot_id = params.snapshot_id as string;
    });
  }


  async saveForm() {

    this.avisForm.controls['id_like'].setValue(this.id_like);
    this.avisForm.controls['code'].setValue(this.code);

    this.errors = [];
    Object.keys(this.avisForm.controls).forEach(key => {
      if(!this.avisForm.controls[key].valid && !this.avisForm.controls[key].disabled)
        this.errors.push(key);
    });

    if (this.errors.length == 0) {

      const loading = await this.loadingController.create({
        spinner: 'circular',
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: false
      });

      await loading.present();

      /*
      this.chatPrv.save_meeting(this.avisForm.value).subscribe(
        (res) => {
          this.popoverCtrl.dismiss({
            success: true
          });
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.router.navigate(['/app/mon-profil']);
        },
      );
      */
    }

  }

  event_date(event) {
    if (false) {
      this.avisForm.controls['date'].setValue(event.detail.value);
    } else {
      const formattedDate = formatDate(event.detail.value, 'yyyy-MM-dd', 'en-US');
      this.avisForm.controls['date'].setValue(formattedDate);
    }
  }


  event_heure(event) {
    if (false) {
      this.avisForm.controls['heure'].setValue(event.detail.value);
    } else {
      const formattedDate = formatDate(event.detail.value, 'HH:mm', 'en-US');
      this.avisForm.controls['heure'].setValue(formattedDate);
    }
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }

  dismissForm() {
    this.popoverCtrl.dismiss({
      dismiss: true
    });
  }

  ionViewWillLeave() {
    this.popoverCtrl.dismiss({
      dismiss: true
    });
  }

}
