import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { ComptePageRoutingModule } from './compte-routing.module';

import { ComptePage } from './compte.page';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComptePageRoutingModule,
  ],
  declarations: [ComptePage],
})
export class ComptePageModule {}
