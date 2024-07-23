import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';

import { SearchData } from '@models/business';
import { LoggerService } from '@services/utils';
import { SearchProvider } from '@providers';

import { Config } from '@config';


@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})
export class SearchPage implements OnInit {
  private readonly TAG: string = 'SearchPage';

  data: SearchData;
  loading: any;

  constructor(
    private logger: LoggerService,
    private searchPrv: SearchProvider,
    private router: Router,
    public alertController: AlertController,
    private platform: Platform,
  ) {}

  async ngOnInit() {
  }
}
