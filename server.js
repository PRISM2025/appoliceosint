const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Visitor counter data file
const VISITOR_DATA_FILE = path.join(__dirname, "visitor-data.json");

// Password reset data file
const RESET_DATA_FILE = path.join(__dirname, "password-resets.json");

// Initialize password reset data file if it doesn't exist
if (!fs.existsSync(RESET_DATA_FILE)) {
  const initialResetData = {
    resetTokens: {},
    securityQuestions: {
      "ap_dgp": { question: "What is your mother's maiden name?", answer: "andhra" },
      "adgp_l&o": { question: "What city were you born in?", answer: "vijayawada" },
      "dig_l&o": { question: "What is your favorite color?", answer: "blue" },
      "prism": { question: "What is your pet's name?", answer: "police" },
      "sp_nandyal": { question: "What is your mother's maiden name?", answer: "nandyal" },
      "sp_kurnool": { question: "What city were you born in?", answer: "kurnool" },
      "sp_ananthapuram": { question: "What is your favorite color?", answer: "green" },
      "sp_sss": { question: "What is your pet's name?", answer: "service" },
      "sp_kadapa": { question: "What is your mother's maiden name?", answer: "kadapa" },
      "sp_tirupati": { question: "What city were you born in?", answer: "tirupati" },
      "sp_chittor": { question: "What is your favorite color?", answer: "red" },
      "sp_annamayya": { question: "What is your pet's name?", answer: "annamayya" },
      "sp_nellore": { question: "What is your mother's maiden name?", answer: "nellore" },
      "sp_ongole": { question: "What city were you born in?", answer: "ongole" },
      "sp_guntur": { question: "What is your favorite color?", answer: "yellow" },
      "sp_bapatla": { question: "What is your pet's name?", answer: "bapatla" },
      "sp_palnadu": { question: "What is your mother's maiden name?", answer: "palnadu" },
      "sp_krishna": { question: "What city were you born in?", answer: "krishna" },
      "sp_ntr": { question: "What is your favorite color?", answer: "orange" },
      "sp_eluru": { question: "What is your pet's name?", answer: "eluru" },
      "sp_rajamundry": { question: "What is your mother's maiden name?", answer: "rajamundry" },
      "sp_kakinada": { question: "What city were you born in?", answer: "kakinada" },
      "sp_paderu": { question: "What is your favorite color?", answer: "purple" },
      "sp_anakapalli": { question: "What is your pet's name?", answer: "anakapalli" },
      "sp_vizag": { question: "What is your mother's maiden name?", answer: "vizag" },
      "sp_vizianagaram": { question: "What city were you born in?", answer: "vizianagaram" },
      "sp_parvathipuram": { question: "What is your favorite color?", answer: "pink" },
      "sp_srikakulam": { question: "What is your pet's name?", answer: "srikakulam" },
      "sp_westgodavari": { question: "What is your mother's maiden name?", answer: "godavari" },
      "sp_konaseema": { question: "What city were you born in?", answer: "konaseema" }
    }
  };
  fs.writeFileSync(RESET_DATA_FILE, JSON.stringify(initialResetData, null, 2));
}

// Function to get reset data
function getResetData() {
  try {
    const data = JSON.parse(fs.readFileSync(RESET_DATA_FILE, 'utf-8'));
    // Ensure all required properties exist
    if (!data.resetTokens) data.resetTokens = {};
    if (!data.securityQuestions) data.securityQuestions = {};
    return data;
  } catch (error) {
    console.error('Error reading reset data:', error);
    return { 
      resetTokens: {}, 
      securityQuestions: {} 
    };
  }
}

