const mongoose = require("mongoose");
const seedCategories = require("./intiCategory");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blog-app");
    console.log("MongoDB connected successfully");

    // ✅ Seed only once after connection
    await seedCategories();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = connect;
