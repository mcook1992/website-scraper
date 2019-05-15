const express = require("express");
const handlebars = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const mongojs = require("mongojs");

const PORT = process.env.PORT || 3000;
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//importing models

const Article = require("./article-model");

// //Configure the database with MONGOJS

// const databaseUrl = "website-scraper";
// const collections = ["scrapedData"];

// // Hook mongojs configuration to the db variable
// const db = mongojs(databaseUrl, collections);

mongoose.connect(MONGODB_URI);

// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

var testData = {
  title: "TestTitle",
  link: "medium.com",
  author: "Testy McTesterston"
};

app.get("/", function(req, res) {
  // Create a new user using req.body
  Article.create(testData)
    .then(function(dbUser) {
      // If saved successfully, send the the new User document to the client
      console.log(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send the error to the client
      console.log(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
