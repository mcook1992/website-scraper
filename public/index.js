"use strict";
var id;

$(".commentButton").on("click", function(event) {
  event.preventDefault();
  console.log("button pressed");
  id = this.id;

  $.get("/comments", function() {
    window.location = "/comments";
  });
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
    },
    error: function() {
      alert("error");
    }
  });
});
