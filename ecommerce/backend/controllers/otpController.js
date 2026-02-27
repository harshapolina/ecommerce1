import nodemailer from 'nodemailer';
import OTP from '../models/otpModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validatePassword } from '../utils/passwordValidation.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('Email credentials missing. EMAIL_USER:', !!emailUser, 'EMAIL_PASS:', !!emailPass);
    throw new Error('Email credentials (EMAIL_USER and EMAIL_PASS) are not configured in environment variables. Please set them in your .env file or deployment environment.');
  }

  const cleanEmailPass = emailPass.replace(/\s/g, '');

  if (cleanEmailPass.length < 16) {
    console.error('Invalid email password length:', cleanEmailPass.length);
    throw new Error('Invalid email password format. Gmail app passwords should be 16 characters without spaces.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser.trim(),
      pass: cleanEmailPass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  try {
    await transporter.verify();
    console.log('✓ Email server is ready to send messages');
  } catch (verifyError) {
    console.error('✗ Email server verification failed:', verifyError.message);
    if (verifyError.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials.');
    } else if (verifyError.code === 'ECONNECTION') {
      throw new Error('Cannot connect to email server. Please check your internet connection.');
    } else {
      throw new Error(`Email server configuration error: ${verifyError.message}`);
    }
  }

  const mailOptions = {
    from: `"Furniture Store" <${emailUser.trim()}>`,
    to: email.trim(),
    subject: 'OTP for Account Verification - Furniture Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1B6B3A 0%, #2d8650 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Furniture Store</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #1B6B3A; margin-top: 0;">OTP Verification</h2>
          <p style="color: #666; font-size: 16px;">Your OTP for account verification is:</p>
          <div style="background: white; border: 2px solid #1B6B3A; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1B6B3A; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in 15 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully to', email, '- Message ID:', info.messageId);
    return info;
  } catch (sendError) {
    console.error('✗ Failed to send email:', sendError.message);
    if (sendError.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please verify your email credentials.');
    } else if (sendError.code === 'EENVELOPE') {
      throw new Error('Invalid email address. Please check the recipient email.');
    } else {
      throw new Error(`Failed to send email: ${sendError.message}`);
    }
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.errors[0] });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingOTP = await OTP.findOne({ email });
    if (existingOTP) {
      await OTP.deleteOne({ email });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOTP = new OTP({
      email,
      otp,
      name,
      password: hashedPassword
    });

    await newOTP.save();

    try {
      await sendOTPEmail(email, otp);
      res.status(200).json({ 
        success: true,
        message: 'OTP sent to your email',
        email: email
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError.message);
      const errorMessage = emailError.message || 'Failed to send OTP email';
      res.status(500).json({ 
        success: false,
        message: errorMessage.includes('credentials') || errorMessage.includes('authentication') 
          ? 'Email service configuration error. Please contact support.'
          : 'Failed to send OTP email. Please try again in a few moments.',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '30d' }
    );

    await OTP.deleteOne({ email });

    res.status(201).json({
      message: 'Registration successful',
      token,
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

