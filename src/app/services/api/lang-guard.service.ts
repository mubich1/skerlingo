import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppUserService } from './app-user.service';

@Injectable({
  providedIn: 'root',
})
export class LangGuardService implements CanActivate {
  public webApp: boolean;

  constructor(public appUserService: AppUserService, public router: Router,
    private platform: Platform) {
      
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!window.localStorage['appLang']){
      this.router.navigate([
        '/choose-langue',
      ]);
      return false
    }
    return true;
  }

  
}
