import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, IonContent, ModalController } from '@ionic/angular';
import { AppUserService } from '../../services/api/app-user.service';
import { NotationData } from '@models/business';
import { LoggerService } from '@services/utils';
import { NotationProvider, PrestationProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';
import { AppReservationStorage } from '@services/security';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { ApiReservation } from '@models/security';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { lessonMenuDetails } from '@views/prestation/static-record';

@Component({
  selector: 'app-notation',
  templateUrl: './notation.page.html',
  styleUrls: ['./notation.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})

// implements OnInit
export class NotationPage {
  private readonly TAG: string = 'NotationPage';
  private idW: Watchable<number> = new Watchable<number>();
  notation: NotationData;
  data: any;
  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  @Input() lecon: any;
  @Input() categorie: any;
  @Input() guide: any;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private logger: LoggerService,
    private notationPrv: NotationProvider,
    private prestationPrv: PrestationProvider,
    private userPrv: AppUserService,
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  // ngOnInit
  ionViewWillEnter() { }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  ratingChange(notation, prestation) {
    prestation.notation = notation;
  }

  page_grid() {

    // this.modalCtrl.dismiss({
    //   dismissed: true,
    // });

    // let navigationExtras: NavigationExtras = { state: { id: this.categorie, title: this.categorie } };
    // this.router.navigate(['/tabs/home/grid'], navigationExtras);

    const nextLesson: any = lessonMenuDetails.find((lesson: any) => lesson.type == this.categorie)
    if (nextLesson) {
      if (this.lecon.lessonType === 'intro') {
        this.modalCtrl.dismiss({
          dismissed: true,
        });

        let navigationExtras: NavigationExtras = { state: { id: nextLesson.lecons[1].id, categorie: this.categorie, title: this.categorie } };
        this.router.navigate(['/tabs/home/lecon'], navigationExtras);
      } else {
        localStorage.setItem(this.categorie + '_' + this.lecon.id, "true")
        this.lecon = nextLesson.lecons.find((lecon: any) => lecon.lessonType == "additional" && lecon.id == this.lecon.id + 1)
        this.content.scrollToTop();
        if(this.lecon && this.lecon?.additionalCount=="4"){
          localStorage.setItem(this.categorie+'_'+this.lecon.id,"true")
         }
        console.log(' this.lecon: ', this.lecon);
      }
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  disableNextLesson() {
    const nextLesson: any = lessonMenuDetails.find((lesson: any) => lesson.type == this.categorie)
    if (nextLesson) {
      if (nextLesson.lecons.findIndex((lecon: any) => lecon.lessonType == this.lecon.lessonType && this.lecon.lessonType == 'intro'  ) > -1) {
        return false;
      }
      else if(nextLesson.lecons.findIndex((lecon: any) => lecon.lessonType == "additional" && lecon.id == this.lecon.id + 1) > -1        ){
        return false;
      }
      else{
        return true;
      }
    }
  }

}