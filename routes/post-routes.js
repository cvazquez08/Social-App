const express = require("express");
const router = express.Router();

// Make User & Post model available
const User = require("../models/user-model");
const Post = require("../models/imgPost-model");
// require cloudinary
const uploadCloudinary = require("../config/cloudinary.js");

// post method for uploading posts
// form action="/upload"
router.post("/upload", uploadCloudinary.single("imgUrl"), (req, res, next) => {
  // create variables for form information
  const imgUrl = req.file.secure_url;
  const description = req.body.description;
  const user = req.user;
  // create a post in the DB
  Post.create({
    user: user,
    imgUrl: imgUrl,
    description: description
  })
    .then(createdPost => {
      // once post is created redirect to current user profile
      // res.redirect('/profile')
      User.findById(user._id)
        .then(founduser => {
          founduser.post.push(createdPost);
          founduser.save();
          res.redirect("/profile");
        })
        .catch(error => next(error)); // closes Room.findbyid
    })
    .catch(error => next(error)); // closes Post.create
});

// get route to display edit page
router.get("/:postid", (req, res, next) => {
  Post.findById(req.params.postid)
    .populate({ path: "comments", populate: { path: "user" } })
    .then(foundPost => {
      res.render("post/edit-post", { foundPost });
    })
    .catch(error => next(error));
});

// form action="/{{foundPost.id}}/edit-post"
// edit description for post
router.post("/:postid/edit-post", (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postid, {
    description: req.body.description
  })
    .then(update => {
      res.redirect("/profile");
    })
    .catch(error => next(error));
});

// form action="/delete-post"
router.post("/:postid/delete-post", (req, res, next) => {
  req.user.post.pull(req.params.postid);
  req.user
    .save()
    .then(elem => {
      Post.findByIdAndDelete(req.params.postid)
        .then(thePost => {
          res.redirect("/profile");
        })
        .catch(error => next(error)); // catches Post.findbyidanddelete
    })
    .catch(error => next(error)); // catches req.user.post.pull(req.params.postid)
});

// view single post in order to add comments
router.get("/view/:postid", (req, res, next) => {
  Post.findById(req.params.postid)
    .populate({ path: "comments", populate: { path: "user" } })
    .then(foundPost => {
      console.log("post is: ", foundPost);
      res.render("post/user-post", { foundPost });
    })
    .catch(error => next(error));
});

module.exports = router;
