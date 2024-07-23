import { NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownModule, CountdownComponent, CountdownGlobalConfig } from 'ngx-countdown';

import { GiveawayPageRoutingModule } from './giveaway-routing.module';

import { GiveawayPage } from './giveaway.page';

@NgModule({
  imports: [CommonModule, FormsModule, CountdownModule, IonicModule, GiveawayPageRoutingModule],
  declarations: [GiveawayPage],
  providers: [CountdownComponent, { provide: CountdownGlobalConfig, useValue: undefined }],
})
export class GiveawayPageModule {}
