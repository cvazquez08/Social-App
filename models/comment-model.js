const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const commentSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User'},
  comments: [{ type: String, maxlength: 50}]

}, {
  timestamps: true
})


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

