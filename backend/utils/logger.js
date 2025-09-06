import { sanitizeInput } from './sanitizer.js';

const sanitize = sanitizeInput;

export const logger = {
  info: (message, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message: sanitize(message),
      data: sanitizedData
    }));
  },
  
  error: (message, error = null, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message: sanitize(message),
      error: error?.message || error,
      data: sanitizedData
    }));
  },
  
  warn: (message, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.warn(JSON.stringify({
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message: sanitize(message),
      data: sanitizedData
    }));
  }
};