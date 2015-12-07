###Description
This is an example application that showcases the push capability of RethinkDB in a very simplistic app using RethinkDB, Node.JS, and Socket.IO.

Through the app, a user can register a user name or save a message in the RethinkDB database.  The app is configurated to listen to receive the push notifications from RethinkDB when a user name or message is saved.

The supporting blog is located at [keyholesoftware.com].

NPM and NODE.jS is required before setting up and running the application.

Frameworks used:
<ul>
  <li>RethinkDB as the database</li>
  <li>Node.JS as the backend server</li>
  <li>Socket.IO for the communication channel between the server and the client and vice versa</li>
  <li>JQuery on the client just to keep it simple</li>
</ul>

###Setup
Run the following commands to start:
<ol>
  <li>npm install</li>
  <li>node server.js</li>
  <li>Open one browser for User1 and browse to: http://localhost:3000</li>
  <li>Open another browser for User2 and browse to: http://localhost:3000</li>
</ol>
**due to a bug in the app, the first time running 'node server.js' will throw an error.  The subsequent node runs will be fine.

RethinkDB web interface:
localhost:8080

#####A few RethinkDB commands available from Node CLI or within the RethinkDB web interface
```
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
```
