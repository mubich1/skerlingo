import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../services/api/app-user.service';
import { LoadingController, AlertController, ToastController, NavController } from '@ionic/angular';
import { LoggerService } from '@services/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

import { Profile } from '@models/users';
import { HomeProvider } from '@providers';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.page.html',
  styleUrls: ['./compte.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})
export class ComptePage implements OnInit {
  _currentProfile: Profile = {
    id: null,
    nomComplet: null,
    nom: null,
    prenom: null,
    email: null,
    tel: null,
    //pays_id: null,
    //pays_label: null,
    image_url: null,
    photo: null
  };

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  // TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Morocco, CountryISO.France];

  public compteForm: FormGroup;
  isSubmited: boolean = false;
  snapshot: any;
  snapshot_id: any;
  pays: any;

  croppedImagepath = '';
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  private readonly TAG: string = 'ComptePage';

  constructor(
    private logger: LoggerService,
    private userPrv: AppUserService,
    private homePrv: HomeProvider,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private nav: NavController,
    private file: File,
    private router: Router,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
  ) {
    this.compteForm = formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      pays_id: ['', Validators.required],
      tel: ['', Validators.nullValidator],
      image: ['', Validators.nullValidator],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() {

    this.homePrv.pays().subscribe(
      async (res) => {
        this.logger.log(this.TAG, 'home data', res);
        this.pays = res;

        this.userPrv.currentProfile.subscribe((data) => {
          this._currentProfile = data;
          this.croppedImagepath = this._currentProfile.image_url;
          //this._currentProfile.pays_id = data.pays_id;
        });

      },
      (err) => console.log(JSON.stringify(err)),
    );

    //this.userPrv.init();
  }

  async update() {
    if (this.compteForm.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 3000,
      });
      await loading.present();
      this.userPrv.update(this.compteForm.value).subscribe(
        (res) => {
          this.logger.log(this.TAG, 'Update profile Page', res);
          if (res.success) {
            this.router.navigate(['/tabs']);
          } else {
            this.alertError(res);
          }
        },
        (err) => console.log(err + '___'),
      );
    }
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 400,
      targetHeight: 400,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        this.croppedImagepath = 'data:image/jpeg;base64,' + imageData;
        this.compteForm.value.image = this.croppedImagepath;
      },
      (err) => {
        // Handle error
      },
    );
  }

  uploadImage() {
    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  async alertError(res) {
    const errors = Object.values(res.errors);
    const toast = await this.toastController.create({
      position: 'top',
      message: errors.join(', '),
      duration: 2000,
    });
    toast.present();
  }

  page_login() {
    this.router.navigate([
      '/tabs/profil/login',
      {
        snapshot: this.snapshot && this.snapshot !== 'null' ? this.snapshot : null,
      },
    ]);
  }


  logOut() {
    this.userPrv.logout();
    this.nav.navigateRoot('/tabs');
  }
}
