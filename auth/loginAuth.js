const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

async function loginAuth(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "User not found! Please register first.");
      return res.redirect("/user/login");

    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password!");
      return res.redirect("/user/login");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_jwt_secret", // fallback for dev
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      maxAge: 3600000, // 1 hour
    });
req.flash("success", "Logged in successfully!");
    return res.redirect("/posts"); // Always return after response
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Something went wrong! Please try again.");
    return res.redirect("/user/login");
  }
}

module.exports = loginAuth;
