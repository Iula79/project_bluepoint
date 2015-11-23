var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
    BroutesSchema = require('./broutes.js').schema;


var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  broutes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broute'
  }]
});

UserSchema.pre('save', function(next) {
  var user = this;

  //only hash the password if it has been modified
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    //hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) return next(err);

      //override the users password with the hashed one
      user.password = hashedPassword;
      next();
    });
  });
});

<<<<<<< HEAD
UserSchema.methods.comparePassword = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
=======


UserSchema.methods.comparePassword = function (userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function (err, isMatch) {
    if(err) return cb(err);
>>>>>>> bcc9487735e69cba28c2bf6982ebd588fe886012
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
