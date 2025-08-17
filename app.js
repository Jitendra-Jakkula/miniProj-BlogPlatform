const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");
const connectDB = require("./utils/connectDb");
const userRoute = require("./routes/userRouter");
const postRoute = require("./routes/postRouter");
const commentsRoute = require("./routes/commentsRouter");
const categoryRoutes = require("./routes/categoryRoutes");
const getCategories = require("./middlewares/getCategories");
const session = require("express-session");
const flash = require("connect-flash");


const setUser = require("./middlewares/setUser");
const methodOverride = require('method-override');
require("dotenv").config();
const cookieParser = require("cookie-parser");

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))
app.engine("ejs",engine);
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: false,   // ✅ cookie only sent over https .,.. for prodcution https only...
  httpOnly: true,
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 2
}
}));

app.use(flash());


app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info")
  };
  next();
});

app.use(setUser);
app.use(getCategories);
app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/",commentsRoute);
app.use("/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.redirect("/posts");
});

app.get("/test-flash", (req, res) => {
  req.flash("success", "This is a test success message!");
  req.flash("error", "This is a test error message!");
  res.redirect("/posts");
});
app.get("/aboutus",(req,res)=>{
  res.render("aboutus");
});

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404);

  // If request expects JSON
  if (req.accepts("json")) {
    return res.json({ message: "404 - Page Not Found" });
  }

  // Render an EJS page if using frontend
  res.render("notfound"); // make views/notfound.ejs
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);

  if (req.accepts("json")) {
    return res.json({ message: err.message || "500 - Oops! Something went wrong" });
  }

  res.render("error", { error: err }); // make views/error.ejs
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
