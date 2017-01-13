// jshint esversion: 6
const PORT = process.env.PORT || 3000;
const server = require('./server');

server.listen(PORT, () => {
  console.log('Server listening on', PORT);
});