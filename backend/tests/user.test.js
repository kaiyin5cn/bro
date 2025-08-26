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