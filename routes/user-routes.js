const express = require("express");
const router = express.Router();

// Make User & Post model available
const User = require("../models/user-model");
const Post = require("../models/imgPost-model");
// require cloudinary
const uploadCloudinary = require("../config/cloudinary.js");

// render profile hbs page
router.get("/profile", (req, res, next) => {
  // if no current user redirect back to login
  if (!req.user) {
    res.redirect("/login");
    return;
  }
  // if user is currently logged in render profile hbs
  Post.find({ user: req.user })
    .then(post => {
      res.render("user/profile", { post });
    })
    .catch(error => next(error));
});

// display /explore page
router.get("/explore", (req, res, next) => {
  // empty array to store all users other than user currently logged in
  const newUsers = [];
  User.find().then(usersFromDB => {
    usersFromDB.forEach(oneUser => {
      // iterate through DB
      // if user DOES NOT EQUAL current user => push to newUsers array
      if (!oneUser._id.equals(req.user._id)) {
        newUsers.push(oneUser);
      }
    });
    // render hbs file
    res.render("user/users-list", { newUsers });
  });
});

router.get("/profile/:username", (req, res, next) => {
  User.findOne({ username: req.params.username })
    .populate("post")
    .then(foundUser => {
      let text;
      // console.log('user in sess: ', req.user);
      console.log(foundUser.followers.indexOf(req.user._id));
      if (foundUser.followers.indexOf(req.user._id) > -1) {
        text = "Unfollow";
      } else {
        text = "Follow";
      }
      res.render("user/user-page", { foundUser, text });
    })
    .catch(error => next(error));
});

// display dashboard
router.get("/dashboard", (req, res, next) => {
  let followerLength = req.user.followers.length;
  let followingLength = req.user.following.length;

  User.findOne(req.user._id).populate({path: 'following', populate : {path : 'post'}})
    .then(theUser => {

      // empty array to store id's of users that currentUser is following
      let followingID = [];
      // iterate through followrs and push to empty array
      theUser.following.forEach( elem => {
        followingID.push(elem._id)
      })
      
      // query DB for all posts from the ID's saved in followingID 
      // & sort them by createdAt
      Post.find({user: {$in:followingID}})
      .sort({"createdAt": -1}).populate("user")
      .then( posts => {
        console.log('areiagelga;gjag', posts)
        res.render("user/dashboard", {
          user: theUser,
          followerLength,
          followingLength,
          posts
        });
      })
      .catch(error => next(error))
    })
    .catch(error => next(error));
});

// ROUTE FOR FOLLOW AND UNFOLLOW
// post route for follow button
// form action="/follow/{{foundUser._id}}" method="POST"
router.post("/follow/:foundUser", (req, res, next) => {
  const indexOfElem = req.user.following.indexOf(req.params.foundUser);
  console.log(req.user.followers.indexOf(req.params.foundUser))
  // IF USER IS ALREADY IN, SPLICE IT

  if (indexOfElem > -1) {
    req.user.following.splice(indexOfElem, 1);
    req.user.save();
    User.findById(req.params.foundUser)
      .then(user => {
        const indexOfFollow = user.followers.indexOf(req.user._id);
        user.followers.splice(indexOfFollow, 1);
        user.save();
        res.redirect(`/profile/${user.username}`);
      })
      .catch(error => next(error));
  } else {
    // IF USER IS NOT IN
    req.user.following.push(req.params.foundUser);
    req.user.save().then(() => {
      User.findById(req.params.foundUser)
        .then(user => {
          user.followers.push(req.user._id);
          user.save();
          res.redirect(`/profile/${user.username}`);
        })
        .catch(error => next(error));
    });
  }
});

module.exports = router;
