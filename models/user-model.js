const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    fname : String,
    username: String,
    email: String,
    password: String,
    profilepic : {
     type :  Buffer,
     contentType : String,
    },
    bio: String,
    role: String,
  },
  { timestamps: true }
);
const user = mongoose.model("user", userSchema);
module.exports = user;

// db.users.find({}, { profilepic: 0, password: 0 })


// id (ObjectId)

// username (String)

// email (String, unique)

// passwordHash (String)

// profilePic (String or URL)

// bio (String, optional)

// role (String: 'user' | 'admin')

// createdAt (Date)

// updatedAt (Date)

// 🔗 Relationships:

// One-to-many with Posts (a user can write multiple posts)

// One-to-many with Comments

// Referenced in Likes

// ---------------------------------

//  Comment Model
// id (ObjectId)

// postId (ObjectId → Post)

// userId (ObjectId → User)

// content (String)

// createdAt (Date)

// 🔗 Relationships:

// Belongs to a Post

// Belongs to a User

// 🧾 Category Model (optional)
// id (ObjectId)

// name (String, unique)

// description (String, optional)

// 🔗 Relationships:

// One-to-many with Posts
