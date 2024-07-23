import { Injectable } from '@angular/core';

import { Config } from '@config';
import { AppKey, AppKeyRsa } from '@models/security';
import { CryptoService } from '../crypto';

const HAS_RSA_KEY = 'HAS_KEY';
const RSA_PRIVATE_KEY = 'RSA_RIVATE_KEY';
const RSA_PUBLIC_KEY = 'RSA_PUBLIC_KEY';

const rsaKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
SHOULD BE GENERATED
-----END ENCRYPTED PRIVATE KEY-----`;

const rsaPub = `-----BEGIN PUBLIC KEY-----
SHOULD BE GENERATED FROM PRIVATE
-----END PUBLIC KEY-----`;

@Injectable({
  providedIn: 'root',
})
export class AppKeyStorage {
  private appKeyPair: AppKey;

  constructor(private crypto: CryptoService) {}

  public getOrCreate(): AppKey {
    if (this.appKeyPair) {
      return this.appKeyPair;
    }

    const storedKey = this.get();

    if (storedKey) {
      this.appKeyPair = new AppKeyRsa(storedKey);
    } else if (Config.useStaticApiKey) {
      // create api key from static values
      this.appKeyPair = this.AppKeyFromPem(rsaPub, rsaKey, Config.storagePassword);
      this.set(this.appKeyPair);
    } else {
      // generate new key pair
      const newKeys = this.crypto.generateKeyPair();
      this.appKeyPair = new AppKeyRsa(newKeys);
      this.set(this.appKeyPair);
    }

    return this.appKeyPair;
  }

  public get(): AppKey {
    const hasKey = window.localStorage[HAS_RSA_KEY] || false;

    if (!hasKey) {
      return undefined;
    }

    const privatepem = window.localStorage[RSA_PRIVATE_KEY];
    const publicpem = window.localStorage[RSA_PUBLIC_KEY];

    // TODO: secure local storage
    return this.AppKeyFromPem(publicpem, privatepem, Config.storagePassword);
  }

  private AppKeyFromPem(publicpem: string, privatepem: string, password: string) {
    const publicKey = this.crypto.publicKeyFromPem(publicpem);
    const privateKey = this.crypto.decryptRsaPrivateKey(privatepem, password);
    return { publicKey, privateKey };
  }

  public set(Keypair: AppKey): void {
    // convert a Forge public key to PEM-format
    const publicpem = this.crypto.publicKeyToPem(Keypair.publicKey);
    // convert a Forge private key to PEM-format
    // (preferred method if you don't want encryption)
    const privatepem = this.crypto.encryptRsaPrivateKey(Keypair.privateKey, Config.storagePassword);
    window.localStorage[RSA_PUBLIC_KEY] = publicpem;
    window.localStorage[RSA_PRIVATE_KEY] = privatepem;
    window.localStorage[HAS_RSA_KEY] = 'true';
  }
}
