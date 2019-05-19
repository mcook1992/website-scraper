"use strict";
var id;

$(".commentButton").on("click", function(event) {
  event.preventDefault();
  console.log("button pressed");
  id = this.id;

  $.ajax({
    url: "/comments",
    type: "GET",
    data: { id: id },
    success: function(response) {
      alert("We did it!");
      window.location = "/comments";
    },
    error: function() {
      alert("error");
    }
  });

  //   $.get("/comments", function() {
  //     window.location = "/comments";
  //   });
});

$("#commentSubmitButton").on("click", function(event) {
  event.preventDefault();
  console.log("Button pressed");

  var formInput = $("#formInput").val();

  console.log($("#formInput").attr("data_value"));

  console.log(formInput);
  $.ajax({
    url: "/comments-post/",
    type: "POST",
    data: { id: id, text: formInput },
    success: function(response) {
      alert("We did it!");
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
