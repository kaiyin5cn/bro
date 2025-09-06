export class URLValidator {
  private static readonly URL_PATTERN = /^https?:\/\/.+/;
  private static readonly MAX_LENGTH = 2048;
  private static readonly MIN_LENGTH = 10;

  static validate(url: string): { isValid: boolean; error?: string } {
    const trimmed = url.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'URL is required' };
    }
    
    if (trimmed.length < this.MIN_LENGTH) {
      return { isValid: false, error: 'URL too short' };
    }
    
    if (trimmed.length > this.MAX_LENGTH) {
      return { isValid: false, error: 'URL too long (max 2048 characters)' };
    }
    
    if (!this.URL_PATTERN.test(trimmed)) {
      return { isValid: false, error: 'Invalid URL format (must start with http:// or https://)' };
    }
    
    try {
      new URL(trimmed);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
}

export class AuthValidator {
  private static readonly USERNAME_MIN = 3;
  private static readonly USERNAME_MAX = 20;
  private static readonly PASSWORD_MIN = 8;

  static validateUsername(username: string): { isValid: boolean; error?: string } {
    const trimmed = username.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'Username is required' };
    }
    
    if (trimmed.length < this.USERNAME_MIN) {
      return { isValid: false, error: `Username must be at least ${this.USERNAME_MIN} characters` };
    }
    
    if (trimmed.length > this.USERNAME_MAX) {
      return { isValid: false, error: `Username cannot exceed ${this.USERNAME_MAX} characters` };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, underscore, and hyphen' };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Password must contain uppercase, lowercase, and number' };
    }
    
    return { isValid: true };
  }
}

export class DonationValidator {
  private static readonly MIN_ETH = 0.001;
  private static readonly MAX_ETH = 100;

  static validateEthAmount(amount: string): { isValid: boolean; error?: string } {
    if (!amount) {
      return { isValid: false, error: 'ETH amount is required' };
    }
    
    const num = parseFloat(amount);
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Invalid ETH amount' };
    }
    
    if (num <= 0) {
      return { isValid: false, error: 'ETH amount must be greater than 0' };
    }
    
    if (num < this.MIN_ETH) {
      return { isValid: false, error: `Minimum donation is ${this.MIN_ETH} ETH` };
    }
    
    if (num > this.MAX_ETH) {
      return { isValid: false, error: `Maximum donation is ${this.MAX_ETH} ETH` };
    }
    
    return { isValid: true };
  }
}