import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createUserRegistrationNotification } from './notificationController.js';

// Generate Access & Refresh Tokens
const generateTokens = (id, role) => {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d', // Increased from 15m to 7d for production
  });
  
  const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  
  return { accessToken, refreshToken };
};

// Set HTTP-Only Cookies - FIXED for cross-domain production
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Critical fix for cross-domain cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, // MUST be true for cross-domain
    sameSite: 'none', // MUST be 'none' for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    if (user) {
      await createUserRegistrationNotification(user);
      
      const { accessToken, refreshToken } = generateTokens(user.id, user.role);
      setTokenCookies(res, accessToken, refreshToken);
      
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user (ALLOWS BOTH admin AND normal user)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    setTokenCookies(res, accessToken, refreshToken);
    
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );
    
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// @desc    Admin Login (Separate admin panel login)
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin credentials not configured' });
    }
    
    if (email === adminEmail && password === adminPassword) {
      let adminUser = await User.findOne({ email: adminEmail });
      
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Administrator',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
      }
      
      const { accessToken, refreshToken } = generateTokens(adminUser.id, adminUser.role);
      setTokenCookies(res, accessToken, refreshToken);
      
      res.json({
        _id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
};

// @desc    Admin Logout
// @route   POST /api/auth/admin/logout
// @access  Public
export const adminLogout = async (req, res) => {
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Public
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.json({ user: null });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.json({ user: null });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.json({ user: null });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};