// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/category-model");

// Add a new category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.redirect("/categories"); // Or send JSON if API
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding category");
  }
});

// View all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.render("categories", { categories });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching categories");
  }
});

module.exports = router;
