# OTP Setup Checklist

## ✅ Backend Configuration

### 1. Environment Variables (Required)
Make sure these are set in your backend `.env` file or deployment environment:

```env
EMAIL_USER=harshapolinax@gmail.com
EMAIL_PASS=wwndutezhsluleho
```

**For Local Development:**
- Create/update `ecommerce/backend/.env` file with the above variables

**For Render Deployment:**
1. Go to Render Dashboard → Your Backend Service → Environment
2. Add/Update:
   - `EMAIL_USER` = `harshapolinax@gmail.com`
   - `EMAIL_PASS` = `wwndutezhsluleho` (or `wwnd utez hslu leho` - spaces will be removed automatically)
3. Save and wait for redeployment

### 2. Gmail App Password Setup
If you need to generate a new Gmail App Password:
1. Go to Google Account → Security
2. Enable 2-Step Verification (if not already enabled)
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password (remove spaces)
6. Update `EMAIL_PASS` in your environment variables

## ✅ Testing OTP

### Test Steps:
1. **Start Backend Server:**
   ```bash
   cd ecommerce/backend
   npm install
   npm run dev
   ```

2. **Check Backend Logs:**
   - Look for: `✓ Email server is ready to send messages`
   - When OTP is sent: `✓ Email sent successfully to [email]`

3. **Test from Frontend:**
   - Fill signup form
   - Click "Send OTP"
   - Check email inbox (and spam folder)
   - Enter OTP to verify

### Common Issues & Solutions:

**Issue: "Email credentials are not configured"**
- ✅ Solution: Make sure `EMAIL_USER` and `EMAIL_PASS` are set in `.env` file

**Issue: "Email authentication failed"**
- ✅ Solution: Verify Gmail app password is correct (16 characters, no spaces)
- ✅ Solution: Make sure 2-Step Verification is enabled on Gmail account

**Issue: "Too many OTP requests"**
- ✅ Solution: Wait 15 minutes or use a different email address
- ✅ Solution: Rate limit is 3 requests per 15 minutes

**Issue: OTP not received in email**
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Check backend logs for error messages
- ✅ Verify Gmail account is not locked or restricted

## ✅ Code Features

- ✅ Automatic space removal from email password
- ✅ Email server verification before sending
- ✅ Detailed error logging for debugging
- ✅ Proper error messages for users
- ✅ Rate limiting (3 OTP requests per 15 minutes)
- ✅ OTP expires after 15 minutes
- ✅ Secure - OTP never returned in API response

## ✅ Verification

After setup, you should see in backend logs:
```
✓ Email server is ready to send messages
✓ OTP sent successfully to [email] - Message ID: [id]
```

If you see errors, check the error message for specific issues.

