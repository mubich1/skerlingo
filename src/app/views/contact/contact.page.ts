import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';

import { ContactData } from '@models/business';
import { LoggerService } from '@services/utils';
import { ContactProvider } from '@providers';

import { Config } from '@config';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})
export class ContactPage implements OnInit {
  private readonly TAG: string = 'ContactPage';

  data: ContactData;
  loading: any;

  constructor(
    private logger: LoggerService,
    private contactPrv: ContactProvider,
    private router: Router,
    public alertController: AlertController,
    private platform: Platform,
  ) {}

  async ngOnInit() {
  }
}
