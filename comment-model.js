const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  articleID: {
    type: String,
    trim: true
  },
  articleTitle: {
    type: String,
    trim: true
  },

  text: {
    type: String,
    trim: true
  },

  date: { type: Date, default: Date.now },

  isFavorite: {
    type: Boolean,
    default: false
  }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
