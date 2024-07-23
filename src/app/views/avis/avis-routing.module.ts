import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisPage } from './avis.page';

const routes: Routes = [
  {
    path: '',
    component: AvisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisPageRoutingModule {}
