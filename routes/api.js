var express = require('express');
var mongojs = require('mongojs');

var router = express.Router();
var db = mongojs('mongodb://localhost:27017/codlicious', ['documento']);

router.get('/doc/:id', function(req,res){
  db.documento.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function(err,doc){
    if(err){
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

router.get('/search', function(req,res){
  if(JSON.parse(req.query.tags).length > 0){
    db.documento.find({
      descrizione: new RegExp(req.query.descrizione, 'i'),
      tags: { $in : JSON.parse(req.query.tags) }
    }, function(err,doc){
      if(err){
        res.send(err);
      } else {
        res.json(doc);
      }
    });
  } else {
    db.documento.find({descrizione: new RegExp(req.query.descrizione, 'i')}, function(err,doc){
      if(err){
        res.send(err);
      } else {
        res.json(doc);
      }
    });
  }
});

router.post('/insertdoc', function(req,res){
  db.documento.insert({
    url: req.body.url,
    descrizione : req.body.descrizione,
    tags: req.body.tags,
    ratings: req.body.ratings
  });
});

module.exports = router;
