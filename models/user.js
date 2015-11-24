var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
    BroutesSchema = require('./broutes.js').schema;

var UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  broutes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broute'
  }]
});

UserSchema.pre('save', function(next) {
  var user = this;


  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);


    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) return next(err);


      user.password = hashedPassword;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function (err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
