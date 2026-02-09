# Environment Variables Setup Guide

This guide explains all the environment variables needed for the e-commerce application.

## Backend Environment Variables

Create a file named `.env` in the `ecommerce/backend/` directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://harshapolina1_db_user:hvs2006@project-1.jscyy6f.mongodb.net/?appName=Project-1

# Server Port
PORT=5000

# JWT Secret Key for authentication (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Razorpay Configuration
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_SBjgUiAL2qDOF8
RAZORPAY_KEY_SECRET=iP25EvoBTClrR3lJchcbXbsc

# Email Configuration (for OTP)
# For Gmail, use App Password from Google Account settings
EMAIL_USER=harshapolinax@gmail.com
EMAIL_PASS=gwyd ousq jpbs gjvr


## Frontend Environment Variables

Create a file named `.env` or `.env.local` in the `ecommerce/frontend/` directory with the following variables:

```env
# Razorpay Key ID (public key)
VITE_RAZORPAY_KEY_ID=rzp_test_SBjgUiAL2qDOF8
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

## Setup Instructions

### Backend Setup:

1. Navigate to `ecommerce/backend/` directory
2. Create a file named `.env`
3. Copy the backend environment variables above
4. Replace placeholder values with your actual credentials
5. Save the file

### Frontend Setup:

1. Navigate to `ecommerce/frontend/` directory
2. Create a file named `.env` or `.env.local`
3. Copy the frontend environment variables above
4. Replace placeholder values with your actual credentials
5. Save the file
6. Restart your frontend development server

## Important Notes:

- **Never commit `.env` files to Git** - They contain sensitive information
- The `.env` files are already in `.gitignore`
- Use `.env.example` files as templates (without actual credentials)
- For production, use secure environment variable management (like Vercel, Heroku, etc.)

## Variable Descriptions:

- **MONGODB_URI**: Your MongoDB connection string
- **PORT**: Backend server port (default: 5000)
- **JWT_SECRET**: Secret key for JWT token generation (use a strong random string)
- **RAZORPAY_KEY_ID**: Your Razorpay public key (starts with `rzp_test_` or `rzp_live_`)
- **RAZORPAY_KEY_SECRET**: Your Razorpay secret key
- **EMAIL_USER**: Gmail address for sending OTP emails
- **EMAIL_PASS**: Gmail App Password (not your regular password)
- **VITE_RAZORPAY_KEY_ID**: Same as RAZORPAY_KEY_ID, for frontend use

## Getting Gmail App Password:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use that 16-character password (with spaces removed) as EMAIL_PASS

