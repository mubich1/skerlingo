import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EtapePage } from './etape.page';

const routes: Routes = [
  {
    path: '',
    component: EtapePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtapePageRoutingModule {}
