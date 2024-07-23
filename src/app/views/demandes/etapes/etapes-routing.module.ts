import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EtapesPage } from './etapes.page';

const routes: Routes = [
  {
    path: '',
    component: EtapesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtapesPageRoutingModule {}
