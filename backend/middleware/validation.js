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

export const validateDonationTracking = (req, res, next) => {
  const { transactionHash, donorAddress, ethAmount, usdAmount } = req.body;
  
  if (!transactionHash || typeof transactionHash !== 'string') {
    return res.status(400).json({ error: 'Valid transaction hash is required' });
  }
  
  if (!donorAddress || typeof donorAddress !== 'string') {
    return res.status(400).json({ error: 'Valid donor address is required' });
  }
  
  if (!ethAmount || isNaN(ethAmount) || ethAmount <= 0) {
    return res.status(400).json({ error: 'Valid ETH amount is required' });
  }
  
  if (!usdAmount || isNaN(usdAmount) || usdAmount < 0) {
    return res.status(400).json({ error: 'Valid USD amount is required' });
  }
  
  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(donorAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }
  
  // Validate transaction hash format
  if (!/^0x[a-fA-F0-9]{64}$/.test(transactionHash)) {
    return res.status(400).json({ error: 'Invalid transaction hash format' });
  }
  
  next();
};

export const validateDonationInput = (req, res, next) => {
  const { donorAddress, ethAmount } = req.body;
  
  if (!donorAddress || typeof donorAddress !== 'string') {
    return res.status(400).json({ error: 'Valid donor address is required' });
  }
  
  if (!ethAmount || isNaN(ethAmount) || ethAmount <= 0) {
    return res.status(400).json({ error: 'Valid ETH amount is required' });
  }
  
  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(donorAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }
  
  next();
};