var mongoose = require('mongoose'),
    User = require('../models/user.js');

module.exports.controller = function(app) {

  app.post('/sessions', function(req, res) {
    User.find({
      name: req.body.name
    }).exec(function(err, user) {
      if (req.body.password == undefined || req.body.name == undefined){
        res.status(400);
        res.send({
          err: 400,
          msg: 'enter username and password'
        });
      } else {
      user[0].comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          console.log('Login Successful');
          req.session.currentUser = user[0]._id;
          res.send(user);
        } else {
          res.status(400);
          res.send({
            err: 400,
            msg: 'incorrect password'
          });
        }
      });
    }
    });
  });

  app.delete('/sessions', function(req, res) {
    req.session.destroy();

    res.send({
      msg: 'Logout Successful'
    });
  });
};
