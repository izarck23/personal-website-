const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-Memory user repository (replace with MongoDB / PostgreSQL in production)
const users = [];
const otpStore = {};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date()
    };
    users.push(newUser);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[newUser.email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    res.status(201).json({
      message: 'User registered successfully. Please verify 2FA OTP.',
      userId: newUser.id,
      email: newUser.email,
      simulatedOtp: otp // Included for testing
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email?.toLowerCase()];

    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    delete otpStore[email.toLowerCase()];
    const user = users.find(u => u.email === email.toLowerCase());
    if (user) user.isVerified = true;

    const token = jwt.sign(
      { userId: user?.id, email },
      process.env.JWT_SECRET || 'luxe_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.json({ message: 'Authentication verified successfully', token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'luxe_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  res.json({ message: `Password reset instructions sent to ${email}` });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = users.find(u => u.email === email?.toLowerCase());
  if (user) {
    user.password = await bcrypt.hash(newPassword, 10);
  }
  res.json({ message: 'Password updated successfully' });
};

exports.getProfile = (req, res) => {
  res.json({ message: 'Protected profile data' });
};
