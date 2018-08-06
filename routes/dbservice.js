
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var questionGenre ="Virhe";
var ObjectId = require('mongodb').ObjectID;
var questionText ="Virhe";


function addQuestiontotheDatabase(req, res) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function(db) {
        const dbo =db.db();
        var collection = dbo.collection('question');
        questionGenre = req.body.questiongenre;
        questionText = req.body.questiontext;
        questionText = questionText.replace(/(?:\r\n|\r|\n)/g, '<br>');
        return collection.insert( { genre: questionGenre, text: questionText })
    }).then(function() {
        res.render("success", {questionGenre: questionGenre, questionText: questionText});
    });
}

function showAll(req, res) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function(db) {
        const dbo = db.db();
        // grade = req.body.grade;
        var collection = dbo.collection('question');
        return collection.find({})
            .toArray();
    }).then(function(items) {
        var array =items;
        res.render("allQuestions", {array: array})
    });
}


function showAlltoDelete(req, res) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function(db) {
        const dbo = db.db();
        var collection = dbo.collection('question');
        return collection.find({})
            .toArray();
    }).then(function(items) {
        var array =items;
        res.render("deleteQuestions", {array: array})
    });
}

function deleteQuestion(req, res) {
    if (req.body.deletedid !== "all") {
        return MongoClient.connect(url, { useNewUrlParser: true }).then(function (db) {
            const dbo = db.db();
            var objectToBeDeleted = req.body.deletedid;
            var collection = dbo.collection('question');
            return collection.remove({"_id": ObjectId(objectToBeDeleted)});
        }).then(function () {
            showAlltoDelete(req, res);
        });
    } else {
        return MongoClient.connect(url, { useNewUrlParser: true }).then(function (db) {
            const dbo = db.db();
            var collection = dbo.collection('question');
            return collection.remove({});
        }).then(function () {
            showAlltoDelete(req, res);
        });
    }
}

function showAllwithParameters(req, res) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function(db) {
        const dbo = db.db();
        var collection = dbo.collection('question');
        return collection.find({})
            .toArray();
    }).then(function(items) {
        var array = [];
        for(var i = 0; i < items.length; i++ ){
            if(items[i].genre == req.body.questiongenre) {
                array.push(items[i]);
            }
        }
        console.log(req.body.questiongenre);
        console.log(array);
        res.render("allQuestions", {array: array})
    });
}

module.exports = {addQuestiontotheDatabase, showAll, showAllwithParameters, showAlltoDelete, deleteQuestion};