const Post = require("../models/post-model");
const User = require("../models/user-model");

module.exports.getLogin = (req, res) => {
  res.render("login");
};

module.exports.getSignup = (req, res) => {
  res.render("signup");
};
module.exports.logout = (req, res) => {
  res.clearCookie("token");
   req.flash("success", "You have been logged out successfully.");
  res.redirect("/user/login");
};

module.exports.viewProfile = async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId);
    let post = await Post.find({ author: userId });
    res.render("viewProfile", { user, post });
  } catch (err) {
    req.flash("error", "Error loading profile.");
    res.redirect("/");
  }
};

module.exports.getEditProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if logged-in user is the same as the profile being edited
    if (req.user._id.toString() !== id) {
      req.flash("error", "Unauthorized access!");
      return res.redirect("/user/profile");
    }

    const user = await User.findById(id).lean(); // lean() returns plain JS object
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/user/profile");
    }

    res.render("editProfile", { user }); // send user data to EJS

  } catch (err) {
    req.flash("error", "Server error while editing profile.");
    res.redirect("/user/profile");
  }
}

module.exports.editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id); // ✅ await is required

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/user/profile");
    }

    const { fname, email, bio } = req.body;

    // Update fields
    user.fname = fname;
    user.email = email;
    user.bio = bio;

    // Update profile picture if uploaded
    if(req.file){
    user.profilepic = req.file.buffer;
    user.profilepic.contentType =  req.file.mimetype;
  }

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/user/profile");

    // Redirect or render profile page after saving
    // res.redirect("/user/profile"); // or wherever you want
  } catch (err) {
    console.error("Error updating profile:", err);
    req.flash("error", "Server error while updating profile.");
    res.redirect("/user/profile");
  }
};

module.exports.getUserPosts = async (req, res) => {
  try {
    let id = req.user._id; // logged in user's ID
    console.log(req.user);
    let posts = await Post.find({ author: id });
    res.render("userposts", { posts });
  } catch (err) {
    req.flash("error", "Could not load your posts.");
    res.redirect("/user/profile");
  }
};
