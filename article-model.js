const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },

  link: {
    type: String,
    trim: true,
    required: "URL is required"
  },

  author: {
    type: String,
    trim: true
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
