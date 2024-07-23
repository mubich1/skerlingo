import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreneauxPageRoutingModule } from './creneaux-routing.module';

import { CreneauxPage } from './creneaux.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreneauxPageRoutingModule
  ],
  declarations: [CreneauxPage]
})
export class CreneauxPageModule {}
