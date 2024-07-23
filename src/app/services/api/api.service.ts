import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '@config';
import { APIResponse, APIRequest, RequestEncryption, AppKey } from '@models/security';
import { CryptoService, AppKeyStorage } from '../security';
import { LoggerService } from '../utils';

const SALT_SIZE = 16;
const KEY_SIZE = 32;
const DEFAULT_ENCRYPT_ITERATIONS = 1;
const SERVER_PEM_CERT = `-----BEGIN CERTIFICATE-----
SHOULD BE GENERATED
-----END CERTIFICATE-----`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly TAG: string = 'SERVERAPI.SERVICE';

  constructor(
    private http: HttpClient,
    private crypto: CryptoService,
    private logger: LoggerService,
    private keyStorage: AppKeyStorage,
  ) {}

  get<T>(url: string, noCache: boolean = false, token?: string): Observable<T> {
    this.logger.info(this.TAG, 'API Get ' + url);

    const endpoint = Config.apiHost + Config.apiVersion + url;

    // ABDOUS const keys = this.keyStorage.getOrCreate();

    let headers;
    if (token) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        AppKey: Config.appKey,
      });
    } else {
      headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AppKey: Config.appKey,
      });
    }

    if (noCache) {
      headers = headers.append('Cache-control', 'no-cache');
    }

    const options = { headers };

    return this.http.get<APIResponse>(endpoint, options).pipe(
      map((res) => {
        // ABDOUS return this.parseResponse(res, keys) as T;
        return this.parseResponse(res, null) as T;
      }),
    );
  }

  post<T>(url: string, data?: any, token?: string): Observable<T> {
    this.logger.info(this.TAG, 'API Post ' + url);

    const endpoint = Config.apiHost + Config.apiVersion + url;
    const keys = this.keyStorage.getOrCreate();
    const encryption: RequestEncryption = Config.requestEncryption;

    //const body = this.encrypt<T>(data, encryption);
    let headers;
    if (token) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        AppKey: Config.appKey,
      });
    } else {
      headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AppKey: Config.appKey,
      });
    }

    const options = { headers };

    console.log('option post ', options);

    return this.http.post<APIResponse>(endpoint, data, options).pipe(
      map((res) => {
        return this.parseResponse(res, null) as T;
      }),
    );
  }

  private parseResponse(response: APIResponse, appKey: AppKey) {
    if (response.algo === 'none') {
      // plain text
      const data = response.data;
      return JSON.parse(data);
    } else if (response.algo === 'rsa') {
      // rsa encryption
      const data = this.decrypt(response, appKey);

      return JSON.parse(data);
    } else {
      throw Error('Unsupported encryption method ' + response.algo);
    }
  }

  private encrypt<T>(data: T, encryption: RequestEncryption): string {
    if (!data) {
      return undefined;
    }

    const apirequest = new APIRequest();

    if (encryption === 'none') {
      apirequest.data = data;
    } else if (encryption === 'rsa') {
      const dataJson = JSON.stringify(data);

      const pinCert = this.crypto.certificateFromPem(SERVER_PEM_CERT);

      const key = this.crypto.getBytesSync(KEY_SIZE);
      const iv = this.crypto.getBytesSync(SALT_SIZE);

      const encrypted = this.crypto.encrypt(key, iv, dataJson, DEFAULT_ENCRYPT_ITERATIONS, KEY_SIZE, SALT_SIZE);
      const encryptedKey = this.crypto.rsaEncrypt(pinCert.publicKey, key);

      apirequest.data = btoa(encrypted.data);
      apirequest.dataSize = dataJson.length;
      apirequest.key = this.crypto.serializeKey(encryptedKey, iv);
    } else {
      throw Error('Unsupported encryption method ' + encryption);
    }

    const body = JSON.stringify(apirequest);

    return body;
  }

  private decrypt(response: APIResponse, appKeys: AppKey) {
    const encrypted = atob(response.data);
    const keys = this.crypto.deserializeKey(response.key, appKeys.privateKey);
    const key = keys[0];
    const iv = keys[1];
    const data = this.crypto.decrypt(key, iv, encrypted, DEFAULT_ENCRYPT_ITERATIONS, KEY_SIZE, SALT_SIZE);

    return data;
  }
}
