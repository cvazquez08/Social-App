const express = require("express");
const router = express.Router();

// Require Models to use in this file
const User = require("../models/user-model");
const Post = require("../models/imgPost-model");
const Comment = require("../models/comment-model");

// post route for creating comments
// form action="/comment{{this._id}}"
router.post("/:postid/comment", (req, res, next) => {
  // create new comment
  Comment.create({
    user: req.user,
    comments: req.body.comment
  })
    .then(newComment => {
      Post.findById(req.params.postid)
        .then(foundPost => {
          // find the Post and push the post._id to new comment
          foundPost.comments.push(newComment);
          foundPost
            .save()
            .then(post => {
              res.redirect(`/view/${post._id}`);
            })
            .catch(error => next(error)); // catches res.redirect error
        })
        .catch(error => next(error)); // catches Post.findbyID error
    })
    .catch(error => next(error)); // catches Comment.create error
});

module.exports = router;
