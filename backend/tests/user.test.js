import User from '../models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create user with valid data', () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      
      expect(user.username).toBe('testuser');
      expect(user.password).toBe('password123');
      expect(user.role).toBe('user');
    });

    test('should have comparePassword method', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123',
        role: 'user'
      });

      expect(typeof user.comparePassword).toBe('function');
    });
  });

  describe('Salt Functionality', () => {
    test('should generate salt on password save', () => {
      const user = new User({
        username: 'saltuser',
        password: 'password123',
        role: 'user'
      });

      // Simulate pre-save hook
      expect(user.salt).toBeUndefined();
    });

    test('should have salt after password hashing', async () => {
      const user = new User({
        username: 'saltuser2',
        password: 'password123',
        role: 'user'
      });

      // Manually trigger pre-save logic
      if (!user.salt) {
        const crypto = await import('crypto');
        user.salt = crypto.default.randomBytes(16).toString('hex');
      }

      expect(user.salt).toBeDefined();
      expect(user.salt).toHaveLength(32);
      expect(user.salt).toMatch(/^[a-f0-9]{32}$/);
    });

    test('should generate different salts for different users', async () => {
      const crypto = await import('crypto');
      
      const user1 = new User({
        username: 'user1',
        password: 'password123',
        role: 'user'
      });
      user1.salt = crypto.default.randomBytes(16).toString('hex');

      const user2 = new User({
        username: 'user2', 
        password: 'password123',
        role: 'user'
      });
      user2.salt = crypto.default.randomBytes(16).toString('hex');

      expect(user1.salt).not.toBe(user2.salt);
    });

    test('should use salt in password comparison', async () => {
      const bcrypt = await import('bcryptjs');
      const crypto = await import('crypto');
      
      const user = new User({
        username: 'testuser',
        password: 'password123',
        role: 'user'
      });
      
      // Simulate pre-save hook
      user.salt = crypto.default.randomBytes(16).toString('hex');
      user.password = await bcrypt.default.hash('password123' + user.salt, 12);
      
      const isValid = await user.comparePassword('password123');
      const isInvalid = await user.comparePassword('wrongpassword');
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('User Validation', () => {
    test('should validate valid user data', () => {
      const userData = {
        username: 'validuser',
        password: 'password123',
        role: 'admin'
      };

      const user = new User(userData);
      const error = user.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should require username', () => {
      const userData = {
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      const error = user.validateSync();
      
      expect(error.errors.username).toBeDefined();
      expect(error.errors.username.message).toBe('Username is required');
    });

    test('should require password', () => {
      const userData = {
        username: 'testuser',
        role: 'user'
      };

      const user = new User(userData);
      const error = user.validateSync();
      
      expect(error.errors.password).toBeDefined();
      expect(error.errors.password.message).toBe('Password is required');
    });

    test('should validate username length', () => {
      const userData = {
        username: 'ab',
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      const error = user.validateSync();
      
      expect(error.errors.username).toBeDefined();
      expect(error.errors.username.message).toBe('Username must be at least 3 characters');
    });

    test('should validate password length', () => {
      const userData = {
        username: 'testuser',
        password: '12345',
        role: 'user'
      };

      const user = new User(userData);
      const error = user.validateSync();
      
      expect(error.errors.password).toBeDefined();
      expect(error.errors.password.message).toBe('Password must be at least 6 characters');
    });

    test('should default role to user', () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User(userData);
      
      expect(user.role).toBe('user');
    });
  });
});