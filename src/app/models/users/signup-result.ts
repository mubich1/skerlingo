import { ApiUser } from '@models/security';

export class SignupResult {
  success: boolean;
  user: ApiUser;
  error: string;
  message: string;
  errors: string[];
}
