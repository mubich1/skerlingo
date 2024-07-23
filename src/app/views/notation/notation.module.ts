import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotationPageRoutingModule } from './notation-routing.module';

import { NotationPage } from './notation.page';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  imports: [CommonModule, StarRatingModule, FormsModule, IonicModule, NotationPageRoutingModule],
  declarations: [NotationPage],
})
export class NotationPageModule {}
