Run the following commands to start:
1. npm install
2. node server.js
3.  Open two separate browsers windows and browse to: http://localhost:3000



//a few RethinkDB commands available from the Node command line:
var r = require('rethinkdb');

//get the connection
var connection = null;
r.connect({
  db: 'realtime_db'
}, function(err, conn) {
  connection = conn;
});

//drop a current database
r.dbDrop('realtime').run( connection, function(err, result) {
  if (err) throw err;
  util.log(result);
});

// list all the databases
r.dbList().run( connection, function(err, result) {
  if (err) throw err;
  util.log(result);
});