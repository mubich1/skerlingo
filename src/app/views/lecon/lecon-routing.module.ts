import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeconPage } from './lecon.page';

const routes: Routes = [
  {
    path: '',
    component: LeconPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeconPageRoutingModule {}
