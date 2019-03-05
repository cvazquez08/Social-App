//Require mongoose & Schema model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create userSchema 
const userSchema = new Schema({
  email: { type:String, unique: true},
  password: String,
  username: { type:String, unique: true},
  fullName: String,
  googleID: String,
  defaultImg: String,
  profileTag: String,
  post: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
  following: [{type: Schema.Types.ObjectId, ref: 'User'}],
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}]


  // followers [ with reference to user _id]
}, {
  timestamps: true
});


//export userSchema model
module.exports = mongoose.model('User', userSchema)

// **************************************************
// const User = mongoose.model('User', userSchema);
// module.exports = User;


