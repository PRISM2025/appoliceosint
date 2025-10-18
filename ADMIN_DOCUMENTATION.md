# PRISM OSINT Admin Panel Documentation

## 🔐 SECURITY IMPLEMENTATION

### Account Creation Security
- **PUBLIC REGISTRATION DISABLED**: No unauthorized users can create accounts
- **ADMIN APPROVAL REQUIRED**: All account requests require admin verification
- **OFFICER VERIFICATION**: Badge numbers, ranks, departments verified
- **AUDIT TRAIL**: All registration attempts logged with IP addresses

### Access Control Levels
1. **Public Users**: Can only request account access (no direct creation)
2. **Admin Personnel**: Can approve/reject requests and create accounts directly
3. **System Logs**: All actions tracked and monitored

## Admin Credentials

### Administrative Account
```
Admin ID: [CONTACT PRISM TEAM]
Password: [CONTACT PRISM TEAM]
Department: admin
Role: PRISM Administrator
```

⚠️ **SECURITY NOTICE**: Admin credentials are not documented here for security reasons.
Contact PRISM technical team directly for admin access credentials.

### Daily Verification Codes
```
Current Active Codes: [CONTACT PRISM TEAM]
```

⚠️ **SECURITY NOTICE**: Verification codes are rotated regularly.
Contact PRISM administration for current verification codes.

## Admin Panel Features

### 1. User Management
- View all registered users
- Search users by username
- Create new users directly (admin only)
- View security questions (without answers)
- Quick actions for user accounts

### 2. Registration Request Management
- **View Pending Requests**: Review officer verification details
- **Approve Requests**: Create accounts after verification
- **Reject Requests**: Deny access with reasons
- **Officer Details**: Badge numbers, ranks, departments, contact info
- **Status Tracking**: Pending, approved, rejected requests

### 3. Account Reset
- Reset user passwords
- Update security questions
- Both password and security question reset
- Mandatory verification notes for all actions

### 4. User Actions
- **Create User**: Direct account creation by admin
- **Reset Password**: Quick password reset for users
- **Edit User**: View and modify user details
- **Delete User**: Remove user accounts with verification
- **Approve Registration**: Convert pending requests to active accounts

### 5. Security Features
- **Officer Verification**: Badge numbers, ranks, departments
- **Contact Verification**: Official phone numbers required
- **Station/District**: Location verification
- **Admin Notes**: Required for all account operations

### 4. Audit Logs
- All admin actions are logged
- Includes timestamp, admin ID, action type, and IP address
- View last 100 log entries
- Actions logged:
  - Login attempts (success/failure)
  - User resets
  - User deletions
  - System access

### **5. Admin Credentials (For PRISM Team)**
```
⚠️ CLASSIFIED INFORMATION
Admin credentials are provided through secure channels only.
Contact PRISM technical team for access.

Admin ID: [RESTRICTED]
Password: [RESTRICTED]
Department: admin
Verification Codes: [CONTACT PRISM TEAM]
```
- Visitor statistics monitoring
- System status overview
- User data export (placeholder)
- Audit log management

## Security Features

### Authentication Requirements
1. **Admin ID**: Unique identifier for authorized personnel
2. **Password**: Secure password for the admin account
3. **Department**: Must match the assigned department
4. **Verification Code**: Daily rotating 6-digit code

### Verification Process
- All account modifications require verification notes
- Admin actions are logged with IP addresses
- Session tokens for secure access
- Automatic security question verification

### Audit Trail
- Complete logging of all administrative actions
- IP address tracking
- Timestamp recording
- Action details and verification notes

## Usage Instructions

### Accessing Admin Panel
1. Navigate to `/admin-login.html`
2. Enter admin credentials:
   - Admin ID: **[Contact PRISM Team]**
   - Password: **[Contact PRISM Team]**
   - Department: **admin** (PRISM Administration)
   - Current verification code: **[Contact PRISM Team]**
3. Click "Secure Login"

⚠️ **SECURITY**: Admin credentials are provided separately through secure channels.

### Resetting User Accounts
1. Go to "Account Reset" tab
2. Enter username to reset
3. Add verification notes (required)
4. Select reset type:
   - Password Only
   - Security Question Only
   - Both
5. Provide new credentials as needed
6. Submit reset request

### User Management
1. Use "User Management" tab
2. Search or browse all users
3. Use action buttons for quick operations
4. View security questions (answers hidden)

### Viewing Audit Logs
1. Select "Audit Logs" tab
2. Review recent administrative actions
3. Use "Refresh Logs" to update view
4. Last 100 entries displayed

## Security Best Practices

### For Administrators
1. **Never share admin credentials**
2. **Always provide detailed verification notes**
3. **Verify user identity through official channels before resets**
4. **Log out after each session**
5. **Report suspicious activities immediately**

### Verification Requirements
Before resetting any account:
1. **Verify officer identity through official ID**
2. **Confirm department affiliation**
3. **Document verification method in notes**
4. **Get supervisor approval for sensitive accounts**

### Emergency Procedures
1. **Account Lockout**: Contact system administrator
2. **Forgotten Admin Password**: Contact IT department
3. **Suspicious Activity**: Report to cyber crime division
4. **System Issues**: Document and report immediately

## Technical Notes

### File Locations
- User Data: `users.json`
- Security Questions: `password-resets.json`
- Audit Logs: `admin-audit.log`
- Visitor Data: `visitor-data.json`

### API Endpoints
- `/api/admin/login` - Admin authentication
- `/api/admin/users` - User management
- `/api/admin/reset-user` - Account reset
- `/api/admin/delete-user` - User deletion
- `/api/admin/audit-logs` - Audit log access

### Session Management
- Simple token-based authentication
- Session tokens include admin ID and timestamp
- No automatic session expiry (manual logout required)

## Troubleshooting

### Common Issues
1. **Invalid Verification Code**: Check with supervisor for current code
2. **Access Denied**: Verify all credentials match exactly
3. **User Not Found**: Check username spelling and case sensitivity
4. **Reset Failed**: Ensure all required fields are filled

### Contact Information
- **Technical Support**: IT Department
- **Security Issues**: Cyber Crime Division
- **System Administration**: PRISM Technical Team
- **Emergency**: +91-8523817999

---

**⚠️ CONFIDENTIAL DOCUMENT**
This document contains sensitive administrative information. 
Access restricted to authorized police department personnel only.

**Last Updated**: October 18, 2025
**Version**: 1.0
**Document Classification**: RESTRICTED