// Test: shortCode generation utility
const { generateShortCode } = require('../utils/shortCode.cjs');

describe('generateShortCode', () => {
  // Test: Should generate a string of exactly 7 characters
  test('should generate 7-character string', () => {
    const shortCode = generateShortCode();
    expect(shortCode).toHaveLength(7);
  });

  // Test: Should only contain valid base62 characters (0-9, a-z, A-Z)
  test('should contain only valid base62 characters', () => {
    const shortCode = generateShortCode();
    const validChars = /^[0-9a-zA-Z]+$/;
    expect(shortCode).toMatch(validChars);
  });

  // Test: Should generate different codes on multiple calls (randomness check)
  test('should generate different codes', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    // With 62^7 possibilities, 100 calls should be unique
    expect(codes.size).toBe(100);
  });

  // Test: Should be deterministic in length across multiple generations
  test('should consistently generate 7-character codes', () => {
    for (let i = 0; i < 10; i++) {
      const shortCode = generateShortCode();
      expect(shortCode).toHaveLength(7);
    }
  });
});