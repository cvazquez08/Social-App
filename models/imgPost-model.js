//Require mongoose & Schema model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create userSchema 
const imgPostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  imgUrl: [{ type: String}],
  description: { type: String, maxlength: 20},
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]


}, {
  timestamps: true
});


//export userSchema model
module.exports = mongoose.model('Post', imgPostSchema)




