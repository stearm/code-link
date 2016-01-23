module.exports = function(server){
  server.register(require('inert'), (err) => {
    if(err) throw err;

    // angular main single page web app
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request,reply){
        reply.file('./views/index.html');
      }
    });

    // serving js file
    server.route({
      method: 'GET',
      path: '/scripts/{param*}',
      handler: {
        directory: {
          path: 'public/javascripts'
        }
      }
    });

    // serving stylesheets
    server.route({
      method: 'GET',
      path: '/style/{param*}',
      handler: {
        directory: {
          path: 'public/stylesheets'
        }
      }
    });

    // serving angular component
    server.route({
      method: 'GET',
      path: '/component/{param*}',
      handler: {
        directory: {
          path: 'public/vendor'
        }
      }
    });
  });

};
