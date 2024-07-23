import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard } from '../../services/api/auth-guard.service';
import { LangGuardService as LangGuard } from '../../services/api/lang-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            // canActivate: [LangGuard],
            loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule),
          },
          {
            path: 'categorie',
            loadChildren: () => import('../categorie/categorie.module').then((m) => m.CategoriePageModule),
          },
          {
            path: 'quiz',
            loadChildren: () => import('../quiz/quiz.module').then((m) => m.QuizPageModule),
          },
          {
            path: 'prestation',
            loadChildren: () => import('../prestation/prestation.module').then((m) => m.PrestationPageModule),
          },
          {
            path: 'grid',
            loadChildren: () => import('../grid/grid.module').then((m) => m.GridPageModule),
          },
          {
            path: 'lecon',
            loadChildren: () => import('../lecon/lecon.module').then((m) => m.LeconPageModule),
          },
          {
            path: 'giveaway',
            loadChildren: () => import('../giveaway/giveaway.module').then((m) => m.GiveawayPageModule),
          },
          {
            path: 'reservation',
            loadChildren: () => import('../reservation/reservation.module').then((m) => m.ReservationPageModule),
          },
          {
            path: 'creneaux',
            loadChildren: () => import('../creneaux/creneaux.module').then((m) => m.CreneauxPageModule),
          },
          {
            path: 'sliders',
            loadChildren: () => import('../sliders/sliders.module').then((m) => m.SlidersPageModule),
          },
        ],
      },
      {
        path: 'profil',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('../compte/compte.module').then((m) => m.ComptePageModule),
          },
          {
            path: 'login',
            loadChildren: () => import('../login/login.module').then((m) => m.LoginPageModule),
          },
          {
            path: 'password',
            loadChildren: () => import('../password/password.module').then((m) => m.PasswordPageModule),
          },
          {
            path: 'register',
            loadChildren: () => import('../register/register.module').then((m) => m.RegisterPageModule),
          },
          {
            path: 'compte',
            loadChildren: () => import('../compte/compte.module').then((m) => m.ComptePageModule),
          },
          {
            path: 'notation',
            loadChildren: () => import('../notation/notation.module').then((m) => m.NotationPageModule),
          },
        ],
      },
      {
        path: 'favoris',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('../favoris/favoris.module').then((m) => m.FavorisPageModule),
          },
        ],
      },
      {
        path: 'progress',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('../progress/progress.module').then((m) => m.ProgressPageModule),
          },
        ],
      },
      {
        path: 'panier',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('../panier/panier.module').then((m) => m.PanierPageModule),
          },
        ],
      },
      {
        path: 'contact',
        children: [
          {
            path: '',
            loadChildren: () => import('../contact/contact.module').then((m) => m.ContactPageModule),
          },
        ],
      },
      {
        path: 'boutique',
        children: [
          {
            path: '',
            loadChildren: () => import('../boutique/boutique.module').then((m) => m.BoutiquePageModule),
          },
          {
            path: 'produit',
            loadChildren: () => import('../produit/produit.module').then((m) => m.ProduitPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TabsPageRoutingModule { }