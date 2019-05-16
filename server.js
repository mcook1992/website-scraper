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

      // var title = $(element)
      //   .find(".y8HYJ-y_lTUHkQIc1mdCq")
      //   .text();

      // var link =
      //   "https://www.reddit.com" +
      //   $(element)
      //     .find(".y8HYJ-y_lTUHkQIc1mdCq")
      //     .children()
      //     .attr("href");

      // var subtitle = $(element)
      //   .find(".s1w8oh2o-10")
      //   .text();

      // var author = $(element)
      //   .find("._2tbHP6ZydRpjI44J3syuqC")
      //   .text();

      //   console.log("We got some elements!");

      // console.log(title);

      // console.log(link);

      // //   console.log(subtitle);--works!

      // console.log(author);

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

  // Send a "Scrape Complete" message to the browser
  //   res.send("Scrape Complete");
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
