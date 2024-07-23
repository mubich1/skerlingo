import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotationPage } from './notation.page';

const routes: Routes = [
  {
    path: '',
    component: NotationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotationPageRoutingModule {}
