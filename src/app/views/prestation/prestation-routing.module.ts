import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestationPage } from './prestation.page';

const routes: Routes = [
  {
    path: '',
    component: PrestationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrestationPageRoutingModule {}
