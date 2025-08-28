import { generateShortCode } from '../utils/shortCode.js';

describe('generateShortCode', () => {
  it('should generate a 7-character string', () => {
    const shortCode = generateShortCode();
    expect(shortCode).toHaveLength(7);
  });

  it('should only contain alphanumeric characters', () => {
    const shortCode = generateShortCode();
    expect(shortCode).toMatch(/^[0-9a-zA-Z]{7}$/);
  });

  it('should generate unique codes (statistically)', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateShortCode());
    }
    // Should have close to 1000 unique codes (allowing for rare collisions)
    expect(codes.size).toBeGreaterThan(990);
  });

  it('should use all character types', () => {
    const codes = [];
    for (let i = 0; i < 100; i++) {
      codes.push(generateShortCode());
    }
    
    const allChars = codes.join('');
    expect(allChars).toMatch(/[0-9]/); // Contains digits
    expect(allChars).toMatch(/[a-z]/); // Contains lowercase
    expect(allChars).toMatch(/[A-Z]/); // Contains uppercase
  });
});