import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

import { AppUserService } from '../../services/api/app-user.service';
import { LoggerService } from '@services/utils';
import { Watchable } from '@models/utils';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})

// implements OnInit
export class UpdatePage {
  private readonly TAG: string = 'UpdatePage';
  private idW: Watchable<number> = new Watchable<number>();

  @Input() data: any;

  constructor(
    private logger: LoggerService,
    private userPrv: AppUserService,
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private router: Router,
  ) {}

  // ngOnInit
  ionViewWillEnter() {
    console.log('data page', this.data);
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
