var r = require('rethinkdb');

/**
 * Setup the RethinkDB environment.
 *  --create the realtime database if it doesn't exist
 *  --create the messages and users tables if they don't exist
 */
module.exports.setup = function (callback) {
  r.connect({host: 'localhost', port: 28015}, function (err, connection) {
    //if (err) throw err;
    var db_name = 'realtime';
    r.dbCreate(db_name).run(connection, function (err, result) {
      if (err) {
        console.log("---->Database '%s' already exists (%s:%s)\n%s", db_name, err.name, err.msg, err.message);
      }
      else {
        console.log("---->Database '%s' created", db_name);
      }

      //create messages table
      r.db(db_name).tableCreate('messages', {primaryKey: 'id'}).run(connection, function (err, result) {
        if (err) {
          console.log("---->Table 'messages' already exists (%s:%s)\n%s", err.name, err.msg, err.message);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }

      });

      //create users table
      r.db(db_name).tableCreate('users', {primaryKey: 'id'}).run(connection, function (err, result) {
        if (err) {
          console.log("---->Table 'users' already exists (%s:%s)\n%s", err.name, err.msg, err.message);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }
      });
      callback();
    });
  });
};

/**
 * Subscribe to a realtime feedback connection to receive notification of new registered users.
 */
module.exports.registerRealtimeUserFeed = function (callback) {
  console.log("DB---->registerRealtimeUserFeed");
  r.connect({host: 'localhost', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('realtime').table('users').changes().run(connection, function (err, cursor) {
      if (err) throw err;
      cursor.each(function (err, row) {
        if (err) throw err;
        console.log("DB---->registerRealtimeUserFeed pushing....");
        console.log(JSON.stringify(row, null, 2));
        callback(row);
      });
    });
  });
};

/**
 * Subscribe to a realtime feedback connection to receive notification of new messages.
 */
module.exports.registerRealtimeMessageFeed = function (callback) {
  console.log("DB---->registerRealtimeMessageFeed");
  r.connect({host: 'localhost', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('realtime').table('messages').changes().run(connection, function (err, cursor) {
      if (err) throw err;
      cursor.each(function (err, row) {
        if (err) throw err;
        console.log("DB---->registerRealtimeMessageFeed pushing....");
        console.log(JSON.stringify(row, null, 2));
        callback(row);
      });
    });
  });
};

/**
 * Save a new registered user.
 */
module.exports.saveRegisteredUser = function (user, callback) {
  console.log("DB---->saveRegisteredUser:  %s", user.username);
  r.connect({host: 'localhost', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('realtime').table('users').insert(user).run(connection, function (err, result) {
      //if (err) throw err;
      if (err) {
        console.log("DB---->saveRegisteredUser failed] %s:%s\n%s", err.name, err.msg, err.message);
        callback(err);
      }
      console.log(JSON.stringify(result, null, 2));
    });
    connection.close();
  })
};

/**
 * Save a new message.
 */
module.exports.saveMessage = function (msg, callback) {
  var connection = null;
  r.connect({host: 'localhost', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('realtime').table('messages').insert(msg).run(connection, function (err, result) {
      //if (err) throw err;
      if (err) {
        console.log("DB---->saveMessage] %s:%s\n%s", err.name, err.msg, err.message);
        callback(err);
      }
      console.log(JSON.stringify(result, null, 2));
    });
    connection.close();
  })
};
