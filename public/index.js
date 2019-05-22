"use strict";

$(".commentButton").on("click", function(event) {
  event.preventDefault();
  console.log("button pressed");
  var id = this.getAttribute("data-value");

  console.log(id);

  var url = "/comments/" + id;
  console.log(url);

  $.ajax({
    url: url,
    type: "GET",
    success: function() {
      window.location = url;
    }
  });
});

$(".scrapeButton").on("click", function(event) {
  event.preventDefault();
  alert("We're working on finding the newest articles");

  $.ajax({
    url: "/scrape",
    type: "GET",
    success: function() {
      alert("Scrape complete!");
      location.reload();
    },
    error: function() {
      alert("error");
    }
  });
});

$(".deleteButton").on("click", function(event) {
  var newID = this.getAttribute("data-value");

  $.ajax({
    url: "/delete",
    type: "PUT",
    data: { id: newID },
    success: function(response) {
      alert("You're article was deleted");
    },
    error: function() {
      alert("error");
    }
  });
});

//Going to favorites page

$(".goToFavoritesPage").on("click", function(event) {
  $.ajax({
    url: "/saved",
    type: "GET",
    success: function(response) {
      alert("We did it!");
      window.location = "/saved";
    },
    error: function() {
      alert("error");
    }
  });
});

$("#commentSubmitButton").on("click", function(event) {
  event.preventDefault();
  console.log("Button pressed");

  var formInput = $("#formInput").val();

  console.log($("#formInput").attr("data_value"));
  var id = $("#formInput").attr("data_value");

  console.log(formInput);
  $.ajax({
    url: "/comments-post/",
    type: "POST",
    data: { id: id, text: formInput },
    success: function(response) {
      alert("New comment added. If you can't see it, try refreshing the page");
      location.reload();
    },
    error: function() {
      alert("error");
    }
  });
});

$(".favoriteButton").on("click", function(event) {
  event.preventDefault();
  console.log("favorite button pressed");

  var newID = this.getAttribute("data-value");

  $.ajax({
    url: "/saved-articles",
    type: "POST",
    data: { id: newID },
    success: function(response) {
      alert("You're article was saved");
    },
    error: function() {
      alert("error");
    }
  });
});

$(".goToHomePage").on("click", function() {
  window.location = "/home";
});
