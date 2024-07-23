import { AppKey } from './app-key';

export class AppKeyRsa implements AppKey {
  constructor(key: AppKey) {
    this.privateKey = key.privateKey;
    this.publicKey = key.publicKey;
  }

  privateKey: string;
  publicKey: string;
}
