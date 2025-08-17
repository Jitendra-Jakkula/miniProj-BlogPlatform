const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // import your User model

async function setUser(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

      // Fetch full user from DB
      const user = await User.findById(decoded.userId); 
      req.user = user;
      res.locals.user = user; // make user available in EJS

    } catch (err) {
      console.warn("Invalid JWT:", err.message);
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
}

module.exports = setUser;
