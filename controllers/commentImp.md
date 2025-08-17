
// module.exports.likePost = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   try {
//     const post = await Post.findById(id);

//     if (post.likes.includes(userId)) {
//       // 👉 Already liked → remove like (toggle off)
//       post.likes = post.likes.filter(uid => uid.toString() !== userId);
//     } else {
//       // 👉 Not liked → add like, and remove unlike if exists
//       post.likes.push(userId);
//       post.unlikes = post.unlikes.filter(uid => uid.toString() !== userId);
//     }
//     await post.save();
//     res.redirect(`/posts/${id}`);
//   } catch (err) {
//     console.error("Error in likePost:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// module.exports.unlikePost = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;

//   try {
//     const post = await Post.findById(id);

//     if (post.unlikes.includes(userId)) {
//       // 👉 Already unliked → remove unlike (toggle off)
//       post.unlikes = post.unlikes.filter(uid => uid.toString() !== userId);
//     } else {
//       // 👉 Not unliked → add unlike, and remove like if exists
//       post.unlikes.push(userId);
//       post.likes = post.likes.filter(uid => uid.toString() !== userId);
//     }


//     await post.save();
//     res.redirect(`/posts/${id}`);
//   } catch (err) {
//     console.error("Error in unlikePost:", err);
//     res.status(500).send("Something went wrong");
//   }
// };


 
# BOLIER PKATR  LINE 109
 <div class="cont-pad" style="padding-top: 4rem;"> 
        <%-body %>
    </div> 




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
