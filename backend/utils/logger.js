const sanitize = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[\r\n\t]/g, ' ').substring(0, 200);
};

export const logger = {
  info: (message, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.log(`[INFO] ${sanitize(message)}`, sanitizedData);
  },
  
  error: (message, error = null, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.error(`[ERROR] ${sanitize(message)}`, {
      error: error?.message || error,
      ...sanitizedData
    });
  },
  
  warn: (message, data = {}) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitize(value)])
    );
    console.warn(`[WARN] ${sanitize(message)}`, sanitizedData);
  }
};