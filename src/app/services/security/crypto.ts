import * as forge from 'node-forge';

import { AppKey } from '@models/security';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  /**
   * get p12 as ASN.1 object
   */
  fromAsn1Der(data: string): string {
    return forge.asn1.fromDer(data);
  }

  /**
   * Derives a key from a password.
   *
   * @param password the password as a binary-encoded string of bytes.
   * @param salt the salt as a binary-encoded string of bytes.
   * @param iterations the iteration count, a positive integer.
   * @param length the intended length, in bytes, of the derived key,
   *          (max: 2^32 - 1) * hash length of the PRF.
   * @param md the message digest (or algorithm identifier as a string) to use
   *          in the PRF, defaults to SHA-1.
   * @param [callback(err, key)] presence triggers asynchronous version, called
   *          once the operation completes.
   *
   * @return the derived key, as a binary-encoded string of bytes, for the
   *           synchronous version (if no callback is specified).
   */
  pbkdf2(
    password: string,
    salt: string,
    iterations: number,
    length: number,
    md?: string,
    callback?: (err: string, key: string) => any,
  ): string {
    return forge.pkcs5.pbkdf2(password, salt, iterations, length, md, callback);
  }

  /**
   * decrypt p12 using non-strict parsing mode (resolves some ASN.1 parse errors)
   */
  pkcs12FromAsn1(p12Asn1: string, strict: boolean, password: string): any {
    return forge.pkcs12.pkcs12FromAsn1(p12Asn1, strict, password);
  }

  decode64(data: string): string {
    return forge.util.decode64(data);
  }

  publicKeyToPem(publicKey: any): string {
    return forge.pki.publicKeyToPem(publicKey);
  }

  certificateFromPem(certPem: string): any {
    return forge.pki.certificateFromPem(certPem);
  }

  encryptRsaPrivateKey(privateKey: any, password: any): string {
    return forge.pki.encryptRsaPrivateKey(privateKey, password);
  }

  decryptRsaPrivateKey(privatepem: any, password: string): string {
    return forge.pki.decryptRsaPrivateKey(privatepem, password);
  }

  publicKeyFromPem(publicpem: any): string {
    return forge.pki.publicKeyFromPem(publicpem);
  }

  /**
   * Creates a buffer that stores bytes. A value may be given to put into the
   * buffer that is either a string of bytes or a UTF-16 string that will
   * be encoded using UTF-8 (to do the latter, specify 'utf8' as the encoding).
   *
   * @param [input] the bytes to wrap (as a string) or a UTF-16 string to encode
   *          as UTF-8.
   * @param [encoding] (default: 'raw', other: 'utf8').
   */
  createBuffer(input: string, encoding?: string) {
    return forge.util.createBuffer(input, encoding);
  }

  /**
   * Encrypt data with a public key using RSAES-OAEP
   */
  rsaEncrypt(rsaKey, data) {
    const encrypted = rsaKey.encrypt(data, 'RSA-OAEP');

    return encrypted;
  }

  /**
   * Decrypt data with a public key using RSAES-OAEP
   */
  rsaDecrypt(rsaKey, data) {
    return rsaKey.decrypt(data, 'RSA-OAEP');
  }

  /**
   * Creates an HMAC object that uses the given message digest object.
   * @param key key the key to use as a string, array of bytes, byte buffer,
   *           or null to reuse the previous key.
   * @param data bytes the bytes to update with.
   */
  hmacSha256(key, data) {
    const hmac = forge.hmac.create();
    hmac.start('sha256', key);
    hmac.update(data);
    return hmac.digest();
  }

  /**
   * Creates an HMAC object that uses the given message digest object.
   * @param key key the key to use as a string, array of bytes, byte buffer,
   *           or null to reuse the previous key.
   * @param data bytes the bytes to update with.
   */
  hmacSha1(key, data) {
    const hmac = forge.hmac.create();
    hmac.start('sha1', key);
    hmac.update(data);
    return hmac.digest();
  }

  getMd5(data) {
    const md5 = forge.md.md5.create();
    md5.update(data);
    return md5.digest();
  }

  /**
   * Creates a cipher object that can be used to encrypt data using the given
   * algorithm and key. The algorithm may be provided as a string value for a
   * previously registered algorithm or it may be given as a cipher algorithm
   * API object.
   *
   * @param algorithm the algorithm to use, either a string or an algorithm API
   *          object.
   * @param key the key to use, as a binary-encoded string of bytes or a
   *          byte buffer.
   *
   * @return the cipher.
   */
  createCipher(algorithm, key): forge.cipher.BlockCipher {
    return forge.cipher.createCipher(algorithm, key);
  }

  /**
   * Creates a decipher object that can be used to decrypt data using the given
   * algorithm and key. The algorithm may be provided as a string value for a
   * previously registered algorithm or it may be given as a cipher algorithm
   * API object.
   *
   * @param algorithm the algorithm to use, either a string or an algorithm API
   *          object.
   * @param key the key to use, as a binary-encoded string of bytes or a
   *          byte buffer.
   *
   * @return the cipher.
   */
  createDecipher(algorithm, key) {
    return forge.cipher.createDecipher(algorithm, key);
  }

  getnonce(lenght: number = 16) {
    const entropy = forge.random.getBytesSync(lenght);
    return btoa(entropy);
  }

  getNonceByTime(time: number) {
    const lenght = 16;
    const key = '' + time;
    const entropy = forge.random.getBytesSync(lenght);
    const data = btoa(entropy);
    const digest = this.hmacSha1(key, data);

    return btoa(digest.data);
  }

  randomString(length: number = 16) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Gets random bytes asynchronously. If a native secure crypto API is
   * unavailable, this method tries to make the bytes more unpredictable by
   * drawing from data that can be collected from the user of the browser,
   * eg: mouse movement.
   *
   * @param count the number of random bytes to get.
   *
   * @return the random bytes in a string.
   */
  getBytesSync(lenght: number = 16) {
    return forge.random.getBytesSync(lenght);
  }

  generateKeyPair(bits: number = 2048, e: number = 0x10001): AppKey {
    const rsa = forge.pki.rsa;

    return rsa.generateKeyPair({ bits, e });
  }

  encrypt(password, salt, data, iterations, keySize, saltSize) {
    const entropy = this.pbkdf2(password, salt, iterations, keySize + saltSize);

    const key = entropy.slice(0, keySize);
    const iv = entropy.slice(keySize, keySize + saltSize);
    const utf8buffer = this.createBuffer(data, 'utf8');

    // encrypt some bytes using CBC mode
    // (other modes include: ECB, CFB, OFB, CTR, and GCM)
    // Note: CBC and ECB modes use PKCS#7 padding as default
    const cipher = this.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(utf8buffer);
    cipher.finish();

    return cipher.output;
  }

  decrypt(password, salt, encrypted, iterations, keySize, saltSize) {
    const entropy = this.pbkdf2(password, salt, iterations, keySize + saltSize);

    const key = entropy.slice(0, keySize);
    const iv = entropy.slice(keySize, keySize + saltSize);

    // (other modes include: ECB, CFB, OFB, CTR, and GCM)
    // Note: CBC and ECB modes use PKCS#7 padding as default
    const decipher = this.createDecipher('AES-CBC', key);
    decipher.start({ iv });
    decipher.update(this.createBuffer(encrypted));
    decipher.finish();

    return decipher.output;
  }

  serializeKey(encryptedKey, iv) {
    const key64 = btoa(encryptedKey);
    const iv64 = btoa(iv);

    return key64 + ';' + iv64;
  }

  deserializeKey(encryptedKey, privateKey: string) {
    const values = encryptedKey.split(';');

    const encryptedkey = atob(values[0]);

    const iv = atob(values[1]);
    const key = this.rsaDecrypt(privateKey, encryptedkey);

    return [key, iv];
  }
}
