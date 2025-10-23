// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// ---------- Config ----------
app.set("trust proxy", true); // so req.ip respects X-Forwarded-For behind nginx/proxy
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Data file (local/dev only) ----------
const VISITOR_DATA_FILE = path.join(__dirname, "visitor-data.json");

// Initialize file if missing
if (!fs.existsSync(VISITOR_DATA_FILE)) {
  const initialData = {
    totalVisitors: 0,              // total page views (visits)
    uniqueVisitors: [],            // persisted as array; stored as Set in memory
    dailyStats: {},                // { 'YYYY-MM-DD': { visits: n, uniques: n } }
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(initialData, null, 2));
}

// ---------- Load, keep in-memory state ----------
function safeReadJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (e) {
    console.error("Error reading JSON:", e);
    return fallback;
  }
}

const diskData = safeReadJSON(VISITOR_DATA_FILE, {
  totalVisitors: 0,
  uniqueVisitors: [],
  dailyStats: {},
  lastUpdated: new Date().toISOString(),
});

const state = {
  totalVisitors: Number(diskData.totalVisitors) || 0,
  uniqueVisitors: new Set(diskData.uniqueVisitors || []),
  dailyStats: diskData.dailyStats || {},
  lastUpdated: diskData.lastUpdated || new Date().toISOString(),
};

// Debounced save to disk
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const toSave = {
        totalVisitors: state.totalVisitors,
        uniqueVisitors: Array.from(state.uniqueVisitors),
        dailyStats: state.dailyStats,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(toSave, null, 2));
    } catch (e) {
      console.error("Error saving visitor data:", e);
    }
  }, 500); // batch quick bursts
}

// Graceful shutdown persist
function persistSync() {
  try {
    const toSave = {
      totalVisitors: state.totalVisitors,
      uniqueVisitors: Array.from(state.uniqueVisitors),
      dailyStats: state.dailyStats,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(toSave, null, 2));
  } catch (e) {
    console.error("Error in final save:", e);
  }
}
process.on("SIGINT", () => { persistSync(); process.exit(0); });
process.on("SIGTERM", () => { persistSync(); process.exit(0); });

// ---------- Helpers ----------
function ymd(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getClientId(req) {
  // Use IP + UA; hash for privacy
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const ua = req.headers["user-agent"] || "unknown";
  const raw = `${ip}|${ua}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// Count a visit (call this for page views, not for every API hit)
function recordVisit(req) {
  const today = ymd();
  const id = getClientId(req);

  // total page views
  state.totalVisitors += 1;

  // uniques
  const wasNew = !state.uniqueVisitors.has(id);
  if (wasNew) state.uniqueVisitors.add(id);

  // daily stats
  if (!state.dailyStats[today]) {
    state.dailyStats[today] = { visits: 0, uniques: 0 };
  }
  state.dailyStats[today].visits += 1;
  if (wasNew) state.dailyStats[today].uniques += 1;

  state.lastUpdated = new Date().toISOString();
  scheduleSave();
}

// ---------- Static files ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- Page view counter middleware ----------
// Count only for GET requests to non-API paths (i.e., actual page views)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    recordVisit(req);
  }
  next();
});

// ---------- Health check ----------
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

// ---------- API: visitor stats ----------
app.get("/api/visitor-stats", (_req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    // dailyStats[today] is stored as { visits: number, uniques: number }
    const todayStats = state.dailyStats[today] || { visits: 0, uniques: 0 };
    res.json({
      totalVisitors: state.totalVisitors,
      uniqueVisitors: state.uniqueVisitors.size,
      todayVisitors: Number(todayStats.visits) || 0,
      todayUniqueVisitors: Number(todayStats.uniques) || 0,
      dailyStats: state.dailyStats,
      lastUpdated: state.lastUpdated,
    });
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    res.status(500).json({ error: "Failed to get visitor statistics" });
  }
});

// ---------- API: users ----------
app.get("/api/users", (_req, res) => {
  try {
    const file = path.join(__dirname, "users.json");
    if (!fs.existsSync(file)) {
      // Optional: return empty list if file absent
      return res.json([]);
    }
    const users = JSON.parse(fs.readFileSync(file, "utf-8"));
    res.json(users);
  } catch (error) {
    console.error("Error reading users.json:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

// ---------- API: login ----------
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, message: "Username and password required" });
    }
    const file = path.join(__dirname, "users.json");
    if (!fs.existsSync(file)) {
      return res.json({ success: false, message: "User database missing" });
    }
    const users = JSON.parse(fs.readFileSync(file, "utf-8"));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// Log process exit events for debugging
process.on('exit', (code) => {
  console.log(`Process exit event with code: ${code}`);
});
process.on('SIGINT', () => {
  console.log('Received SIGINT');
  persistSync();
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  persistSync();
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
