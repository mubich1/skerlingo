import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EtapesPageRoutingModule } from './etapes-routing.module';

import { EtapesPage } from './etapes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EtapesPageRoutingModule
  ],
  declarations: [EtapesPage]
})
export class EtapesPageModule {}
