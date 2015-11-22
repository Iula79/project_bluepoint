var mongoose = require('mongoose'),
User = require('../models/user.js');

module.exports.controller = function(app) {
app.get('/users', function(req, res) {
  User.find().exec(function (err, users) {
    res.send(users);
  });
});

var restrictAccess = function (req, res, next) {
 var sessionId = req.session.currentUser;
 var reqId = req.params.id;
 sessionId = reqId ? next() : res.status(400).send({err: 400, msg: "You shall not pass"});
};var authenticate = function (req, res, next) {
 req.session.currentUser ? next() : res.status(403).send({err: 403, msg: "log in troll"});
};

app.get('/users/:id', authenticate, restrictAccess, function (req, res) {
  User.findById(req.params.id).exec(function (err, user) {
    res.send(user);
  });
});

// app.get('/posts', function(req, res) {
//   Post.find().exec(function (err, posts) {
//     res.send(posts);
//   });
// });
//
app.post('/users', function (req, res) {
  var user = new User(req.body);
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('User saved');
      res.send(user);
    }
  });
});
//
app.post('/compareUser', function (req, res) {
  User.find({name: req.body.name}).exec(function (err, user) {
    var currentUser = user[0];
    currentUser.comparePassword(req.body.password, function (err, isMatch) {
      if(isMatch) {
        res.send(currentUser);
      } else {
        res.send(err);
      }
    });
  });
});
}