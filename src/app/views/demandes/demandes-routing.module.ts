import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandesPage } from './demandes.page';

const routes: Routes = [
  {
    path: '',
    component: DemandesPage
  },
  {
    path: 'etapes',
    loadChildren: () => import('./etapes/etapes.module').then( m => m.EtapesPageModule)
  },
  {
    path: 'etape',
    loadChildren: () => import('./etape/etape.module').then( m => m.EtapePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandesPageRoutingModule {}
