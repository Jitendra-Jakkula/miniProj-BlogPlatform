const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

async function signupAuth(req, res) {
  try {
    let { fname, username, email, password, bio } = req.body;

    // Check if user already exists
    let existUser = await User.findOne({ email: email });
    if (existUser) {
      req.flash("error", "User already exists! Please login.");
      return res.redirect("/user/signup");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    let user = new User({
      fname,
      username,
      email,
      password: hashedPassword,
      bio,
    });

    if (req.file) {
      user.profilepic = req.file.buffer;
      user.profilepic.contentType = req.file.mimetype;
    }

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    req.flash("success", "Signup successful! Welcome.");
    res.redirect("/posts");

  } catch (err) {
    console.error("Error during signup:", err);
    req.flash("error", "Server error during signup. Please try again.");
    res.redirect("/user/signup");
  }
}

module.exports = signupAuth;
