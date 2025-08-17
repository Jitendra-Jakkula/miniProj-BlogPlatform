const express = require("express");
const router = express.Router();
const loginAuth = require("../auth/loginAuth");
const signupAuth = require("../auth/signupAuth");
const upload = require("../middlewares/multerConfig");
const isLoggedIn = require("../middlewares/isLoggedIn");
const validate = require("../middlewares/validate");
const {signupSchema,loginSchema} = require("../validations/userValidation");
const { getLogin, logout, getSignup, viewProfile, editProfile, getEditProfile, getUserPosts } = require("../controllers/userController");

router.get("/signup", getSignup);

router.post("/signup", upload.single("profilepic"),  validate(signupSchema),signupAuth);

router.get("/login",getLogin);

router.post("/login",validate(loginSchema), loginAuth);

router.get("/logout", isLoggedIn,logout);

router.get("/profile", isLoggedIn,viewProfile );

router.get("/edit/:id",isLoggedIn,getEditProfile);

router.put("/edit/:id",isLoggedIn,upload.single("profilepic"),editProfile);
router.get("/posts",isLoggedIn,getUserPosts);
module.exports = router;
