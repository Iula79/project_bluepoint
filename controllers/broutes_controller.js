var mongoose = require('mongoose'),
    Broute = require('../models/broutes.js'),
    User = require('../models/user.js');

module.exports.controller = function(app) {
  app.get('/broutes', function(req, res){
    Broute.find().exec(function(err, broutes){
      if (err) return next(err);
      res.send(broutes);
    });
  });

  var restrictAccess = function (req, res, next) {
   var sessionId = req.session.currentUser;
   var reqId = req.params.id;
   sessionId == reqId ? next() : res.status(400).send({err: 400, msg: "You shall not pass"});
  };
  var authenticate = function (req, res, next) {
   req.session.currentUser ? next() : res.status(403).send({err: 403, msg: "log in troll"});
  };

  app.get('/users/:id/broutes/:brouteid', authenticate, restrictAccess, function(req, res){
    User.findById(req.params.id).populate('broutes').exec(function(err, user) {
    Broute.findById(req.params.brouteid).exec(function(err, broute){
      if (err) return next(err);
      res.send(broute);
    });
  });
  });

  app.get('/users/:id/broutes', authenticate, restrictAccess, function(req, res){
    User.findById(req.params.id).populate('broutes').exec(function(err, user) {
    Broute.find().exec(function(err, broutes){
      if (err) return next(err);
      res.send(user.broutes);
    });
  });
  });

  app.post("/users/:id/broutes", authenticate, restrictAccess, function(req, res) {
    User.findById(req.params.id).exec(function(err, user) {
      var broute = new Broute(req.body);
      broute.save(function(err) {
        if (err) {
          console.log(err)
        } else {
          user.broutes.push(broute._id);
          user.save(function(err) {
            if (err) {
              console.log(err)
            } else {
              res.send(user);
            }
          })
        }
      });
    });
  });

  // app.delete('/broutes/:id', function(req, res){
  //   Broute.findOneAndRemove({_id: req.params.id}, function (err){
  //     if(err) console.log(err);
  //     console.log("Broute deleted");
  //     res.send('broute deleted');
  //   });
  // });

  app.delete('/users/:id/broutes/:brouteid', authenticate, restrictAccess, function(req, res){
    User.findById(req.params.id).exec(function(err, user){
      Broute.findOneAndRemove({_id: req.params.brouteid}, function(err){
        if(err) console.log(err);
        console.log("deleted this broute");
        res.send('deleted this broute');
      });
    });
  });
}
