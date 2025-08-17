// seedCategories.js
const Category = require("../models/category-model");

const categories = [
  { name: "Tech", description: "Technology news, tips, and reviews" },
  { name: "Finance", description: "Money, investing, and business advice" },
  { name: "Education", description: "Learning resources and academic topics" },
  { name: "Entertainment", description: "Movies, music, games, and fun stuff" },
  { name: "Health", description: "Wellness, fitness, and medical news" },
  { name: "Crypto", description: "Cryptocurrency news and guides" },
  { name: "Other", description: "Everything else" }
];

async function seedCategories() {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(categories);
      console.log("✅ Categories inserted successfully");
    } else {
      console.log("ℹ️ Categories already exist, skipping seeding");
    }
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
}

module.exports = seedCategories;
