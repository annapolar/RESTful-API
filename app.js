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

// Get Articles
// app.get("route", function(req, res){})
app.get("/articles", function(req, res){
    Article.find(function(err, foundArticles){
        if (!err){
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})
// Post Articles
app.post("/articles", function(req, res){
    // console.log(req.body.title)
    // console.log(req.body.content)
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article")
        } else {
            res.send(err)
        }
    });
})
//Delete (if no condition in the deleteMarny call back function, it will delete all)
app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Delete all articles successfully")
        } else {
            res.send(err)
        }
    });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});