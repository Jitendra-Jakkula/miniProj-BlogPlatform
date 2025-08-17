//create , update, fetch and delete comment
const Post = require("../models/post-model");
const Comment = require("../models/comments-model");
module.exports.addComment = async (req, res) => {
  let { id } = req.params;
  let { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      content:text,
    });

    post.comments.push(comment._id);
    post.commentsCount = post.comments.length;
     await post.save();
    //  res.status(201).json({ message: "Comment added", comment });
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
