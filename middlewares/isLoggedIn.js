const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); 
async function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/user/login"); // or return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const user = await User.findById(decoded.userId); 
      req.user = user;
      res.locals.user = user; 
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.redirect("/user/login");
  }
}

module.exports = isLoggedIn;
