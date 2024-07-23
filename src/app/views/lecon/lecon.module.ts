import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeconPageRoutingModule } from './lecon-routing.module';

import { LeconPage } from './lecon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LeconPageRoutingModule
  ],
  declarations: [LeconPage]
})
export class LeconPageModule {}
