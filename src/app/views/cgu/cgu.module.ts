import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { CguPageRoutingModule } from './cgu-routing.module';
import {ExpandableModule} from '../../components/expandable/expandable.module';

import { CguPage } from './cgu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpandableModule,
    CguPageRoutingModule
  ],
  declarations: [CguPage]
})
export class CguPageModule {}
