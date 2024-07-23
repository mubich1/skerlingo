import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreneauxPage } from './creneaux.page';

const routes: Routes = [
  {
    path: '',
    component: CreneauxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreneauxPageRoutingModule {}
