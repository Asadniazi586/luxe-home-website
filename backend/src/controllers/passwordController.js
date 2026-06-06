import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

console.log('🔵 Loading passwordController...');

// Configure email transporter for Brevo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('🔴 Transporter verification failed:', error);
  } else {
    console.log('🟢 Transporter ready to send emails');
  }
});

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  console.log('🔵 === FORGOT PASSWORD START ===');
  console.log('🔵 Request body:', req.body);
  
  try {
    const { email } = req.body;
    console.log('🔵 Email received:', email);
    
    if (!email) {
      console.log('🔴 No email provided');
      return res.status(400).json({ message: 'Email is required' });
    }
    
    console.log('🔵 Looking for user in database...');
    const user = await User.findOne({ email });
    console.log('🔵 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('🔵 User not found - returning success message for security');
      return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    }
    
    console.log('🔵 User found. Name:', user.name);
    console.log('🔵 User ID:', user._id);
    
    // Check if JWT_RESET_SECRET exists
    if (!process.env.JWT_RESET_SECRET) {
      console.error('🔴 JWT_RESET_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    console.log('🔵 Generating reset token...');
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );
    console.log('🔵 Reset token generated:', resetToken.substring(0, 20) + '...');
    
    console.log('🔵 Saving token to user using updateOne...');
    // USE THIS: Update only the reset token fields, not the entire document
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordToken: resetToken,
          resetPasswordExpire: Date.now() + 3600000
        }
      }
    );
    console.log('🔵 User updated with reset token');
    
    // Check if FRONTEND_URL exists
    if (!process.env.FRONTEND_URL) {
      console.error('🔴 FRONTEND_URL is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('🔵 Reset URL created:', resetUrl);
    
    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 50px auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #D4A574; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 300; color: #2C2C2C; letter-spacing: 2px; }
          .content { padding: 20px 0; }
          .button { display: inline-block; background-color: #2C2C2C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; margin: 20px 0; font-weight: 500; }
          .button:hover { background-color: #D4A574; }
          .footer { text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LUXE HOME</div>
          </div>
          <div class="content">
            <h2 style="color: #2C2C2C; margin-bottom: 20px;">Reset Your Password</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password for your LUXE HOME account.</p>
            <p>Click the button below to create a new password. This link will expire in 1 hour.</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If you didn't request this, please ignore this email or contact support.</p>
            <p>For security, this link can only be used once.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} LUXE HOME. All rights reserved.</p>
            <p>Luxury bedding for your home</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    console.log('🔵 Attempting to send email...');
    console.log('🔵 To:', email);
    console.log('🔵 From:', process.env.EMAIL_FROM);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your LUXE HOME Password',
      html: emailHtml,
    });
    
    console.log('🟢 Email sent successfully!');
    console.log('🟢 Message ID:', info.messageId);
    
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('🔴 Forgot password error:', error.message);
    console.error('🔴 Full error:', error);
    console.error('🔴 Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to send reset email', error: error.message });
  }
};


// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  console.log('🔵 === RESET PASSWORD START ===');
  
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    console.log('🔵 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }
    
    console.log('🔵 User found. Updating password...');
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    // Clear old auth cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    console.log('🟢 Password reset successful! Cookies cleared.');
    res.status(200).json({ message: 'Password reset successful! Please login with your new password.' });
  } catch (error) {
    console.error('🔴 Reset password error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired' });
    }
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};