const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 3000)
});

const auth = require('./secure/auth-strategy')(server);
const basic = require('./routes/basic')(server);
const api = require('./routes/api')(server);

server.start(() => {
  console.log('Server started on port 3000!');
});
