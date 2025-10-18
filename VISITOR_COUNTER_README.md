# Visitor Counter Implementation

## Overview
A comprehensive visitor tracking system has been implemented for your OSINT website to monitor site usage and visitor statistics.

## Features

### 📊 Real-time Visitor Tracking
- **Total Visits**: Counts every page load/visit to the site
- **Unique Visitors**: Tracks unique visitors based on IP + User Agent hash
- **Daily Statistics**: Maintains daily visitor counts and unique visitors
- **Persistent Storage**: Uses JSON file-based storage (`visitor-data.json`)

### 🎯 Display Locations
1. **Main Login Page** (`index.html`): Shows visitor stats in the footer
2. **Dashboard Page** (`dashboard.html`): Enhanced analytics display in main content area
3. **Admin Analytics Page** (`admin-analytics.html`): Detailed analytics dashboard

### 🔄 Auto-Refresh
- Statistics automatically refresh every 30 seconds on user pages
- Admin dashboard refreshes every 60 seconds
- Real-time updates without page reload

## File Structure
```
├── server.js (Updated with visitor tracking middleware)
├── visitor-data.json (Auto-generated visitor database)
├── public/
    ├── index.html (Updated with visitor counter display)
    ├── dashboard.html (Updated with enhanced visitor stats)
    └── admin-analytics.html (New admin analytics page)
```

## API Endpoints

### `/api/visitor-stats`
Returns basic visitor statistics for public display:
```json
{
  "totalVisitors": 1234,
  "uniqueVisitors": 567,
  "todayVisitors": 89,
  "todayUniqueVisitors": 45,
  "lastUpdated": "2025-01-18T10:30:00.000Z"
}
```

### `/api/admin/visitor-details`
Returns detailed statistics for admin dashboard:
```json
{
  "totalVisitors": 1234,
  "uniqueVisitors": 567,
  "weeklyVisitors": 234,
  "weeklyUniqueVisitors": 123,
  "monthlyVisitors": 890,
  "monthlyUniqueVisitors": 345,
  "dailyStats": {
    "2025-01-18": {
      "visitors": 89,
      "uniqueVisitors": ["hash1", "hash2", ...]
    }
  },
  "lastUpdated": "2025-01-18T10:30:00.000Z"
}
```

## How It Works

1. **Visitor Identification**: Each visitor gets a unique hash based on their IP address and User Agent
2. **Middleware Tracking**: Every request is automatically tracked via Express middleware
3. **Data Storage**: Visitor data is stored in `visitor-data.json` with the following structure:
   - Total visitors count
   - Set of unique visitor hashes
   - Daily statistics breakdown
   - Last updated timestamp
4. **Display Integration**: Frontend JavaScript fetches stats via API and updates the display

## Privacy & Security
- No personal information is stored
- Visitor identification uses one-way SHA-256 hashing
- Only aggregated statistics are displayed
- Data is stored locally on your server

## Access Points
- **Main Site**: http://localhost:3000
- **Admin Analytics**: http://localhost:3000/admin-analytics.html

## Technical Details
- **Backend**: Node.js with Express middleware
- **Storage**: File-based JSON storage
- **Frontend**: Vanilla JavaScript with automatic refresh
- **Styling**: Responsive CSS with gradient designs
- **Security**: SHA-256 hashing for visitor anonymization

## Customization
You can easily customize:
- Refresh intervals (currently 30s for user pages, 60s for admin)
- Display styling and colors
- Additional metrics and tracking parameters
- Storage method (can be upgraded to database if needed)

The visitor counter is now fully functional and will start tracking visitors immediately!