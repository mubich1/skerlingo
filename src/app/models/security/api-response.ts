import { RequestEncryption } from './types';

export class APIResponse {
  status: string;
  data: string;
  dataSize: number;
  key: string;
  algo: RequestEncryption;
}
