import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrestationPageRoutingModule } from './prestation-routing.module';

import { PrestationPage } from './prestation.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PrestationPageRoutingModule],
  declarations: [PrestationPage],
})
export class PrestationPageModule {}
