var app = require('express')();
//module.exports = app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db/config');

//setup RethinkDB environment
db.setup(register);

//setup the routes
app.get('/', function (req, res) {
  //res.sendFile('/index.html');
  res.sendFile('index.html' , { root : __dirname});
});

//setup socketIO to listen for client messages
io.on('connection', function (socket) {
  //listen for 'send:message' messages from the client.
  socket.on('send:message', function (data) {
    console.log("---->send:message %s", JSON.stringify(data, null, 2));
    // Saving the new message to DB
    db.saveMessage({
          message: data.message
        },
        function (err, saved) {
          console.log("Message saved:  %s", saved);
          if (err) {
            console.log("Message error:  %s", err);
          }
          return;
        }
    );
  });


  //listen for 'send:register' messages from the client.
  socket.on('send:register', function (data) {
    console.log("---->send:register %s", JSON.stringify(data, null, 2));

    // Saving the new user to DB
    db.saveRegisteredUser({
          username: data.username
        },
        function (err, saved) {
          console.log("Register user saved:  %s", saved);
          if (err) {
            console.log("Register user error:  %s", err);
          }
          return;
        }
    );
  });

});

function register() {
    //create the wiring to send the realtime feeds to the client
    db.registerRealtimeUserFeed(function (data) {
        console.log("DB---->registerRealtimeUserFeed emit....:  " + data.new_val.username);
        io.emit('realtime:user', data.new_val.username);
    });
    db.registerRealtimeMessageFeed(function (data) {
        console.log("DB---->registerRealtimeMessageFeed emit....:  " + data.new_val.message);
        io.emit('realtime:message', data.new_val.message);
    });
}


//the last step:  listen for requests
http.listen(3000, function () {
  console.log('listening on *:3000');
});


