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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'harshapolinax@gmail.com',
      pass: process.env.EMAIL_PASS || 'gwyd ousq jpbs gjvr'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'harshapolinax@gmail.com',
    to: email,
    subject: 'OTP for Account Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1B6B3A;">Furniture Store - OTP Verification</h2>
        <p>Your OTP for account verification is:</p>
        <h1 style="color: #1B6B3A; font-size: 32px; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 8px;">${otp}</h1>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
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
        message: 'OTP sent to your email',
        email: email
      });
    } catch (emailError) {
      res.status(200).json({ 
        message: 'OTP generated (email sending failed)',
        email: email,
        otp: otp,
        devMode: true,
        error: emailError.message
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

