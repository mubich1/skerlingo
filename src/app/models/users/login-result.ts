import { ApiUser } from '@models/security';

export class LoginResult {
  success: boolean;
  user: ApiUser;
  token: string;
  type: string;
  message: any;
}
