export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[\r\n\t]/g, ' ').substring(0, 200);
};

export const sanitizeSearchQuery = (query) => {
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};