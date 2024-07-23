import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppUserService } from './app-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  public webApp: boolean;

  constructor(public appUserService: AppUserService, public router: Router,
    private platform: Platform) {
      
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.appUserService.isLoggedIn()) {
      //return true;

      this.router.navigate([
        '/sliders',
        {
          snapshot: state.url,
        },
      ]);

      /*
      if (this.platform.is("mobileweb")) {
        //this.router.navigate(['/']);
      }
      else if (this.platform.is("ios")) {
        this.router.navigate([
          '/sliders',
          {
            snapshot: state.url,
          },
        ]);
      } else if(this.platform.is("android")) {
        this.router.navigate([
          '/sliders',
          {
            snapshot: state.url,
          },
        ]);
      }else {
        this.router.navigate(['/']);
      }
      */
      return false;
    }
    return true;
  }

  
}
