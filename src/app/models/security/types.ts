export type RequestEncryption =
  | 'none' // Plain text (via https if available)
  | 'rsa'; // RSA Encrypted
