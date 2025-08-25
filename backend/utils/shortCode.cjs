const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateShortCode() {
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += CHARS[Math.floor(Math.random() * 62)];
  }
  return result;
}

module.exports = { generateShortCode };