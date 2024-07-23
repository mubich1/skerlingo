import { Component, OnInit, OnDestroy, ViewEncapsulation, NgZone } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AppReservationStorage } from '@services/security';
import { LoggerService } from '@services/utils';
import { DemandesProvider, ProfilProvider } from '@providers';
import { ApiReservation } from '@models/security';

import * as moment from 'moment';

import { async } from '@angular/core/testing';
import { AppUserService } from '@services/api/app-user.service';
import { DemandesData, EtapeData, EtapesData } from '@models/business';

import { IOSFilePicker } from "@ionic-native/file-picker/ngx";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { Downloader, DownloadRequest } from '@ionic-native/downloader/ngx';

@Component({
  selector: 'app-etape',
  templateUrl: 'etape.page.html',
  styleUrls: ['etape.page.scss'],
})

//  implements OnInit, OnDestroy
export class EtapePage {
  private readonly TAG: string = 'EncoursPage';

  scrollDepthTriggered = false;
  id: any;
  alias: any;
  title: any;
  no_data_title: any;
  no_data_description: any;
  data: EtapeData;
  user: any;
  message: any;
  demande_service: any;
  files: any[] = [];

  segmentModel = 'messages';

  constructor(
    private logger: LoggerService,
    private demandesPrv: DemandesProvider,
    private reservationStrg: AppReservationStorage,
    private appUserService: AppUserService,
    private modalCtrl: ModalController,
    private downloader: Downloader,
    private router: Router,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private file : File,
    private base64: Base64,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker,
    private _ngZone: NgZone,
    private platform: Platform,
  ) {
    
    this.user = this.appUserService.getUser();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        if(this.router.getCurrentNavigation().extras.state.id)
          this.id= this.router.getCurrentNavigation().extras.state.id;

        if(this.router.getCurrentNavigation().extras.state.service)
          this.demande_service= true;
          

        this.title= this.router.getCurrentNavigation().extras.state.title;
      }
    });

  }

  // ngOnInit
  ionViewWillEnter() {

    this.logger.log(this.TAG, 'init');

    if(!this.id){
      this.router.navigate(['/tabs/demandes']);
    }

    this.demandesPrv.etape(this.id).subscribe(
      (res) => {
        this.logger.log(this.TAG, 'profil data', res);
        this.data = res;
      },
      (err) => {
        //this.router.navigate(['/tabs/profil/login']);
        console.log(JSON.stringify(err));
      },
    );
  }

  async sendMessage() {
    if(!this.message)
      return false;

    const loading = await this.loadingController.create({
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false
    });

    await loading.present();

    this.demandesPrv.send_message({files: this.files, message: this.message, etape_id: this.data.etape.id }).subscribe(
      (res) => {
        this.message = null;
        this.files = [];
        this.ionViewWillEnter();
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        console.log(JSON.stringify(err))
      },
    );
  }
  
  refresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }

  locationPicked(value) {
    console.log('test', value)
  }

  segmentChanged(event) {
    //this.keywords.selected
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  onTypeEmitted(type) {
    // do something with 'type'
    console.log(type);
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 0) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }

  etape_page(id, title = null) {
    if(!this.alias){
      let navigationExtras: NavigationExtras = { state: { id_offer: id, alias: this.alias, title: title } };
      this.router.navigate(['/tabs/home_recru/candidats'], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = { state: { id: id, alias: this.alias, title: this.title } };
      this.router.navigate(['/tabs/encours/demande'], navigationExtras);
    }
  }

  getFileName(file){
    return file.substring(file.lastIndexOf('/')+1, file.length);
  }
  

  downloadFile(file) {
    
    let fileName = file.substring(file.lastIndexOf('/')+1, file.length);

    console.log(fileName);

    var request: DownloadRequest = {
        uri: file,
        title: fileName,
        description: '',
        mimeType: '',
        visibleInDownloadsUi: true,
        notificationVisibility: 1,
        destinationInExternalPublicDir: {
            dirType: 'Download',
            subPath: fileName
        }
    };

    this.downloader.download(request)
    .then((location: string) => console.log('File downloaded at:'+location))
    .catch((error: any) => console.log(JSON.stringify(error)));

  }

  deleteFile(index) {
    if (index !== -1) {
        this.files.splice(index, 1);
    }        
  }

  chooseFile(del = false) {

    if(this.files.length >= 2 ){
      return false;
    }

    if(del){
      this._ngZone.run(() => {
      });
      return false;
    }
    if (this.platform.is("ios")) {
      this.chooseFileForIos();
    } else {
      this.chooseFileForAndroid();
    }
  }

  chooseFileForIos() {
    this.filePicker
      .pickFile()
      .then(uri => {
        this.convertToBase64(uri)
      })
      .catch(err => console.log("Error", err));
  }

  chooseFileForAndroid() {
    this.fileChooser
      .open({ "mime": "application/*" })
      .then(uri => {
        this.convertToBase64(uri)
      })
      .catch(e => {
        console.log(e);
      });
  }

  convertToBase64(uri) {
    console.log('uri', uri);
  }
  
}
