const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: String,
},{timestamps:true});
const comment = mongoose.model("comment",commentsSchema);
module.exports =  comment;
// Comment Model
// id (ObjectId)

// postId (ObjectId → Post)

// userId (ObjectId → User)

// content (String)

// createdAt (Date)

// 🔗 Relationships:

// Belongs to a Post

// Belongs to a User
