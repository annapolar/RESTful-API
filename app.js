//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect db
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

// create schema
const articleSchema = {
    title: String,
    content: String
}
// create modal (usually singlur and capital format)
const Article = mongoose.model("Article", articleSchema);


// =============================== Request all articles ==============================
// Using express chained route handler
// http://expressjs.com/en/5x/api.html#router
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    // console.log(req.body.title)
    // console.log(req.body.content)
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Delete all articles successfully");
      } else {
        res.send(err);
      }
    });
  });

// =============================== Request a specific article ==============================
// http://expressjs.com/en/5x/api.html#router.param
// https://www.w3schools.com/tags/ref_urlencode.ASP

//localhost:3000/articles/angular 10
//req.params.articleTitle = "angular 10"

app.route("/articles/:articleTitle")
  .get(function(req, res){
      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
          if(foundArticle){
              res.send(foundArticle);
          } else {
            res.send("No articles matching that title was found")
          }
      })
  })


app.listen(3000, function() {
  console.log("Server started on port 3000");
});