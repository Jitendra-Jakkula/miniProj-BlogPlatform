const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const Post = require("../models/post-model");
const upload = require("../middlewares/multerConfig");
const {
  createPost,
  allPost,
  viewPostById,
  editPost,
  deletePost,
  likePost,
  unlikePost,
  viewByCategory,
} = require("../controllers/postController");
const isLoggedIn = require("../middlewares/isLoggedIn");
// const setUserIfExists = require("../middlewares/setUserIfExists");
const Category = require("../models/category-model");

const validate = require("../middlewares/validate");
const { postSchema } = require("../validations/postValidation");
// router.get("/create",(req,res)=>{
//   res.render("createPost");
// });

router.get("/create", isLoggedIn,async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log(categories);// get all categories
    res.render("createPost", { categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error loading categories");
  }
});
router.post("/create", isLoggedIn, upload.single("coverImage"), validate(postSchema),createPost);
router.get("/", allPost);
router.get("/:id", viewPostById);

// router.get("/:id/edit", isLoggedIn, async (req, res) => {
//   let { id } = req.params;
//   let post = await Post.findById(id);
//   // console.log(req.user.userId);
//   // console.log(post.author);
//   if (!post) {
//     return res.status(404).render("notfound");
//   }

//   if (post.author.toString() !== req.user._id.toString()) {
//     return res.status(403).render("unauthorized"); // Optional view
//   }

//   res.render("editpost", { post });
// });

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let post = await Post.findById(id);

  if (!post) {
    return res.status(404).render("notfound");
  }

  // ensure both are ObjectIds
  const isAuthor = post.author.equals(req.user._id);

  if (!isAuthor) {
    return res.status(403).render("unauthorized");
  }

  res.render("editpost", { post });
});


router.put("/:id", upload.single("coverImage"),isLoggedIn,validate(postSchema), editPost);
router.delete("/:id", isLoggedIn, deletePost);

router.post("/:id/like", isLoggedIn, likePost);
router.post("/:id/unlike", isLoggedIn, unlikePost);

router.get("/categories/:id", viewByCategory);
module.exports = router;
