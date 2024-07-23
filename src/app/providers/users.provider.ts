import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCredentials } from '@models/security';
import { LoginResult, SignupData, SignupResult, Profile, FbLoginData, GpLoginData, AppleLoginData, CheckProviderData } from '@models/users';
import { CryptoService } from '@services/security';
import { LoggerService } from '@services/utils';
import { BaseProvider } from './base.provider';
import { Config } from '@config';
import { CheckProviderResult } from '@models/users/checkprovider-result';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  private readonly TAG = 'AuthentificationService';

  private endpoints = {
    login: 'account/login',
    linkedn_token: 'getAccessTokenLinkedin',
    linkedn_infos: 'getNameLinkedin',
    fb_login: 'account/fb_login',
    gp_login: 'account/gp_login',
    apple_login: 'account/apple_login',
    forgot_password: 'forgotpasswordM',
    change_password: 'changepasswordM',
    reset_password: 'forgottenPassword',
    logout: 'account/logout',
    signup: 'account/register',
    signup_recruteur: 'createRecruiterM',
    check_provider: 'verificationProviders',
    profile: 'account/profile',
    update: 'account/update',
    fcm_token: 'fcm_token',
    check_version: 'check_version',
    check_emailExist: 'emailExist',
    delete_account: 'deleteAccount'
  };

  constructor(private logger: LoggerService, private crypto: CryptoService, private base: BaseProvider, public platform: Platform) { }
  deviceType: string = "unknown";

  login(email: string, password: string): Observable<LoginResult> {
    // let DeviceType = "undefined";
    this.logger.log(this.TAG, 'login');
    const uniqueId = this.crypto.getnonce();
    //GET PLATFORM
    if (this.platform.is('ios')) { this.deviceType = 'Ios'; }
    else if (this.platform.is('android')) { this.deviceType = 'android' }
    else { this.deviceType = 'web' };

    const deviceType = this.deviceType;
    const credentials: ApiCredentials = {
      email,
      password,
      uniqueId,
    };

    return this.base.post<LoginResult>(this.endpoints.login, credentials);
  }


  linkedin_token(data): Observable<LoginResult> {
    this.logger.log(this.TAG, 'Linkedin login');
    return this.base.post<any>(this.endpoints.linkedn_token, data);
  }

  linkedin_infos(data): Observable<LoginResult> {
    this.logger.log(this.TAG, 'Linkedin Infos');
    return this.base.post<any>(this.endpoints.linkedn_infos, data);
  }

  fb_login(FbInfo: FbLoginData): Observable<LoginResult> {
    this.logger.log(this.TAG, 'Fb login');
    return this.base.post<LoginResult>(this.endpoints.fb_login, FbInfo);
  }

  gp_login(GpInfo: GpLoginData): Observable<LoginResult> {
    this.logger.log(this.TAG, 'Gb login');
    return this.base.post<LoginResult>(this.endpoints.gp_login, GpInfo);
  }


  apple_login(AppleInfo: any): Observable<LoginResult> {
    this.logger.log(this.TAG, 'Gb login');
    return this.base.post<LoginResult>(this.endpoints.apple_login, AppleInfo);
  }

  forgot_password(login: string): Observable<any> {
    this.logger.log(this.TAG, 'login');
    const uniqueId = this.crypto.getnonce();
    return this.base.post<any>(this.endpoints.forgot_password, { email: login });
  }

  change_password(data: any): Observable<any> {
    this.logger.log(this.TAG, 'change password');

    const uniqueId = this.crypto.getnonce();

    return this.base.post<any>(this.endpoints.change_password, data);
  }

  reset_password(data: any): Observable<any> {


    this.logger.log(this.TAG, 'reset password');

    const uniqueId = this.crypto.getnonce();

    return this.base.post<any>(this.endpoints.reset_password, data);
  }

  logout(body: any) {


    return this.base.post(this.endpoints.logout, body);
  }

  signup(data: SignupData) {


    this.logger.log(this.TAG, 'signup');

    let endpoint = this.endpoints.signup;

    if (data.provider) {
      //endpoint = 'registerWithProviderM';
    }


    console.log('yes post');
    return this.base.post<SignupResult>(endpoint, data);
  }

  signup_recruteur(data: SignupData) {


    this.logger.log(this.TAG, 'signup');

    let endpoint = this.endpoints.signup_recruteur;


    return this.base.post<SignupResult>(endpoint, data);
  }

  check_provider(data: CheckProviderData) {


    this.logger.log(this.TAG, 'signup');

    return this.base.post<CheckProviderResult>(this.endpoints.check_provider, data);
  }

  update(data, token) {


    this.logger.log(this.TAG, 'signup');

    return this.base.post<any>(this.endpoints.update, data, token);
  }

  fcm_token(data, token) {


    this.logger.log(this.TAG, 'signup');

    return this.base.post<any>(this.endpoints.fcm_token, data, token);
  }

  check_version(data, token) {


    this.logger.log(this.TAG, 'check_version');

    return this.base.post<any>(this.endpoints.check_version, data, token);
  }

  profile(token) {
    return this.base.get<Profile>(this.endpoints.profile, { token: token }, token);
  }

  email_Exist(email: string): Observable<any> {
    this.logger.log(this.TAG, 'login');
    return this.base.post<any>(this.endpoints.check_emailExist, { email: email });
  }

  // delete user account from db
  delete_account(email: string, token?: string): Observable<any> {
    return this.base.post<any>(`${this.endpoints.delete_account}`, { email: email }, token);
  }

}