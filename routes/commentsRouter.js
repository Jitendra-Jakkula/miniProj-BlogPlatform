// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { addComment } = require("../controllers/commentController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/posts/:id/comment",isLoggedIn , addComment);

module.exports = router;