// Handle logic like:

// Create a post

// Fetch all posts

// Fetch single post by ID

// Edit a post (only by author)

// Delete a post (only by author)
const Post = require("../models/post-model");
const Category = require("../models/category-model");
const { format } = require("timeago.js");

//CREATE POST
module.exports.createPost = async (req, res) => {
  // console.log(req.file);
  const { title, content, coverImage, category } = req.body;

  try {
    const post = new Post({
      title,
      content,
      author: req.user._id, // set by JWT middleware
      category, // store ObjectId from <select>
    });
    if (req.file) {
      post.coverImage = req.file.buffer;
      post.coverImage.contentType = req.file.mimetype;
    }
    await post.save();
    req.flash("success", "Post created successfully!");
    res.redirect(`/posts/${post._id}`);
    // res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Error creating post:", error);
    req.flash("error", "Server error while creating post.");
    res.redirect("/posts");
  }
};

//VIEW ALL
module.exports.allPost = async (req, res) => {
  try {
    let post = await Post.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("author");

    const postsWithTime = post.map((p) => ({
      ...p._doc,
      timeAgo: format(p.createdAt),
    }));

    res.render("posts", { post: postsWithTime });
  } catch (error) {
    console.error("Error fetching posts:", error);
    req.flash("error", "Unable to load posts.");
    res.redirect("/");
  }
};

//VIEW BY ID
module.exports.viewPostById = async (req, res) => {
  const { id } = req.params;

  try {
    // const post = await Post.findById(id);

    const post = await Post.findById(id)
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username profilepic" },
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/posts"); // or send JSON if API
    }
    // console.log("Rendering viewPost → req.user:", req.user);c
    console.log(
      req.user && req.user._id.toString() === post.author._id.toString()
    );
    const postWithTime = {
      ...post._doc,
      timeAgo: format(post.createdAt),
    };

    res.render("viewPost", { post: postWithTime, user: req.user });
  } catch (error) {
    // console.error("Error fetching post by ID:", error);
    req.flash("error", "Error fetching post.");
    res.status(404);
    return res.render("notfound");
    // res.redirect("/posts"); // or send JSON if API
  }
};

//EDIT BY ID
module.exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/posts");
    }

    // Check if current user is the author
    if (!post.author.equals(req.user._id)) {
      req.flash("error", "Unauthorized to edit this post.");
      return res.redirect(`/posts/${id}`);
    }

    post.title = title;
    post.content = content;

    if (req.file) {
      post.coverImage = req.file.buffer;
      post.coverImage.contentType = req.file.mimetype;
    }

    await post.save();

    req.flash("success", "Post updated successfully!");
    res.redirect(`/posts/${id}`);
  } catch (error) {
    console.error("Error updating post:", error);
    req.flash("error", "Server error while updating post.");
    res.redirect("/posts");
  }
};

module.exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      return res.render("notfound"); // Render a 404 page
    }

    // Check if current user is the author
    if (!post.author.equals(req.user._id)) {
      res.status(403);
      return res.render("error", { error: { message: "Unauthorized access." } });
    }

    await post.deleteOne();
    req.flash("success", "Post deleted successfully!");
    res.redirect("/posts");
  } catch (error) {
    console.error("Error deleting post:", error);
    next(error); // triggers your global 500 error handler
  }
};


module.exports.likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/posts");
    }

    if (post.likes.includes(userId)) {
      // 👉 Already liked → remove like (toggle off)
      post.likes = post.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      // 👉 Not liked → add like, and remove unlike if exists
      post.likes.push(userId);
      post.unlikes = post.unlikes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    }

    await post.save();
    res.redirect(`/posts/${id}`);
  } catch (err) {
    console.error("Error in likePost:", err);
    req.flash("error", "Error while liking post.");
    res.redirect("/posts");
  }
};

// ✅ Unlike Post
module.exports.unlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      req.flash("error", "Post not found.");
      return res.status(404).send("Post not found");
    }

    if (post.unlikes.includes(userId)) {
      // 👉 Already unliked → remove unlike (toggle off)
      post.unlikes = post.unlikes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      // 👉 Not unliked → add unlike, and remove like if exists
      post.unlikes.push(userId);
      post.likes = post.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    }

    await post.save();
    res.redirect(`/posts/${id}`);
  } catch (err) {
    console.error("Error in unlikePost:", err);
    req.flash("error", "Error while unliking post.");
    res.redirect("/posts");
  }
};

// VIEW BY CATEGORY
// 1. Make function async
module.exports.viewByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const posts = await Post.find({ category: categoryId })
      .populate("author")
      .populate("category");

    const category = await Category.findById(categoryId);

    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("/posts");
    }

    res.render("viewBycategory", { posts, category });
  } catch (err) {
    console.error("Error in viewByCategory:", err);
    req.flash("error", "Unable to load category posts.");
    res.redirect("/posts");
  }
};
