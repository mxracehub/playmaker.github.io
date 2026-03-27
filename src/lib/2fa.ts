import * as OTPAuth from 'otpauth';

/**
 * Derives a stable Base32 secret for TOTP based on the user's UID.
 * This ensures every user has a unique but persistent secret for the prototype.
 */
export function getSecretForUser(uid: string): string {
  // A simple deterministic way to get 16 Base32 characters from a UID
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  // Use characters from the UID, mapping them to valid Base32 range if needed
  for (let i = 0; i < 16; i++) {
    const charCode = uid.charCodeAt(i % uid.length);
    secret += base32Chars[charCode % 32];
  }
  return secret;
}

/**
 * Validates a 6-digit TOTP code against a user's unique secret.
 */
export function validateTOTP(uid: string, email: string, token: string): boolean {
  const secret = getSecretForUser(uid);
  
  const totp = new OTPAuth.TOTP({
    issuer: 'Playmakers',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  });

  // Validate with a window of 1 (allows previous or next code to account for clock skew)
  const delta = totp.validate({
    token: token,
    window: 1,
  });

  return delta !== null;
}

/**
 * Generates the otpauth URI for QR code generation.
 */
export function getOTPAuthUri(uid: string, email: string): string {
  const secret = getSecretForUser(uid);
  const totp = new OTPAuth.TOTP({
    issuer: 'Playmakers',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  });
  return totp.toString();
}
