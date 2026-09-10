const express = require('express');
const router = express.Router();
const { authController } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Logout
router.post('/logout', authMiddleware, authController.logout);

// Refresh token
router.post('/refresh', authController.refreshToken);

module.exports = router;
