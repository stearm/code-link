const mongojs = require('mongojs');
const db = require('../db');

module.exports = function(server){

  // Get a bookmark by id
  server.route({
    method: 'GET',
    path: '/api/doc/{id}',
    handler: (request,reply) => {
      db.documento.findOne({
        _id: mongojs.ObjectId(request.params.id)
      }, function(err,doc){
        if(err){
          reply(err);
        } else {
          reply(doc);
        }
      });
    }
  });

  // Search bookmarks by description and tags
  server.route({
    method: 'GET',
    path: '/api/search',
    handler: (request,reply) => {
      if(JSON.parse(request.query.tags).length > 0){
        db.documento.find({
          descrizione: new RegExp(request.query.descrizione, 'i'),
          tags: { $in : JSON.parse(request.query.tags) }
        }, function(err,doc){
          if(err){
            reply(err);
          } else {
            reply(doc);
          }
        });
      } else {
        db.documento.find({descrizione: new RegExp(request.query.descrizione, 'i')}, function(err,doc){
          if(err){
            reply(err);
          } else {
            reply(doc);
          }
        });
      }
    }
  });

  // insert bookmarks
  server.route({
    method: 'POST',
    path: '/api/insertdoc',
    handler: (request,reply) => {
      db.documento.insert({
        url: request.payload.url,
        descrizione : request.payload.descrizione,
        tags: request.payload.tags,
        ratings: request.payload.ratings
      });
    }
  });

};
