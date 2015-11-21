var mongoose = require('mongoose'),
    User = require('../models/user.js');

module.exports.controller = function(app) {

  app.post('/sessions', function(req, res){
    User.find({
      name: req.body.name
    }).exec(funciton(err, user) {
      user[0].comparePassword(req.body.password, function(err, isMatch){
        if (isMatch){
          console.log("Login Successful");
          console.log(user[0]._id);
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
    });
  });

  app.delete('/sessions', function(req, res){
    req.session.id = null;
    res.send({
      msg: 'Logout Successful'
    });
  });
};
