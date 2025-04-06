const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/service");
const wishlistRoutes = require("./routes/wishlist");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
const pagesRoutes = require("./routes/pages");

dotenv.config();
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "✅ Loaded" : "❌ MISSING");

const app = express();

// DB Connection
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);
app.use("/", serviceRoutes);
app.use("/", wishlistRoutes);
app.use("/", bookingRoutes);
app.use("/", adminRoutes);
app.use("/", pagesRoutes);

// Home Page Route
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to Wave Rider" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
