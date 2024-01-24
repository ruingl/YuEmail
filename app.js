const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const gradient = require("gradient-string");
const User = require("./database/models/User");
const Email = require("./database/models/Email");
const sequelize = require("./database/connectDB/connectDB");

const app = express();

// Set up Handlebars as the view engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// JWT secret key (replace with a secure key in production)
const secretKey = "your-secret-key";

// Boolean flag to control token requirement
app.use((req, res, next) => {
  // Set needToken for each route
  req.needToken = true; // Set to true to require a token, false to allow without token
  next();
});

// ... (existing code)

// Routes
// Replace User.findAll() with direct SQL query
app.get("/", async (req, res) => {
  try {
    // Check if user is logged in (token is present)
    if (req.needToken && !req.headers["authorization"]) {
      return res.redirect("/intro");
    }

    const [users] = await sequelize.query("SELECT * FROM users");
    res.render("users", { users });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.render("error", { message: "Error retrieving users" });
  }
});

app.get("/intro", (req, res) => {
  res.render("intro");
});

// app.post('/signup' route
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await User.create({ username, password, email });
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.render("error", { message: "Error registering user" });
  }
});

app.get("/compose", (req, res) => {
  res.render("send");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 86400,
      });

      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/uptime", (req, res) => {
  res.status(200).json({ message: "Uptime check passed" });
});

// Signup route
app.get("/signup", (req, res) => {
  req.needToken = false;
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    await User.create({ username, password });
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.render("error", { message: "Error registering user" });
  }
});

// Login route
app.get("/login", (req, res) => {
  req.needToken = false;
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 86400,
      });

      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... (existing code)

// Uptime endpoint
app.get("/uptime", (req, res) => {
  res.status(200).json({ message: "Uptime check passed" });
});

const randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;

// Sync the models with the database
sequelize
  .sync()
  .then(() => {
    console.log(gradient.retro("⟩ YuEMAIL v1.0.0"));
    console.log(
      gradient.rainbow(`⟩ YuEMAIL is using RANDOM PORT: ${randomPort}`),
    );

    // Start the server after syncing
    app.listen(randomPort, () => {
      console.log(
        gradient.rainbow(`Server running at http://localhost:${randomPort}`),
      );
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err.message);
  });
