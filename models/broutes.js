var mongoose = require('mongoose');

var BrouteSchema = new mongoose.Schema({
      content: String
    });

var Broute = mongoose.model("Broute", BrouteSchema);

module.exports = Broute;
