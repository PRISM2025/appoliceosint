const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Load users from users.json
const users = JSON.parse(fs.readFileSync("./users.json", "utf8"));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const userMatch = users.find(user =>
        user.username.trim() === username.trim() &&
        user.password.trim() === password.trim()
    );

    if (userMatch) {
        res.status(200).json({ success: true, message: "✅ Login successful" });
    } else {
        res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }
});

// Optional fallback to index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
