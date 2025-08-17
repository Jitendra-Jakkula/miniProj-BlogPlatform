const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    coverImage: {
     type :  Buffer,
     contentType : String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    tags: {
      type: [String],
      default: [],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    isPublished: Boolean,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
// id (ObjectId)

// title (String)

// content (String – supports HTML or Markdown)

// coverImage (String or URL)

// authorId (ObjectId → User)

// tags (Array of Strings)

// category (String or ObjectId → Category, optional)

// isPublished (Boolean)

// likes (Array of ObjectIds → Users who liked it)

// commentsCount (Number or computed)

// createdAt (Date)

// updatedAt (Date)

// 🔗 Relationships:

// Belongs to one User

// Has many Comments

// Has many Tags

// Optionally belongs to a Category
