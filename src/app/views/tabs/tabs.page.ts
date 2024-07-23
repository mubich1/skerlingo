import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Watchable } from '@models/utils';
import { IonTabs, NavController } from '@ionic/angular';
import { AppReservationStorage } from '@services/security';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  private idW: Watchable<any> = new Watchable<any>();
  countPrestations: any;
  @ViewChild('tabs') tabs: IonTabs;
  routeUrls: string[] = ['/tabs/home', '/tabs/favoris','/tabs/progress','/'];
  showFooterTabsBar:Boolean=true;

  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    accueil: {
      fr: 'Accueil',
      en: 'Home'
    },
    favoris: {
      fr: 'Favoris',
      en: 'Favorite'
    },
    prog: {
      fr: 'Progressions',
      en: 'Progress'
    },
  };


  constructor(private reservationStrg: AppReservationStorage, public navCtrl: NavController,
    private router: Router,) {
      this.router.events.subscribe((route:any) =>{
        if(route.url){
          if( this.routeUrls.includes(route.url) ){
            this.showFooterTabsBar =  true;
         const selectedTab:string = route.url === ('/tabs/home') ? 'home' : route.url === '/tabs/favoris' ? 'favoris':  route.url === '/tabs/progress' ? 'progress':'home';
          } else{
            this.showFooterTabsBar =  false;
          }
        }
      });
     }

  ngOnInit() {

    // if(!window.localStorage['appLang']){
    //   this.router.navigate([
    //     '/choose-langue',
    //   ]);
    // }
    this.reservationStrg.countPanierChange.subscribe((value) => {
      this.countPrestations = value;
    });
  }

  async openTab(tab: string, evt: MouseEvent) {
    const tabSelected = this.tabs.getSelected();
    evt.stopImmediatePropagation();
    evt.preventDefault();
    return tabSelected !== tab
      ? await this.navCtrl.navigateRoot(this.tabs.outlet.tabsPrefix + '/' + tab)
      : this.tabs.select(tab);
  }

  isTabSelected(){
    return 'home'
  }

}
