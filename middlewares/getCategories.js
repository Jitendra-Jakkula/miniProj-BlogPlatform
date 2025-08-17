const Category = require("../models/category-model");
async function getCategories(req, res, next) {
    try {
        const categories = await Category.find();
        res.locals.categories = categories; // pass to all EJS views
        next(); // very important
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.locals.categories = [];
        next();
    }
}

module.exports = getCategories;
