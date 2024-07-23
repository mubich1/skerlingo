import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlidersPage } from './sliders.page';

const routes: Routes = [
  {
    path: '',
    component: SlidersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlidersPageRoutingModule {}
