export class ApiUser {
  username?: string;
  email?: string;
  token: string;
  validity?: string;
}

export interface IGoogleAuthRes {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
}