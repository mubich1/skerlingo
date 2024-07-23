import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseLanguePageRoutingModule } from './choose-langue-routing.module';

import { ChooseLanguePage } from './choose-langue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseLanguePageRoutingModule
  ],
  declarations: [ChooseLanguePage]
})
export class ChooseLanguePageModule {}
