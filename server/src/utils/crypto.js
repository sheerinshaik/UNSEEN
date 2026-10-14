import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Generate a cryptographically secure, non-sequential report reference.
 * Example: UNS-7K2X-9M4Q-B3F8
 */
export function generateReportReference() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 alphabet (no 0, 1, O, I for human clarity)
  const getRandomChunk = (length = 4) => {
    const bytes = crypto.randomBytes(length);
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars[bytes[i] % chars.length];
    }
    return str;
  };
  return `UNS-${getRandomChunk(4)}-${getRandomChunk(4)}-${getRandomChunk(4)}`;
}

/**
 * Generate a high-entropy private tracking secret.
 * This is given to the submitter ONCE and never stored in plaintext on the server.
 */
export function generateTrackingSecret() {
  const randomBytes = crypto.randomBytes(24).toString('base64url');
  return `sec_${randomBytes}`;
}

/**
 * Hash tracking secret with SHA-256 and HMAC key derived from JWT_SECRET
 */
export function hashTrackingSecret(secret) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Invalid secret provided for hashing');
  }
  return crypto.createHmac('sha256', ENV.JWT_SECRET).update(secret).digest('hex');
}

/**
 * Verify a tracking secret against the stored hash in constant time
 */
export function verifyTrackingSecret(providedSecret, storedHash) {
  if (!providedSecret || !storedHash) return false;
  try {
    const computedHash = hashTrackingSecret(providedSecret);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Password hashing with bcrypt
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
}

/**
 * Password comparison with bcrypt
 */
export async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Sign JWT session token
 */
export function signAuthToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT session token
 */
export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch {
    return null;
  }
}
