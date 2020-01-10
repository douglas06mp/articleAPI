//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      !err ? res.send(articles) : res.send(err)
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(err => {
      !err ? res.send("Successfully add a new article.") : res.send(err)
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, err => {
      !err ? res.send("Successfully delete all article.") : res.send(err)
    });
  });



app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, article) => {
      article ? res.send(article) : res.send("No article matching that title was found.")
    });
  })
  .put((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      err => {
        !err ? res.send("Successfully update article.") : res.send(err)
      });
  })
  .patch((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      err => {
        !err ? res.send("Successfully update article.") : res.send(err)
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, err => {
      !err ? res.send("Successfully delete article.") : res.send(err)
    });
  });


app.listen(3000, () => {
  console.log("Server starts on port 3000");
});