// Function to save reset data
function saveResetData(data) {
  try {
    fs.writeFileSync(RESET_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving reset data:', error);
  }
}

// Function to generate reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Function to clean expired tokens
function cleanExpiredTokens() {
  const resetData = getResetData();
  const now = Date.now();
  
  Object.keys(resetData.resetTokens).forEach(token => {
    if (resetData.resetTokens[token].expires < now) {
      delete resetData.resetTokens[token];
    }
  });
  
  saveResetData(resetData);
}

// Initialize visitor data file if it doesn't exist
if (!fs.existsSync(VISITOR_DATA_FILE)) {
  const initialData = {
    totalVisitors: 0,
    uniqueVisitors: new Set(),
    dailyStats: {},
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Function to get visitor data
function getVisitorData() {
  try {
    const data = JSON.parse(fs.readFileSync(VISITOR_DATA_FILE, 'utf-8'));
    // Convert array back to Set for uniqueVisitors
    data.uniqueVisitors = new Set(data.uniqueVisitors);
    return data;
  } catch (error) {
    console.error('Error reading visitor data:', error);
    return {
      totalVisitors: 0,
      uniqueVisitors: new Set(),
      dailyStats: {},
      lastUpdated: new Date().toISOString()
    };
  }
}

// Function to save visitor data
function saveVisitorData(data) {
  try {
    // Convert Set to array for JSON serialization
    const dataToSave = {
      ...data,
      uniqueVisitors: Array.from(data.uniqueVisitors),
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('Error saving visitor data:', error);
  }
}

// Visitor tracking middleware
app.use((req, res, next) => {
  // Get client IP and user agent for unique identification
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const visitorId = crypto.createHash('sha256').update(clientIP + userAgent).digest('hex');
  
  // Get current date for daily stats
  const today = new Date().toISOString().split('T')[0];
  
  // Load visitor data
  const visitorData = getVisitorData();
  
  // Update total visitors
  visitorData.totalVisitors++;
  
  // Check if this is a unique visitor
  if (!visitorData.uniqueVisitors.has(visitorId)) {
    visitorData.uniqueVisitors.add(visitorId);
  }
  
  // Update daily stats
  if (!visitorData.dailyStats[today]) {
    visitorData.dailyStats[today] = { visitors: 0, uniqueVisitors: new Set() };
  } else {
    // Convert array back to Set for daily unique visitors
    visitorData.dailyStats[today].uniqueVisitors = new Set(visitorData.dailyStats[today].uniqueVisitors);
  }
  
  visitorData.dailyStats[today].visitors++;
  visitorData.dailyStats[today].uniqueVisitors.add(visitorId);
  
  // Convert daily unique visitors Set to array for saving
  const dailyStatsToSave = {};
  Object.keys(visitorData.dailyStats).forEach(date => {
    dailyStatsToSave[date] = {
      visitors: visitorData.dailyStats[date].visitors,
      uniqueVisitors: Array.from(visitorData.dailyStats[date].uniqueVisitors)
    };
  });
  
  // Save updated data
  saveVisitorData({
    ...visitorData,
    dailyStats: dailyStatsToSave
  });
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to get visitor statistics
app.get('/api/visitor-stats', (req, res) => {
  try {
    const visitorData = getVisitorData();
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      totalVisitors: visitorData.totalVisitors,
      uniqueVisitors: visitorData.uniqueVisitors.size,
      todayVisitors: visitorData.dailyStats[today] ? visitorData.dailyStats[today].visitors : 0,
      todayUniqueVisitors: visitorData.dailyStats[today] ? new Set(visitorData.dailyStats[today].uniqueVisitors).size : 0,
      lastUpdated: visitorData.lastUpdated
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ error: 'Failed to get visitor statistics' });
  }
});

// Admin endpoint for detailed visitor statistics
app.get('/api/admin/visitor-details', (req, res) => {
  try {
    const visitorData = getVisitorData();
    
    // Calculate weekly and monthly stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let weeklyVisitors = 0;
    let monthlyVisitors = 0;
    const weeklyUnique = new Set();
    const monthlyUnique = new Set();
    
    Object.keys(visitorData.dailyStats).forEach(dateStr => {
      const date = new Date(dateStr);
      const dayStats = visitorData.dailyStats[dateStr];
      
      if (date >= weekAgo) {
        weeklyVisitors += dayStats.visitors;
        dayStats.uniqueVisitors.forEach(id => weeklyUnique.add(id));
      }
      
      if (date >= monthAgo) {
        monthlyVisitors += dayStats.visitors;
        dayStats.uniqueVisitors.forEach(id => monthlyUnique.add(id));
      }
    });
    
    const detailedStats = {
      totalVisitors: visitorData.totalVisitors,
      uniqueVisitors: visitorData.uniqueVisitors.size,
      weeklyVisitors,
      weeklyUniqueVisitors: weeklyUnique.size,
      monthlyVisitors,
      monthlyUniqueVisitors: monthlyUnique.size,
      dailyStats: visitorData.dailyStats,
      lastUpdated: visitorData.lastUpdated
    };
    
    res.json(detailedStats);
  } catch (error) {
    console.error('Error getting detailed visitor stats:', error);
    res.status(500).json({ error: 'Failed to get detailed visitor statistics' });
  }
});

// Password Reset Routes (Security Question System)

// Check user and get security question
app.post('/api/password-reset/check-user', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.json({ success: false, message: 'Username not found' });
    }
    
    // Get security question
    const resetData = getResetData();
    const securityData = resetData.securityQuestions[username];
    
    if (!securityData) {
      // For existing users without security questions, skip verification entirely
      const resetToken = generateResetToken();
      const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes
      
      resetData.resetTokens[resetToken] = {
        username: username,
        expiresAt: expiresAt,
        type: 'no-verification'
      };
      
      saveResetData(resetData);
      
      return res.json({ 
        success: true, 
        message: 'Existing user verified. You can now set a new password directly.',
        skipVerification: true,
        resetToken: resetToken,
        expiresIn: '15 minutes'
      });
    }
    
    res.json({ 
      success: true, 
      question: securityData.question,
      message: 'User found. Please answer the security question.' 
    });
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify security answer and generate reset token
app.post('/api/password-reset/verify-security', (req, res) => {
  const { username, answer } = req.body;
  
  if (!username || !answer) {
    return res.status(400).json({ success: false, message: 'Username and answer are required' });
  }
  
  try {
    // Clean expired tokens first
    cleanExpiredTokens();
    
    const resetData = getResetData();
    const securityData = resetData.securityQuestions[username];
    
    if (!securityData) {
      return res.json({ success: false, message: 'Security question not found' });
    }
    
    // Verify answer (case-insensitive)
    if (answer.toLowerCase().trim() !== securityData.answer.toLowerCase().trim()) {
      return res.json({ success: false, message: 'Incorrect answer to security question' });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const expirationTime = Date.now() + (15 * 60 * 1000); // 15 minutes
    
    resetData.resetTokens[resetToken] = {
      username: username,
      expires: expirationTime,
      created: Date.now()
    };
    
    saveResetData(resetData);
    
    res.json({ 
      success: true, 
      resetToken: resetToken,
      message: 'Security answer verified successfully.',
      expiresIn: '15 minutes'
    });
    
  } catch (error) {
    console.error('Error verifying security answer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset password with valid token
app.post('/api/password-reset/reset-password', (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;
  
  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  if (newPassword !== confirmPassword) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }
  
  if (newPassword.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  
  try {
    // Clean expired tokens first
    cleanExpiredTokens();
    
    const resetData = getResetData();
    const tokenData = resetData.resetTokens[resetToken];
    
    if (!tokenData) {
      return res.json({ success: false, message: 'Invalid or expired reset token' });
    }
    
    if (tokenData.expires < Date.now()) {
      delete resetData.resetTokens[resetToken];
      saveResetData(resetData);
      return res.json({ success: false, message: 'Reset token has expired' });
    }
    
    // Update user password
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === tokenData.username);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    users[userIndex].password = newPassword;
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Remove used token
    delete resetData.resetTokens[resetToken];
    saveResetData(resetData);
    
    res.json({ 
      success: true, 
      message: 'Password reset successfully. Please login with your new password.'
    });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Password-based authentication for existing users without security questions
app.post('/api/password-reset/verify-password', (req, res) => {
  const { username, currentPassword } = req.body;
  
  if (!username || !currentPassword) {
    return res.status(400).json({ success: false, message: 'Username and current password are required' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.json({ success: false, message: 'Username not found' });
    }
    
    if (user.password !== currentPassword) {
      return res.json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Generate a temporary reset token for password change
    const resetData = getResetData();
    const resetToken = generateResetToken();
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes
    
    resetData.resetTokens[resetToken] = {
      username: username,
      expiresAt: expiresAt,
      type: 'password-auth'
    };
    
    saveResetData(resetData);
    
    res.json({ 
      success: true, 
      message: 'Password verified successfully. You can now set a new password.',
      resetToken: resetToken,
      expiresIn: '15 minutes'
    });
    
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Account update with current password verification
app.post('/api/account-update/verify-password', (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword, confirmPassword } = req.body;
  
  if (!currentUsername || !currentPassword) {
    return res.status(400).json({ success: false, message: 'Current username and password are required' });
  }
  
  if (!newUsername && !newPassword) {
    return res.json({ success: false, message: 'Please specify what to update (username and/or password)' });
  }
  
  if (newPassword && newPassword !== confirmPassword) {
    return res.json({ success: false, message: 'New passwords do not match' });
  }
  
  if (newPassword && newPassword.length < 8) {
    return res.json({ success: false, message: 'New password must be at least 8 characters long' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === currentUsername);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: 'Current username not found' });
    }
    
    if (users[userIndex].password !== currentPassword) {
      return res.json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Check if new username already exists (if updating username)
    if (newUsername && newUsername !== currentUsername) {
      const existingUser = users.find(u => u.username === newUsername);
      if (existingUser) {
        return res.json({ success: false, message: 'New username already exists. Please choose a different username.' });
      }
      users[userIndex].username = newUsername;
    }
    
    // Update password if provided
    if (newPassword) {
      users[userIndex].password = newPassword;
    }
    
    // Save updated users
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Log the update
    const changes = [];
    if (newUsername && newUsername !== currentUsername) changes.push('username');
    if (newPassword) changes.push('password');
    
    logAuditEvent('ACCOUNT_UPDATE', `User ${currentUsername} updated ${changes.join(' and ')}`, {
      oldUsername: currentUsername,
      newUsername: newUsername || currentUsername,
      updatedFields: changes,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: `Account updated successfully. ${changes.join(' and ')} ${changes.length > 1 ? 'have' : 'has'} been changed.`
    });
    
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Account Management Routes

// Pending user registrations (in-memory storage - in production use database)
let pendingRegistrations = {};

// Create new user account request (requires admin approval)
app.post('/api/create-user-request', (req, res) => {
  const { username, password, confirmPassword, securityQuestion, securityAnswer, officerDetails } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !password || !confirmPassword || !securityQuestion || !securityAnswer || !officerDetails) {
    return res.status(400).json({ success: false, message: 'All fields including officer details are required' });
  }
  
  if (!officerDetails.badgeNumber || !officerDetails.department || !officerDetails.rank || !officerDetails.contactNumber) {
    return res.status(400).json({ success: false, message: 'Complete officer verification details are required' });
  }
  
  if (password !== confirmPassword) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }
  
  if (password.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  
  try {
    // Check if username already exists
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    if (users.find(u => u.username === username)) {
      return res.json({ success: false, message: 'Username already exists' });
    }
    
    // Check if already pending
    if (pendingRegistrations[username]) {
      return res.json({ success: false, message: 'Registration request already pending for this username' });
    }
    
    // Create registration request
    const requestId = crypto.randomBytes(16).toString('hex');
    pendingRegistrations[username] = {
      requestId,
      username,
      password,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      officerDetails,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      clientIP
    };
    
    // Log the registration request
    logAdminAction('SYSTEM', 'REGISTRATION_REQUEST', `User: ${username}, Badge: ${officerDetails.badgeNumber}, Dept: ${officerDetails.department}`, clientIP);
    
    res.json({ 
      success: true, 
      message: 'Registration request submitted successfully. Your account will be activated after admin verification. You will be contacted once approved.',
      requestId: requestId
    });
    
  } catch (error) {
    console.error('Error creating registration request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin-only: Create user account directly
app.post('/api/admin/create-user', (req, res) => {
  const { username, password, confirmPassword, securityQuestion, securityAnswer, adminNotes } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !password || !confirmPassword || !securityQuestion || !securityAnswer || !adminNotes) {
    return res.status(400).json({ success: false, message: 'All fields including admin notes are required' });
  }
  
  if (password !== confirmPassword) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }
  
  if (password.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  
  try {
    // Read existing users
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return res.json({ success: false, message: 'Username already exists' });
    }
    
    // Add new user
    users.push({ username, password });
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Add security question
    const resetData = getResetData();
    resetData.securityQuestions[username] = {
      question: securityQuestion,
      answer: securityAnswer.toLowerCase().trim()
    };
    saveResetData(resetData);
    
    logAdminAction('admin', 'USER_CREATED', `User: ${username}. Notes: ${adminNotes}`, clientIP);
    
    res.json({ 
      success: true, 
      message: 'User account created successfully by admin.' 
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    logAdminAction('admin', 'USER_CREATE_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update account using security question
app.post('/api/account-update/verify-user', (req, res) => {
  const { currentUsername, securityAnswer, newUsername, newPassword, confirmPassword } = req.body;
  
  if (!currentUsername || !securityAnswer) {
    return res.status(400).json({ success: false, message: 'Username and security answer are required' });
  }
  
  if (!newUsername && !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide new username or password to update' });
  }
  
  if (newPassword && newPassword !== confirmPassword) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }
  
  if (newPassword && newPassword.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  
  try {
    // Verify security answer
    const resetData = getResetData();
    const securityData = resetData.securityQuestions[currentUsername];
    
    if (!securityData) {
      return res.json({ success: false, message: 'Security question not found for this user' });
    }
    
    if (securityAnswer.toLowerCase().trim() !== securityData.answer.toLowerCase().trim()) {
      return res.json({ success: false, message: 'Incorrect answer to security question' });
    }
    
    // Update user credentials
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === currentUsername);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    // Check if new username already exists
    if (newUsername && newUsername !== currentUsername) {
      const existingUser = users.find(u => u.username === newUsername);
      if (existingUser) {
        return res.json({ success: false, message: 'Username already exists' });
      }
      users[userIndex].username = newUsername;
      
      // Update security question mapping
      resetData.securityQuestions[newUsername] = resetData.securityQuestions[currentUsername];
      delete resetData.securityQuestions[currentUsername];
    }
    
    // Update password if provided
    if (newPassword) {
      users[userIndex].password = newPassword;
    }
    
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    saveResetData(resetData);
    
    let message = 'Account updated successfully.';
    if (newUsername && newPassword) {
      message = 'Username and password updated successfully.';
    } else if (newUsername) {
      message = 'Username updated successfully.';
    } else if (newPassword) {
      message = 'Password updated successfully.';
    }
    
    res.json({ 
      success: true, 
      message: message + ' Please login with your new credentials.'
    });
    
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin credentials and verification codes
const ADMIN_CREDENTIALS = {
  "prism": { 
    password: "#Prism@2025$", 
    department: "admin",
    name: "System Administrator"
  }
};

// Verification codes removed for simplified login

// Admin audit log file
const AUDIT_LOG_FILE = path.join(__dirname, "admin-audit.log");

// Function to log admin actions
function logAdminAction(adminId, action, details, ipAddress) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Admin: ${adminId} | Action: ${action} | Details: ${details} | IP: ${ipAddress}\n`;
  
  try {
    fs.appendFileSync(AUDIT_LOG_FILE, logEntry);
  } catch (error) {
    console.error('Error writing to audit log:', error);
  }
}

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
  
  const token = authHeader.substring(7);
  // Simple token validation (in production, use JWT or similar)
  if (token && token.length > 10) {
    req.adminId = token.split('-')[0]; // Extract admin ID from token
    next();
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
}

// Admin Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { adminId, password, department } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!adminId || !password || !department) {
    logAdminAction(adminId || 'unknown', 'LOGIN_FAILED', 'Missing credentials', clientIP);
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Verify admin credentials
  const admin = ADMIN_CREDENTIALS[adminId];
  if (!admin) {
    logAdminAction(adminId, 'LOGIN_FAILED', 'Invalid admin ID', clientIP);
    return res.json({ success: false, message: 'Invalid admin credentials' });
  }
  
  if (admin.password !== password || admin.department !== department) {
    logAdminAction(adminId, 'LOGIN_FAILED', 'Wrong password or department', clientIP);
    return res.json({ success: false, message: 'Invalid admin credentials' });
  }
  
  // Generate simple session token
  const sessionToken = `${adminId}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  
  logAdminAction(adminId, 'LOGIN_SUCCESS', `Department: ${department}`, clientIP);
  
  res.json({ 
    success: true, 
    token: sessionToken,
    adminName: admin.name,
    message: 'Admin login successful' 
  });
});

// Get user details (admin only)
app.post('/api/admin/get-user-details', (req, res) => {
  const { username } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
  
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    const resetData = getResetData();
    const securityData = resetData.securityQuestions[username];
    
    const userDetails = {
      username: user.username,
      password: user.password,
      securityQuestion: securityData?.question || null,
      securityAnswer: securityData?.answer || null
    };
    
    logAdminAction('admin', 'VIEW_USER_DETAILS', `User: ${username}`, clientIP);
    
    res.json({ 
      success: true, 
      user: userDetails 
    });
    
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ success: false, message: 'Error reading user data' });
  }
});

// Edit user account (admin only)
app.post('/api/admin/edit-user', (req, res) => {
  const { originalUsername, username, password, securityQuestion, securityAnswer, adminNotes } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!originalUsername || !username || !password || !securityQuestion || !securityAnswer || !adminNotes) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  if (password.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === originalUsername);
    
    if (userIndex === -1) {
      logAdminAction('admin', 'EDIT_USER_FAILED', `User not found: ${originalUsername}`, clientIP);
      return res.json({ success: false, message: 'User not found' });
    }
    
    // Check if new username already exists (if username is being changed)
    if (username !== originalUsername) {
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.json({ success: false, message: 'Username already exists' });
      }
    }
    
    // Update user credentials
    users[userIndex].username = username;
    users[userIndex].password = password;
    
    // Save updated users
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Update security question
    const resetData = getResetData();
    
    // Remove old security question if username changed
    if (username !== originalUsername && resetData.securityQuestions[originalUsername]) {
      delete resetData.securityQuestions[originalUsername];
    }
    
    // Add/update security question
    resetData.securityQuestions[username] = {
      question: securityQuestion,
      answer: securityAnswer.toLowerCase().trim()
    };
    
    saveResetData(resetData);
    
    const changes = [];
    if (username !== originalUsername) changes.push('username');
    changes.push('password', 'security question');
    
    const actionDescription = `Updated ${changes.join(', ')} for user: ${originalUsername} -> ${username}. Notes: ${adminNotes}`;
    logAdminAction('admin', 'USER_EDITED', actionDescription, clientIP);
    
    res.json({ 
      success: true, 
      message: `User account updated successfully` 
    });
    
  } catch (error) {
    console.error('Error editing user:', error);
    logAdminAction('admin', 'EDIT_USER_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error updating user account' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const resetData = getResetData();
    
    // Add security question info to users
    const usersWithSecurity = users.map(user => ({
      username: user.username,
      securityQuestion: resetData.securityQuestions[user.username]?.question || null
    }));
    
    logAdminAction('admin', 'VIEW_USERS', `Viewed ${users.length} users`, clientIP);
    
    res.json({ 
      success: true, 
      users: usersWithSecurity,
      totalUsers: users.length 
    });
    
  } catch (error) {
    console.error('Error reading users:', error);
    logAdminAction('admin', 'VIEW_USERS_FAILED', error.message, clientIP);
    res.status(500).json({ success: false, message: 'Error reading user data' });
  }
});

// Reset user account (admin only)
app.post('/api/admin/reset-user', (req, res) => {
  const { username, resetType, newPassword, newSecurityQuestion, newSecurityAnswer, verificationNotes } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !resetType || !verificationNotes) {
    return res.status(400).json({ success: false, message: 'Username, reset type, and verification notes are required' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      logAdminAction('admin', 'RESET_FAILED', `User not found: ${username}`, clientIP);
      return res.json({ success: false, message: 'User not found' });
    }
    
    let actions = [];
    
    // Reset password
    if (resetType === 'password' || resetType === 'both') {
      if (!newPassword || newPassword.length < 8) {
        return res.json({ success: false, message: 'Password must be at least 8 characters long' });
      }
      users[userIndex].password = newPassword;
      actions.push('password reset');
    }
    
    // Reset security question
    if (resetType === 'security' || resetType === 'both') {
      if (!newSecurityQuestion || !newSecurityAnswer) {
        return res.json({ success: false, message: 'Security question and answer are required' });
      }
      
      const resetData = getResetData();
      resetData.securityQuestions[username] = {
        question: newSecurityQuestion,
        answer: newSecurityAnswer.toLowerCase().trim()
      };
      saveResetData(resetData);
      actions.push('security question reset');
    }
    
    // Save updated users
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    const actionDescription = `${actions.join(' and ')} for user: ${username}. Notes: ${verificationNotes}`;
    logAdminAction('admin', 'USER_RESET', actionDescription, clientIP);
    
    res.json({ 
      success: true, 
      message: `User account reset successfully: ${actions.join(' and ')}` 
    });
    
  } catch (error) {
    console.error('Error resetting user:', error);
    logAdminAction('admin', 'RESET_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error resetting user account' });
  }
});

// Delete user (admin only)
app.post('/api/admin/delete-user', (req, res) => {
  const { username, verificationNotes } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !verificationNotes) {
    return res.status(400).json({ success: false, message: 'Username and verification notes are required' });
  }
  
  try {
    // Read users file
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      logAdminAction('admin', 'DELETE_FAILED', `User not found: ${username}`, clientIP);
      return res.json({ success: false, message: 'User not found' });
    }
    
    // Remove user
    users.splice(userIndex, 1);
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Remove security question
    const resetData = getResetData();
    if (resetData.securityQuestions[username]) {
      delete resetData.securityQuestions[username];
      saveResetData(resetData);
    }
    
    logAdminAction('admin', 'USER_DELETED', `User: ${username}. Notes: ${verificationNotes}`, clientIP);
    
    res.json({ 
      success: true, 
      message: `User ${username} deleted successfully` 
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    logAdminAction('admin', 'DELETE_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

// Get pending registration requests (admin only)
app.get('/api/admin/pending-registrations', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    const pending = Object.values(pendingRegistrations).filter(req => req.status === 'pending');
    
    logAdminAction('admin', 'VIEW_PENDING_REGISTRATIONS', `Viewed ${pending.length} pending requests`, clientIP);
    
    res.json({ 
      success: true, 
      requests: pending 
    });
  } catch (error) {
    console.error('Error getting pending registrations:', error);
    res.status(500).json({ success: false, message: 'Error getting pending registrations' });
  }
});

// Approve registration request (admin only)
app.post('/api/admin/approve-registration', (req, res) => {
  const { username, adminNotes } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !adminNotes) {
    return res.status(400).json({ success: false, message: 'Username and admin notes are required' });
  }
  
  try {
    const registration = pendingRegistrations[username];
    if (!registration || registration.status !== 'pending') {
      return res.json({ success: false, message: 'Registration request not found or already processed' });
    }
    
    // Create user account
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
    users.push({ 
      username: registration.username, 
      password: registration.password 
    });
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    // Add security question
    const resetData = getResetData();
    resetData.securityQuestions[registration.username] = {
      question: registration.securityQuestion,
      answer: registration.securityAnswer
    };
    saveResetData(resetData);
    
    // Mark as approved
    registration.status = 'approved';
    registration.approvedAt = new Date().toISOString();
    registration.adminNotes = adminNotes;
    
    logAdminAction('admin', 'REGISTRATION_APPROVED', `User: ${username}, Badge: ${registration.officerDetails.badgeNumber}. Notes: ${adminNotes}`, clientIP);
    
    res.json({ 
      success: true, 
      message: `Registration approved for ${username}` 
    });
    
  } catch (error) {
    console.error('Error approving registration:', error);
    logAdminAction('admin', 'REGISTRATION_APPROVE_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error approving registration' });
  }
});

// Reject registration request (admin only)
app.post('/api/admin/reject-registration', (req, res) => {
  const { username, reason } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!username || !reason) {
    return res.status(400).json({ success: false, message: 'Username and rejection reason are required' });
  }
  
  try {
    const registration = pendingRegistrations[username];
    if (!registration || registration.status !== 'pending') {
      return res.json({ success: false, message: 'Registration request not found or already processed' });
    }
    
    // Mark as rejected
    registration.status = 'rejected';
    registration.rejectedAt = new Date().toISOString();
    registration.rejectionReason = reason;
    
    logAdminAction('admin', 'REGISTRATION_REJECTED', `User: ${username}, Reason: ${reason}`, clientIP);
    
    res.json({ 
      success: true, 
      message: `Registration rejected for ${username}` 
    });
    
  } catch (error) {
    console.error('Error rejecting registration:', error);
    logAdminAction('admin', 'REGISTRATION_REJECT_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error rejecting registration' });
  }
});

// Change admin password (admin only)
app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }
  
  if (newPassword.length < 8) {
    return res.json({ success: false, message: 'New password must be at least 8 characters long' });
  }
  
  // Verify current admin password
  const adminCredentials = ADMIN_CREDENTIALS['prism'];
  if (adminCredentials.password !== currentPassword) {
    logAdminAction('prism', 'PASSWORD_CHANGE_FAILED', 'Incorrect current password', clientIP);
    return res.json({ success: false, message: 'Current password is incorrect' });
  }
  try {
    // Update admin password in memory (in production, update secure storage)
    ADMIN_CREDENTIALS['prism'].password = newPassword;
    
    // Log the password change
    logAdminAction('prism', 'PASSWORD_CHANGED', 'Admin password updated successfully with current password verification', clientIP);
    
    res.json({ 
      success: true, 
      message: 'Admin password changed successfully. Please login with your new password.' 
    });
    
  } catch (error) {
    console.error('Error changing admin password:', error);
    logAdminAction('prism', 'PASSWORD_CHANGE_FAILED', `Error: ${error.message}`, clientIP);
    res.status(500).json({ success: false, message: 'Error changing admin password' });
  }
});

// Get audit logs (admin only)
app.get('/api/admin/audit-logs', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const logs = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
      const logLines = logs.split('\n').filter(line => line.trim() !== '').slice(-100); // Last 100 entries
      
      logAdminAction('admin', 'VIEW_AUDIT_LOGS', 'Accessed audit logs', clientIP);
      
      res.json({ 
        success: true, 
        logs: logLines 
      });
    } else {
      res.json({ 
        success: true, 
        logs: ['No audit logs found'] 
      });
    }
  } catch (error) {
    console.error('Error reading audit logs:', error);
    res.status(500).json({ success: false, message: 'Error reading audit logs' });
  }
});

// Admin session validation
app.post('/api/admin/validate-session', (req, res) => {
  const { token, adminId } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!token || !adminId) {
    return res.json({ success: false, message: 'Token and admin ID required' });
  }
  
  // Basic token validation (in production, use proper JWT or session store)
  if (!token.startsWith(`${adminId}-`) || token.length < 20) {
    logAdminAction(adminId, 'SESSION_INVALID', 'Invalid token format', clientIP);
    return res.json({ success: false, message: 'Invalid session token' });
  }
  
  // Check if admin exists
  const admin = ADMIN_CREDENTIALS[adminId];
  if (!admin) {
    logAdminAction(adminId, 'SESSION_INVALID', 'Admin not found', clientIP);
    return res.json({ success: false, message: 'Admin not found' });
  }
  
  // Extract timestamp from token to check expiry (optional - tokens valid for 24 hours)
  const tokenParts = token.split('-');
  if (tokenParts.length >= 2) {
    const tokenTime = parseInt(tokenParts[1]);
    const currentTime = Date.now();
    const tokenAge = currentTime - tokenTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      logAdminAction(adminId, 'SESSION_EXPIRED', `Token age: ${Math.floor(tokenAge / 1000 / 60)} minutes`, clientIP);
      return res.json({ success: false, message: 'Session expired' });
    }
  }
  
  res.json({ 
    success: true, 
    adminName: admin.name,
    message: 'Session valid' 
  });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  const { adminId } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  logAdminAction(adminId || 'unknown', 'LOGOUT', 'Admin logged out', clientIP);
  
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// Regular Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(path.join(__dirname, "users.json"), "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing users.json:", parseErr);
      return res.status(500).json({ success: false, message: "Invalid user data" });
    }

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
