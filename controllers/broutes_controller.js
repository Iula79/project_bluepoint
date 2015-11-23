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

  app.get('/users/:id/broutes', function(req, res){
    User.findById(req.params.id).populate('broutes').exec(function(err, user) {
    Broute.find().exec(function(err, broutes){
      if (err) return next(err);
      res.send(user.broutes);
    });
  });
  });

  app.post("/users/:id/broutes", function(req, res) {
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

  app.delete('/broutes/:id', function(req, res){
    Broute.findOneAndRemove({_id: req.params.id}, function (err){
      if(err) console.log(err);
      console.log("Broute deleted");
      res.send('broute deleted');
    });
  });
}
