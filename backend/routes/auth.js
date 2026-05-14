import express from 'express';
import User from '../models/User.js';
import { generateToken, auth } from '../middleware/auth.js';

const router = express.Router();

// Login

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 60 * 1000; // 60 seconds

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, hasPassword: !!password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', !!user, user ? { id: user._id, email: user.email, isActive: user.isActive, hasPassword: !!user.password, failedLoginAttempts: user.failedLoginAttempts, lockUntil: user.lockUntil } : null);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or account inactive' });
    }

    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
      const waitSeconds = Math.ceil((user.lockUntil - now) / 1000);
      return res.status(429).json({
        message: `Login attempt exceeded. Please wait ${waitSeconds} second${waitSeconds !== 1 ? 's' : ''} before trying again.`,
        lockoutExpiresAt: user.lockUntil ? user.lockUntil.getTime() : null ? user.lockUntil.getTime() : null
      });
    }

    if (user.lockUntil && user.lockUntil <= now) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }
      await user.save();

      if (user.lockUntil && user.lockUntil > Date.now()) {
        const waitSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
        return res.status(429).json({
          message: `Login attempt exceeded. Please wait ${waitSeconds} second${waitSeconds !== 1 ? 's' : ''} before trying again.`,
          lockoutExpiresAt: user.lockUntil
        });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.failedLoginAttempts || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }
    const token = generateToken(user._id);
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change email address
router.post('/change-email', auth, async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({ message: 'Current password and new email are required' });
    }

    const normalizedEmail = newEmail.toLowerCase().trim();
    if (!normalizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (user.email === normalizedEmail) {
      return res.status(400).json({ message: 'New email must be different from the current email' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email address is already in use' });
    }

    user.email = normalizedEmail;
    await user.save();

    res.json({ message: 'Email updated successfully', email: user.email });
  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
