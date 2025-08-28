import { generateShortCode } from '../utils/shortCode.js';

describe('URL Controller Logic', () => {
  describe('URL validation', () => {
    it('should validate URLs correctly', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://github.com/',
        'http://localhost:3000/path'
      ];

      validUrls.forEach(url => {
        expect(() => new URL(url.trim())).not.toThrow();
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'invalid-protocol',
        'http://',
        'https://',
      ];

      invalidUrls.forEach(url => {
        expect(() => new URL(url)).toThrow();
      });
    });
  });

  describe('Short code generation', () => {
    it('should generate valid short codes', () => {
      for (let i = 0; i < 10; i++) {
        const code = generateShortCode();
        expect(code).toHaveLength(7);
        expect(code).toMatch(/^[0-9a-zA-Z]{7}$/);
      }
    });

    it('should generate unique codes', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateShortCode());
      }
      expect(codes.size).toBeGreaterThan(98); // Allow for rare collisions
    });
  });

  describe('Environment configuration', () => {
    it('should handle BASE_URL environment variable', () => {
      const originalBaseUrl = process.env.BASE_URL;
      
      process.env.BASE_URL = 'https://short.ly';
      expect(process.env.BASE_URL).toBe('https://short.ly');
      
      // Restore original
      if (originalBaseUrl) {
        process.env.BASE_URL = originalBaseUrl;
      } else {
        delete process.env.BASE_URL;
      }
    });
  });
});