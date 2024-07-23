import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EtapePageRoutingModule } from './etape-routing.module';
import { MomentModule } from 'angular2-moment';

import { EtapePage } from './etape.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    EtapePageRoutingModule
  ],
  declarations: [EtapePage]
})
export class EtapePageModule {}
