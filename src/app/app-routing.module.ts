import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./views/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'categorie',
    loadChildren: () => import('./views/categorie/categorie.module').then((m) => m.CategoriePageModule),
  },
  {
    path: 'sliders',
    loadChildren: () => import('./views/sliders/sliders.module').then((m) => m.SlidersPageModule),
  },
  {
    path: 'prestation',
    loadChildren: () => import('./views/prestation/prestation.module').then((m) => m.PrestationPageModule),
  },
  {
    path: 'reservation',
    loadChildren: () => import('./views/reservation/reservation.module').then((m) => m.ReservationPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./views/register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'panier',
    loadChildren: () => import('./views/panier/panier.module').then((m) => m.PanierPageModule),
  },
  {
    path: 'profil',
    loadChildren: () => import('./views/profil/profil.module').then((m) => m.ProfilPageModule),
  },
  {
    path: 'creneaux',
    loadChildren: () => import('./views/creneaux/creneaux.module').then((m) => m.CreneauxPageModule),
  },
  {
    path: 'boutique',
    loadChildren: () => import('./views/boutique/boutique.module').then((m) => m.BoutiquePageModule),
  },
  {
    path: 'produit',
    loadChildren: () => import('./views/produit/produit.module').then((m) => m.ProduitPageModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./views/search/search.module').then((m) => m.SearchPageModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./views/contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'giveaway',
    loadChildren: () => import('./views/giveaway/giveaway.module').then((m) => m.GiveawayPageModule),
  },
  {
    path: 'compte',
    loadChildren: () => import('./views/compte/compte.module').then((m) => m.ComptePageModule),
  },
  {
    path: 'notation',
    loadChildren: () => import('./views/notation/notation.module').then((m) => m.NotationPageModule),
  },
  {
    path: 'update',
    loadChildren: () => import('./views/update/update.module').then((m) => m.UpdatePageModule),
  },
  {
    path: 'password',
    loadChildren: () => import('./views/password/password.module').then((m) => m.PasswordPageModule),
  },
  {
    path: 'demandes',
    loadChildren: () => import('./views/demandes/demandes.module').then( m => m.DemandesPageModule)
  },
  {
    path: 'etapes',
    loadChildren: () => import('./views/demandes/etapes/etapes.module').then( m => m.EtapesPageModule)
  },
  {
    path: 'etape',
    loadChildren: () => import('./views/demandes/etape/etape.module').then( m => m.EtapePageModule)
  },
  {
    path: 'lecon',
    loadChildren: () => import('./views/lecon/lecon.module').then( m => m.LeconPageModule)
  },
  {
    path: 'favoris',
    loadChildren: () => import('./views/favoris/favoris.module').then( m => m.FavorisPageModule)
  },
  {
    path: 'avis',
    loadChildren: () => import('./views/avis/avis.module').then( m => m.AvisPageModule)
  },
  {
    path: 'choose-langue',
    loadChildren: () => import('./views/choose-langue/choose-langue.module').then( m => m.ChooseLanguePageModule)
  },
  {
    path: 'parametres',
    loadChildren: () => import('./views/parametres/parametres.module').then( m => m.ParametresPageModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./views/quiz/quiz.module').then( m => m.QuizPageModule)
  },
  {
    path: 'grid',
    loadChildren: () => import('./views/grid/grid.module').then( m => m.GridPageModule)
  },
  {
    path: 'progress',
    loadChildren: () => import('./views/progress/progress.module').then( m => m.ProgressPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
