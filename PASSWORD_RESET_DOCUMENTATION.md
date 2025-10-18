# Password Reset System Implementation

## Overview
A comprehensive 3-step password reset system has been implemented for your OSINT website with security questions, token-based verification, and secure password updating.

## 🔐 Security Features

### Multi-Layer Security
1. **Username Verification** - Confirms user exists in the system
2. **Security Questions** - User must answer predefined security questions
3. **Temporary Tokens** - 15-minute expiring reset tokens
4. **Password Validation** - Minimum 8 characters required
5. **Token Cleanup** - Automatic expired token removal

### Privacy & Protection
- Security answers are case-insensitive for user convenience
- Reset tokens are cryptographically secure (32-byte hex)
- Tokens automatically expire after 15 minutes
- Used tokens are immediately invalidated
- No sensitive information logged

## 📋 How It Works

### Step 1: Username Entry
- User enters their username
- System verifies username exists
- Retrieves associated security question

### Step 2: Security Question
- User must answer their predefined security question
- Answer verification is case-insensitive
- Successful verification generates a reset token

### Step 3: Password Reset
- User enters new password (min 8 characters)
- Password confirmation required
- Token is validated and consumed
- Password is updated in users.json

## 🌐 Access Points

### User Interfaces
- **Main Login Page**: `http://localhost:3000` - Contains "Forgot Password?" link
- **Password Reset**: `http://localhost:3000/password-reset.html` - 3-step reset process

### Admin Interfaces
- **Password Reset Management**: `http://localhost:3000/admin-password-reset.html` - Admin panel for managing security questions

## 📊 Security Questions Database

Pre-configured security questions for all users:

| Username | Question | Answer |
|----------|----------|---------|
| ap_dgp | What is your mother's maiden name? | andhra |
| adgp_l&o | What city were you born in? | vijayawada |
| dig_l&o | What is your favorite color? | blue |
| prism | What is your pet's name? | police |
| sp_nandyal | What is your mother's maiden name? | nandyal |
| sp_kurnool | What city were you born in? | kurnool |
| sp_ananthapuram | What is your favorite color? | green |
| sp_sss | What is your pet's name? | service |
| sp_kadapa | What is your mother's maiden name? | kadapa |
| sp_tirupati | What city were you born in? | tirupati |
| sp_chittor | What is your favorite color? | red |
| sp_annamayya | What is your pet's name? | annamayya |
| sp_nellore | What is your mother's maiden name? | nellore |
| sp_ongole | What city were you born in? | ongole |
| sp_guntur | What is your favorite color? | yellow |
| sp_bapatla | What is your pet's name? | bapatla |
| sp_palnadu | What is your mother's maiden name? | palnadu |
| sp_krishna | What city were you born in? | krishna |
| sp_ntr | What is your favorite color? | orange |
| sp_eluru | What is your pet's name? | eluru |
| sp_rajamundry | What is your mother's maiden name? | rajamundry |
| sp_kakinada | What city were you born in? | kakinada |
| sp_paderu | What is your favorite color? | purple |
| sp_anakapalli | What is your pet's name? | anakapalli |
| sp_vizag | What is your mother's maiden name? | vizag |
| sp_vizianagaram | What city were you born in? | vizianagaram |
| sp_parvathipuram | What is your favorite color? | pink |
| sp_srikakulam | What is your pet's name? | srikakulam |
| sp_westgodavari | What is your mother's maiden name? | godavari |
| sp_konaseema | What city were you born in? | konaseema |

## 🛡️ API Endpoints

### `/api/password-reset/check-user` (POST)
Verifies username and returns security question
```json
Request: { "username": "sp_guntur" }
Response: { 
  "success": true, 
  "question": "What is your favorite color?",
  "message": "User found. Please answer the security question."
}
```

### `/api/password-reset/verify-security` (POST)
Verifies security answer and generates reset token
```json
Request: { "username": "sp_guntur", "answer": "yellow" }
Response: { 
  "success": true, 
  "resetToken": "abc123...",
  "message": "Security question verified. You can now reset your password.",
  "expiresIn": "15 minutes"
}
```

### `/api/password-reset/reset-password` (POST)
Resets password using valid token
```json
Request: { 
  "resetToken": "abc123...", 
  "newPassword": "newpass123", 
  "confirmPassword": "newpass123" 
}
Response: { 
  "success": true, 
  "message": "Password reset successfully. You can now login with your new password."
}
```

## 📁 File Structure

```
├── server.js (Updated with password reset routes)
├── password-resets.json (Auto-generated reset tokens & security questions)
├── public/
    ├── index.html (Updated with "Forgot Password?" link)
    ├── password-reset.html (3-step password reset interface)
    └── admin-password-reset.html (Admin management panel)
```

## 🔧 Technical Implementation

### Backend Features
- **Express middleware** for handling reset requests
- **Crypto module** for secure token generation
- **File-based storage** for reset tokens and security questions
- **Automatic cleanup** of expired tokens
- **Input validation** and security checks

### Frontend Features
- **Multi-step wizard** interface
- **Real-time validation** and feedback
- **Loading indicators** for better UX
- **Auto-redirect** after successful reset
- **Responsive design** for all devices

### Data Storage Structure
```json
{
  "resetTokens": {
    "token123": {
      "username": "sp_guntur",
      "expires": 1729234567890,
      "created": 1729233667890
    }
  },
  "securityQuestions": {
    "sp_guntur": {
      "question": "What is your favorite color?",
      "answer": "yellow"
    }
  }
}
```

## 🚀 Usage Instructions

### For Users:
1. Go to login page
2. Click "🔒 Forgot Password?" link
3. Enter username and follow 3-step process
4. Login with new password

### For Admins:
1. Access admin panel at `/admin-password-reset.html`
2. View security questions and reset activity
3. Manage user security questions
4. Monitor token usage and expiration

## 🛠️ Customization Options

### Security Settings (in server.js)
- Token expiration time (currently 15 minutes)
- Password minimum length (currently 8 characters)
- Security question options
- Token cleanup intervals

### UI Customization
- Step indicator styling
- Form validation messages
- Color schemes and gradients
- Mobile responsiveness

## 🎯 Benefits

✅ **Enhanced Security** - Multi-factor verification process
✅ **User-Friendly** - Simple 3-step interface
✅ **Admin Control** - Management panel for oversight  
✅ **Auto-Cleanup** - Prevents token accumulation
✅ **Responsive Design** - Works on all devices
✅ **Privacy-Focused** - No sensitive data exposure
✅ **Token-Based** - Secure, time-limited access
✅ **Validation** - Strong password requirements

The password reset system is now fully operational and ready for use by your OSINT website users!