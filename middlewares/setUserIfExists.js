const jwt = require("jsonwebtoken");

function setUserIfExists(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}

module.exports = setUserIfExists;
