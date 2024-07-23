import { environment as env } from '@environment';

import { RequestEncryption } from '@models/security';

/**
 * Include config from environment
 * Or declare other static config directly
 * Use this instead of environment in app
 */
export class Config {
  static readonly production: boolean = env.production;

  // Api
  static readonly apiHost: string = env.api;
  static readonly apiVersion: string = env.apiVersion;
  static appKey: string = env.appKey;

  static readonly requestEncryption: RequestEncryption = env.requestEncryption as RequestEncryption;
  static readonly useStaticApiKey: boolean = env.useStaticApiKey;
  static readonly storagePassword: string = env.storagePassword;
}
