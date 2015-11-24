var request = require('request');

module.exports= {
  getMap: function(cb) {
    request("https://maps.googleapis.com/maps/api/js?key=" + process.env.GOOGLE_MAPS_API + "&callback=initMap", function(error, response, body) {
      if(error) {
        console.log(error);
      }
      cb(body);
    });
  }
};
