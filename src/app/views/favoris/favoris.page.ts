import { Component, OnInit, OnDestroy, ViewEncapsulation, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { LoggerService } from '@services/utils';
import { HomeProvider, ProfilProvider } from '@providers';

import { async } from '@angular/core/testing';
import { AppUserService } from '@services/api/app-user.service';

@Component({
  selector: 'app-favoris',
  templateUrl: 'favoris.page.html',
  styleUrls: ['favoris.page.scss'],
})

export class FavorisPage  {
  private readonly TAG: string = 'FavorisPage';

  @ViewChild("header") header: HTMLElement;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  scrollDepthTriggered = false;
  alias: any;
  title: any;
  no_data_title: any = 'No card in your  Favorite list !';
  no_data_description: any = 'You can tap on the heart icon on the top left of each card to add it to your favourite cards list. All your favorite cards will show up here !';
  data: any;
  filtred_data: any;
  modeSearch: any = false;
  searchKey: any;
  user: any;

  webApp : boolean;

  constructor(
    private logger: LoggerService,
    private notifPrv: HomeProvider,
    private profilPrv: ProfilProvider,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private appUserService: AppUserService,
    public element: ElementRef, 
    public renderer: Renderer2
  ) {

    this.appUserService.currentisWebApp.subscribe((data) => {
      this.webApp = data;
    });
    
    this.user = this.appUserService.getUser();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.alias= this.router.getCurrentNavigation().extras.state.alias;
      }
    });

  }

  ionViewWillEnter() {

    this.logger.log(this.TAG, 'init');

    this.notifPrv.favorites().subscribe(
      (res) => {
        console.log('res', res);
        this.logger.log(this.TAG, 'profil data', res);
        this.data = res.favorites;
        this.filtred_data = this.data;

        console.log('this.data', this.data);

      },
      (err) => {
        //this.router.navigate(['/app/profil/login']);
        console.log('');
      },
    );

  }
  
  refresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
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
  
  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  onContentScroll(event) {
    /*
    if (event.detail.scrollTop >= 50) {
      this.renderer.setStyle(this.header['el'], 'display', 'block');
    } else {
      this.renderer.setStyle(this.header['el'], 'display', 'none');
    }
    */
  }

  search_mode(search = true) {
    this.modeSearch = search;
    if(!search){
      this.searchKey = '';
      this.filtred_data = this.data;
    } else {
      this.filtred_data = null;
    }
  }

  search_key(ev) {
    this.searchKey = ev.target.value;
    if(this.modeSearch) {
      this.filtred_data = this.data.filter((message) => {
        return this.searchKey && 
        ((message.nom_entreprise && message.nom_entreprise.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1) ||
         (message.nom && message.nom.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1) ||
          ( message.prenom && message.prenom.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1));
      });
    }else {
      this.filtred_data = this.data;
    }
  }
  
}
