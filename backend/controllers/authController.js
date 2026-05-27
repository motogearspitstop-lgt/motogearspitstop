//controllers/authController.js

import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import generateToken, { cookieOptions } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const phoneDigits = String(phone || '').replace(/\D/g, '');

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  if (phoneDigits.length < 10) {
    res.status(400);
    throw new Error('Please enter a valid phone number');
  }

  if (password.length < 6 || !/[a-z]/.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include one lowercase letter');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone: phoneDigits });
  const token = generateToken(res, user._id);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    },
    token
  });
});

// @POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(res, user._id);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    },
    token
  });
});

// @POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions,
    expires: new Date(0)
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
});

// @POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('No account with that email');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'MotoGear Pitstop — Password Reset',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. Valid for 15 minutes.</p>
      <a href="${resetUrl}" style="background:#e11d48;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  });

  res.json({ success: true, message: 'Reset email sent' });
});

// @PUT /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const { password } = req.body;

  if (!password || password.length < 6 || !/[a-z]/.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include one lowercase letter');
  }

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(res, user._id);
  res.json({ success: true, message: 'Password reset successful', token });
});
