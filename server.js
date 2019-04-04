var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//Routes
app.get("/", function(req, res) {
    axios.get("https://www.nytimes.com/section/us").then(function(response) {

        var $ = cheerio.load(response.data);

        var promiseArr = [];
        var links = [];

        $("#stream-panel .css-13mho3u ol li").each(function(i, element) {

            var title = $(element).find("h2").text();
            var summary = $(element).find("a").find("p").first().text();
            var byline = $(element).find(".css-1n7hynb").text();
            var link = "https://www.nytimes.com" + $(element).find("a").attr("href");

            links.push(link); //used after the Promise.all() completes

            promiseArr.push(db.Article.findOneAndUpdate({ "link": link }, { "title": title, "summary": summary, "byline": byline, "link": link }, { upsert: true, setDefaultsOnInsert: true }));
        });

        Promise.all(promiseArr).then(function(resultPromise) {
            var newLinks = [];

            //if an article was inserted (null response) add the link for that article to the newLinks array from the links array created above
            for (var i = 0; i < resultPromise.length; i++) {
                if (!resultPromise[i]) newLinks.push(links[i]);
            }
            db.Article.find({})
                .populate("notes")
                .then(function(resultFind) {
                    var articles = [];
                    for (var i = 0; i < resultFind.length; i++) {
                        var article = { _id: resultFind[i]._id, title: resultFind[i].title, summary: resultFind[i].summary, byline: resultFind[i].byline, link: resultFind[i].link, notes: resultFind[i].notes.length, favorite: resultFind[i].favorite, new: false };

                        if (newLinks.indexOf(resultFind[i].link) > -1) article.new = true;

                        articles.push(article);
                    };

                    res.render("articles", { articles: articles });

                }).catch(function(err) {
                    res.json(err);
                });
        }).catch(function(err) {
            res.json(err);
        })
    });
});

app.get("/api/:article", function(req, res) {
    db.Article.findOne({ _id: req.params.article })
        .populate("notes")
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

app.put("/api/:article", function(req, res) {
    db.Note.create(req.body)
        .then(function(data) {
            db.Article.findOneAndUpdate({ _id: req.params.article }, { $push: { notes: data._id } }, { new: true })
                .then(function(data) {
                    res.json(data);
                }).catch(function(err) {
                    res.json(err);
                })
        }).catch(function(err) {
            res.json(err);
        });
});

app.delete("/api/:article", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.article }, { $pull: { notes: req.body.id } }, { new: true })
        .then(function(data) {
            db.Note.deleteOne({ _id: req.body.id })
                .then(function(data) {
                    res.json(data);
                }).catch(function(err) {
                    res.json(err);
                })
        }).catch(function(err) {
            res.json(err);
        });
});

app.get("/favorites", function(req, res) {
    db.Article.find({ "favorite": true })
        .then(function(data) {
            var articles = [];
            for (var i = 0; i < data.length; i++) {
                var article = { _id: data[i]._id, title: data[i].title, summary: data[i].summary, byline: data[i].byline, link: data[i].link, notes: data[i].notes.length };

                articles.push(article);
            };
            res.render("favorites", { articles: articles });
        }).catch(function(err) {
            res.json(err);
        });
});

app.post("/favorites", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.body.articleId }, { favorite: req.body.favorite }, { new: true })
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});