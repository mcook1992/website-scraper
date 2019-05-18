const express = require("express");
const exphbs = require("express-handlebars");
var handlebars = require("handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
var path = require("path");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, "./public/")));

//setting up handlebars:

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//importing models

const Article = require("./article-model");
const Comment = require("./comment-model");

// //Configure the database with MONGOJS

// const databaseUrl = "website-scraper";
// const collections = ["scrapedData"];

// // Hook mongojs configuration to the db variable
// const db = mongojs(databaseUrl, collections);

mongoose.connect(MONGODB_URI);

// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

// var testComment = {
//   articleID: "test2",
//   articleTitle: "I got dressed and brushed my hair today!",
//   text: "Great post",
//   isFavorite: false
// };

// Comment.create(testComment).then(function(element) {
//   console.log("We made a test comment!");
// });

app.get("/test", function(req, res) {
  // Create a new article using req.body
  Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);

      res.render("index", { dbArticle: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/comments", function(req, res) {
  console.log(req.body.id);
  var id = req.body.id;

  // req.params.id;

  Comment.find({ articleID: id }).then(function(dbComment) {
    console.log(dbComment[0].id);

    var articlePageObject = {
      id: dbComment[0].id,
      array: dbComment
    };

    console.log(dbComment[0].id);

    res.render("article", { articlePageObject: articlePageObject });
  });
});

app.post("/comments-post/", function(req, res) {
  console.log("post comment registered");
  console.log(req.body.text);
  console.log(req.body.id);

  var newComment = {
    articleID: req.body.id,
    articleTitle: "testing",
    text: req.body.text,
    isFavorite: false
  };

  Comment.create(newComment).then(function(element) {
    Comment.find({ articleID: newComment.articleID }).then(function(dbComment) {
      console.log(dbComment[0].id);

      var articlePageObject = {
        id: dbComment[0].id,
        array: dbComment
      };

      console.log(dbComment[0].id);
    });
  });
});

app.get("/scrape", function(req, res) {
  var array = [];
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.reddit.com/r/mentalhealth/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);

    let counterVariable1 = 0;
    let counterVariable2 = 0;

    //former class selector "iHepIF"

    //".y8HYJ-y_lTUHkQIc1mdCq"

    //creating a basic counter for now--I know this code is repetitive and can be dried up:
    $("._1poyrkZ7g36PawDueRza-J").each(function(i, element) {
      counterVariable1++;
    });

    // For each element with a "title" class
    $("._1poyrkZ7g36PawDueRza-J").each(function(i, element) {
      let newArticle = {
        title: $(element)
          .find(".y8HYJ-y_lTUHkQIc1mdCq")
          .text(),

        subtitle: $(element)
          .find(".s1w8oh2o-10")
          .text(),

        author: $(element)
          .find("._2tbHP6ZydRpjI44J3syuqC")
          .text(),

        link:
          "https://www.reddit.com" +
          $(element)
            .find(".y8HYJ-y_lTUHkQIc1mdCq")
            .children()
            .attr("href")
      };

      Article.create(newArticle)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });

      counterVariable2++;

      //making sure result doesn't get sent back until all results are in

      if (counterVariable2 == counterVariable1) {
        res.send("Scrape Complete");
      }
    });
  });
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
