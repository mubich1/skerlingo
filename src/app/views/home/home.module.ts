import { NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { CountdownModule, CountdownConfig, CountdownComponent } from 'ngx-countdown';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, CountdownModule, RouterModule.forChild(routes)],
  declarations: [HomePage],
})
export class HomePageModule {}
