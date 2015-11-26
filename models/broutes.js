var mongoose = require('mongoose');

var BrouteSchema = new mongoose.Schema({
      startPoint: String,
      endPoint: String
    });

BrouteSchema.pre('remove', function(next) {
  var thisBroute = this;
// Remove all the assignment docs that reference the removed person.
    thisBroute.model('User').remove({ broutes: thisBroute._id }, next);
});

var Broute = mongoose.model("Broute", BrouteSchema);

module.exports = Broute;
