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
  subtitle: "Interesting subtext",
  link: "medium.com",
  author: "Testy McTesterston"
};

app.get("/", function(req, res) {
  // Create a new article using req.body
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

app.get("/scrape", function(req, res) {
  var array = [];
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.reddit.com/r/mentalhealth/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);

    // console.log(response.data);

    //former class selector iHepIF

    //".y8HYJ-y_lTUHkQIc1mdCq"

    // For each element with a "title" class
    $("._1poyrkZ7g36PawDueRza-J").each(function(i, element) {
      //   array.push(element);
      //   console.log(array.length);
      // Save the text and href of each link enclosed in the current element
      //   var title = $(element).text();

      var title = $(element)
        .find(".y8HYJ-y_lTUHkQIc1mdCq")
        .text();

      var link =
        "https://www.reddit.com" +
        $(element)
          .find(".y8HYJ-y_lTUHkQIc1mdCq")
          .children()
          .attr("href");

      var subtitle = $(element)
        .find(".s1w8oh2o-10")
        .text();

      var author = $(element)
        .find("._2tbHP6ZydRpjI44J3syuqC")
        .text();

      //   console.log("We got some elements!");

      console.log(title);

      console.log(link);

      //   console.log(subtitle);--works!

      console.log(author);

      //   console.log(title);

      //   var link = $(element)
      //     .children("a")
      //     .attr("href");

      // If this found element had both a title and a link
      //   if (title && link) {
      //     // Insert the data in the scrapedData db
      //     db.scrapedData.insert(
      //       {
      //         title: title,
      //         link: link
      //       },
      //       function(err, inserted) {
      //         if (err) {
      //           // Log the error if one is encountered during the query
      //           console.log(err);
      //         } else {
      //           // Otherwise, log the inserted data
      //           console.log(inserted);
      //         }
      //       }
      //     );
      //   }
    });
  });

  console.log(array.length);

  // Send a "Scrape Complete" message to the browser
  //   res.send("Scrape Complete");
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
