const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Connect to the main database
mongoose.connect("mongodb://127.0.0.1:27017/bookLogProject");

// SLOT 1: User Collection 
const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, unique: true }, // unique ensures no duplicate usernames
  password: String
}));

// SLOT 2: BookLog Collection 
const BookLog = mongoose.model("BookLog", new mongoose.Schema({
  username: String,
  bookName: String,
  issueDate: String,
  duration: String
}));

// Account Registration
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters long" });
  }
  if (!password || password.trim().length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters long" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Save to the User slot in the database
    await User.create({ username, password });
    res.json({ message: "Account created successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error creating account" });
  }
});

// Login Part
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Look through the User collection to check the info
  const user = await User.findOne({ username: username, password: password });
  
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password!" });
  }

  // If account exist, login
  res.json({ message: "Login successful!", user: user.username });
});

// Save book
app.post("/add-log", async (req, res) => {
  const { username, bookName, issueDate, duration } = req.body;
  await BookLog.create({ username, bookName, issueDate, duration });
  res.json({ message: "Book log saved successfully!" });
});

app.get("/logs/:username", async (req, res) => {
  const logs = await BookLog.find({ username: req.params.username });
  res.json(logs);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
