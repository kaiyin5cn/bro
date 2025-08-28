import { generateShortCode } from '../utils/shortCode.js';

describe('URL Utilities Integration', () => {
  describe('generateShortCode', () => {
    it('should generate valid short codes', () => {
      const shortCode = generateShortCode();
      expect(shortCode).toHaveLength(7);
      expect(shortCode).toMatch(/^[0-9a-zA-Z]{7}$/);
    });

    it('should generate different codes on multiple calls', () => {
      const code1 = generateShortCode();
      const code2 = generateShortCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('URL validation patterns', () => {
    it('should validate common URL patterns', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://github.com/user/repo',
        'http://localhost:3000'
      ];

      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow();
      });
    });

    it('should reject invalid URL patterns', () => {
      const invalidUrls = [
        'not-a-url',
        'invalid-protocol',
        'http://',
        'https://'
      ];

      invalidUrls.forEach(url => {
        expect(() => new URL(url)).toThrow();
      });
    });
  });
});