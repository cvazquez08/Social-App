const express = require("express");
const router = express.Router();

const User = require("../models/user-model");
const Post = require("../models/imgPost-model");
const Comment = require("../models/comment-model");

// form action="/comment{{this._id}}"
router.post("/:postid/comment", (req, res, next) => {
  Comment.create({
    user: req.user,
    comments: req.body.comment
  })
    .then(newComment => {
      // console.log('new comment ===', newComment)
      Post.findById(req.params.postid)
        .then(foundPost => {
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
