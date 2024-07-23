import { ApiUser } from '@models/security';

export class CheckProviderResult {
  success: boolean;
  user?: ApiUser;
  message?: string;
}
