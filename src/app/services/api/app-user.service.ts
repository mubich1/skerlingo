import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, fromEvent } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import {
  debounceTime,
} from 'rxjs/operators';

import { ApiUser } from '@models/security';
import {
  Profile,
  LoginData,
  SignupData,
  SignupResult,
  FbLoginData,
  GpLoginData,
  AppleLoginData,
  CheckProviderData,
} from '@models/users';
import { LoggerService } from '../utils';
import { AppUserStorage } from '../security';
import { UsersService } from '../../providers/users.provider';
import { CheckProviderResult } from '@models/users/checkprovider-result';
import { Config } from '@config';
import { HttpClient } from '@angular/common/http';

const BEARER_MIN_LENGTH = 10;

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 *   redirectUrl: string;
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  private readonly TAG = 'AppUserService';

  private _user: ApiUser;
  private _current: ReplaySubject<ApiUser> = new ReplaySubject<ApiUser>(1);

  private _profile: Profile;
  private _currentProfile: ReplaySubject<Profile> = new ReplaySubject<Profile>(1);

  private _isWebApp: any;
  private _current_isWebApp: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _isNotifs: any;
  private _current_isNotifs: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _loggedInChange: ReplaySubject<boolean> = new ReplaySubject<boolean>(undefined);

  get current(): Observable<ApiUser> {
    return this._current.asObservable();
  }

  get currentProfile(): Observable<Profile> {
    return this._currentProfile.asObservable();
  }

  get currentisWebApp(): Observable<any> {
    return this._current_isWebApp.asObservable();
  }

  get currentisNotifs(): Observable<any> {
    return this._current_isNotifs.asObservable();
  }

  get loggedInChange(): Observable<boolean> {
    return this._loggedInChange.asObservable();
  }

  constructor(private readonly http: HttpClient, private logger: LoggerService, public api: UsersService, public store: AppUserStorage) {
    this.setUser(store.load());
  }

  public setUser(user: ApiUser) {
    this._user = user;
    this.store.save(this._user);
    this._current.next(this._user);
    this._loggedInChange.next(!!this._user);
  }

  private setProfile(profile: Profile) {
    this._profile = profile;
    this._currentProfile.next(this._profile);
  }

  public setIsWebApp(webApp: any) {
    this._isWebApp = webApp;
    this._current_isWebApp.next(this._isWebApp);
  }

  public setIsNotifs(notifs: any) {
    this._isNotifs = notifs;
    this._current_isNotifs.next(this._isNotifs);
  }

  init() {
    this.setIsWebApp(window.innerWidth > 750);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(0),
      ).subscribe((evt: any) => {
        this.setIsWebApp(evt.target.innerWidth > 750);
      });

    this._loggedInChange.pipe(take(1)).subscribe((loggedIn) => {
      if (loggedIn) {
        this.api.profile(this.getToken()).subscribe((profile) => {
          if (profile.success) this.setProfile(profile);
          else {
            this.setProfile(profile);
          }
        });
      } else {
        this.setProfile(undefined);
      }
    });
  }

  getUser(): ApiUser {
    return this._user;
  }

  getProfile(): Profile {
    return this._profile;
  }

  getIsWebApp(): any {
    return this._isWebApp;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: LoginData): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    return this.api.login(accountInfo.email, accountInfo.password).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'login result', res.token);
        if (res.success && res.user.token) {
          let token = res.user.token;
          const apiUser: ApiUser = {
            token,
          };
          return this.setLoggedIn(apiUser);
        } else {
          return res.message;
        }
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  fb_login(FbInfo: FbLoginData): Observable<any> {
    this.logger.log(this.TAG, 'Facebook signing in');

    return this.api.fb_login(FbInfo).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'login result', res.success);
        if (res.success) {
          return this.setLoggedIn(res.user);
        } else {
          return false;
        }
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  linkedin_token(data): Observable<any> {
    this.logger.log(this.TAG, 'Facebook signing in');

    return this.api.linkedin_token(data).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  linkedin_infos(data): Observable<any> {
    this.logger.log(this.TAG, 'Facebook signing in');

    return this.api.linkedin_infos(data).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  gp_login(GpInfo: GpLoginData): Observable<any> {
    this.logger.log(this.TAG, 'Facebook signing in');

    return this.api.gp_login(GpInfo).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'login result', res.success);
        if (res.success) {
          return this.setLoggedIn(res.user);
        } else {
          return false;
        }
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  apple_login(AppleInfo: any): Observable<any> {
    this.logger.log(this.TAG, 'Facebook signing in');

    return this.api.apple_login(AppleInfo).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'login result', res.success);
        if (res.success) {
          return this.setLoggedIn(res.user);
        } else {
          return false;
        }
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  forgot_password(login: any): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    return this.api.forgot_password(login).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'forgot password result', res.success);
        return res;
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  change_password(data: any): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    let dataSend = { ...data };
    dataSend['token'] = this.getToken();

    return this.api.change_password(dataSend).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'forgot password result', res.success);
        return res;
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  reset_password(data: any): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    let dataSend = { ...data };
    //dataSend['token'] = this.getToken();

    return this.api.reset_password(dataSend).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'forgot password result', res.success);
        return res;
      }),
    );
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  fcm_token(data): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    return this.api.fcm_token(data, this.getToken()).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'Fcm token result', res.success);
        return res;
      }),
    );
  }

  check_version(data): Observable<any> {
    this.logger.log(this.TAG, 'signing in');

    return this.api.check_version(data, this.getToken()).pipe(
      map((res) => {
        this.logger.log(this.TAG, 'Fcm token result', res);
        return res;
      }),
    );
  }

  getToken(): string {
    const user = this.getUser();
    if (user) {
      return user.token;
    }

    return undefined;
  }

  getType(): string {
    const user = this.getUser();
    if (user) {
      return '';
    }

    return undefined;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(data: SignupData): Observable<SignupResult> {
    this.logger.log(this.TAG, 'signing up');

    return this.api.signup(data).pipe(
      tap((res) => this.logger.log(this.TAG, 'signup result' + res)),
      tap((res) => {
        if (res.success) {
          return this.setLoggedIn(res.user);
        }
      }),
    );
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup_recruteur(data: SignupData): Observable<SignupResult> {
    this.logger.log(this.TAG, 'signing up');

    return this.api.signup_recruteur(data).pipe(
      tap((res) => this.logger.log(this.TAG, 'signup result' + res)),
      tap((res: any) => {
        return res.success;
      }),
    );
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  check_provider(data: CheckProviderData): Observable<CheckProviderResult> {
    this.logger.log(this.TAG, 'signing up');

    return this.api.check_provider(data).pipe(
      tap((res) => this.logger.log(this.TAG, 'signup result' + res)),
      tap((res) => {
        if (res.success && res.user) {
          return this.setLoggedIn(res.user);
        }
      }),
    );
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  update(data: SignupData): Observable<SignupResult> {
    this.logger.log(this.TAG, 'Update profile up');

    return this.api.update(data, this.getToken()).pipe(
      tap((res) => this.logger.log(this.TAG, 'Update profile result' + res)),
      tap((res: any) => {
        if (res.success) {
          return this.setLoggedIn(res.user);
        }
      }),
    );
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.logger.log(this.TAG, 'Logging out user');

    this.setUser(undefined);
  }

  /**
   * Log the user out, which forgets the session
   */
  isLoggedIn(): boolean {
    this.logger.log(this.TAG, 'isLoggedIn ');
    const user = this.getUser();

    return this.checkUser(user);
  }

  checkUser(user: ApiUser): boolean {
    if (user) {
      if (this.checkToken(user.token)) {
        const isValid = true || this.checkValidity(user.validity);
        if (!isValid) {
          this.logger.log(this.TAG, 'Token Out of Date Exception');
        }
        return isValid;
      } else {
        this.logger.log(this.TAG, 'Invalid Token Exception');
      }
    } else {
      this.logger.log(this.TAG, 'Null User Exception');
    }

    return false;
  }

  checkToken(bearer: string): boolean {
    if (bearer !== undefined) {
      if (bearer.length > BEARER_MIN_LENGTH) {
        return true;
      }
    }

    return false;
  }

  checkValidity(validity: string): boolean {
    if (validity) {
      return +new Date(validity) > +new Date();
    }

    return false;
  }

  /**
   * Process a login/signup response to store user data
   */
  private setLoggedIn(user: ApiUser) {
    this.logger.log(this.TAG, 'SetLoggedIn');

    if (this.checkUser(user)) {
      this.setUser(user);

      setTimeout(async () => {
        this.init();
      }, 1000);

      return user;
    }

    return false;
  }

  /**
* Send a delete request to delete the account
*
*/
  deleteAccount(email: any): Observable<any> {
    return this.api.delete_account(email, this.getToken()).pipe(
      map((res) => {
        // this.logger.log(this.TAG, 'forgot password result', res.success);
        return res;
      }),
    );
  }

  /**
* Check from data base if email exist or not
*/
  emailExist(email: any): Observable<any> {
    this.logger.log(this.TAG, 'signing in');
    return this.api.email_Exist(email).pipe(
      map((res: any) => {
        this.logger.log(this.TAG, 'forgot password result', res.success);
        return res;
      }),
    );
  }

      /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  googleLogin(AuthToken:any ): Observable<any> {
    const endpoint = Config.apiHost + Config.apiVersion + 'account/google-auth';
    console.log('endpoint: ', endpoint);
    const token = {
      token: AuthToken
    }

    return this.http.post<any>(endpoint, token);
  }

}