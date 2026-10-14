// UNSEEN Safe Logger: Strict privacy enforcement - strips secrets, passwords, tokens and sensitive content

const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'token',
  'jwt',
  'secret',
  'trackingsecret',
  'retrievalsecret',
  'cookie',
  'authorization'
];

export function sanitizeLogData(data) {
  if (!data) return data;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(sanitizeLogData);
  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED_PRIVACY_SAFE]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeLogData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  return data;
}

export const logger = {
  info: (message, meta) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? sanitizeLogData(meta) : '');
  },
  warn: (message, meta) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? sanitizeLogData(meta) : '');
  },
  error: (message, error) => {
    const errorDetails = error instanceof Error
      ? { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined }
      : error;
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, sanitizeLogData(errorDetails));
  }
};
