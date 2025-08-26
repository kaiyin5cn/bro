export const validateUrlInput = (req, res, next) => {
  const { longURL } = req.body;
  
  if (!longURL || typeof longURL !== 'string') {
    return res.status(400).json({ error: 'Valid longURL is required' });
  }
  
  if (longURL.length > 2048) {
    return res.status(400).json({ error: 'URL too long (max 2048 characters)' });
  }
  
  req.body.longURL = longURL.trim();
  next();
};

export const validateAuthInput = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid username and password are required' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  req.body.username = username.trim();
  next();
};

export const validateAdminInput = (req, res, next) => {
  const { longURL } = req.body;
  
  if (longURL && typeof longURL !== 'string') {
    return res.status(400).json({ error: 'Invalid longURL format' });
  }
  
  if (longURL && longURL.length > 2048) {
    return res.status(400).json({ error: 'URL too long (max 2048 characters)' });
  }
  
  if (longURL) {
    req.body.longURL = longURL.trim();
  }
  
  next();
};

export const validateDonationInput = (req, res, next) => {
  const { donorAddress, amount, deviceId, ipfsCID, dataHash } = req.body;
  
  if (!donorAddress || typeof donorAddress !== 'string') {
    return res.status(400).json({ error: 'Valid donor address is required' });
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid donation amount is required' });
  }
  
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'Valid device ID is required' });
  }
  
  if (!ipfsCID || typeof ipfsCID !== 'string' || ipfsCID.length !== 46) {
    return res.status(400).json({ error: 'Valid IPFS CID is required' });
  }
  
  if (!dataHash || typeof dataHash !== 'string') {
    return res.status(400).json({ error: 'Valid data hash is required' });
  }
  
  next();
};