const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user storage - in production use database
const users = new Map();

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }

      if (users.has(email)) {
        return res.status(409).json({ success: false, error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: Date.now().toString(),
        email,
        name: name || email,
        password: hashedPassword,
        createdAt: new Date()
      };

      users.set(email, user);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          token
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }

      const user = users.get(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          token
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  logout: (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
  },

  refreshToken: (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, error: 'Token required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({ success: true, data: { token: newToken } });
    } catch (error) {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }
  }
};

module.exports = { authController };
