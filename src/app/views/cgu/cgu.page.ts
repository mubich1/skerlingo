import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, ViewChildren, QueryList, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { CountdownComponent, CountdownConfig } from 'ngx-countdown';

import { HomeData } from '@models/business';
import { LoggerService } from '@services/utils';
import { HomeProvider } from '@providers';
import { ModalController } from '@ionic/angular';
import { AppUserService } from '@services/api/app-user.service';

@Component({
  selector: 'app-cgu',
  templateUrl: 'cgu.page.html',
  styleUrls: ['cgu.page.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class CguPage implements OnDestroy {
  private readonly TAG: string = 'HomePage';
  scrollDepthTriggered = false;
  
  segmentModel = '';

  data: any;
  cards: any;
  
  webApp : any;
  user: any;

  id: any;
  isWeb: any;

  faqItems: Array<{
    title: string;
    expanded?: boolean;
    content: string;
  }> = [];

  constructor(
    private logger: LoggerService,
    private homePrv: HomeProvider,
    private router: Router,
    private route: ActivatedRoute,
    private appUserService: AppUserService,
    private modalCtrl: ModalController,
    private countdown: CountdownComponent,
  ) {
    
    this.user = this.appUserService.getUser();

    this.appUserService.currentisWebApp.subscribe((data) => {
      this.webApp = data;
    });

    if((this.router.url).indexOf("/politiques") === 0){
      this.isWeb = true;
    }

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.id= this.router.getCurrentNavigation().extras.state.id;
        this.isWeb = this.router.getCurrentNavigation().extras.state.website;
      }
    });

  }

  ionViewWillEnter() {

    this.homePrv.cgu().subscribe(
      async (res) => {

        this.faqItems = [];
        this.logger.log(this.TAG, 'home data', res);
        this.data = res;

        if(this.data) {
          if(!this.id) {
            this.segmentModel = this.data[0].id;
          }else {
            let cgu = this.data.filter(
              (object) => {
                return object.id == this.id
              }
            );
            if(cgu){
              this.segmentModel = cgu[0].id;
            }
          }
        }

        this.data.forEach(function(element) {

          this.homePrv.cgu_item(element.id).subscribe(
            async (res) => {
              this.faqItems.push({
                id: element.id,
                title: element.title,
                expanded: false,
                content: res[0].content
              });
            },
            (err) => {
              this.data = [];
            },
          );
          
        }.bind(this));
      },
      (err) => {
        this.data = [];
      },
    );

  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  close() {
    this.modalCtrl.dismiss({
      dismiss: true
    });
  }

}
