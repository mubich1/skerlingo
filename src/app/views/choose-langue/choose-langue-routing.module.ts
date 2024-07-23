import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseLanguePage } from './choose-langue.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseLanguePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseLanguePageRoutingModule {}
