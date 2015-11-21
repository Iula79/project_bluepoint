var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    bcrypt = require('bcrypt');
    session = require('express-session'),
    app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: "string",
  saveUninitialized: false,
  resave: false
}));

//uncomment if using public folder static files
//app.use(express.static('./public'));

app.listen(3000, function(req, res){
  console.log("Bluepoint listening on 3000");
});


//keep until public files created
app.get('/', function(req, res){
  res.send('connected via server.js route');
});

mongoose.connect('mongodb://localhost/bluepointApp', function(err){
  if(err){
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

//uncomment when controllers are ready
fs.readdirSync('./controllers/').forEach(function(file){
  if(file.substr(-3) == '.js') {
    route = require('./controllers/' + file);
    route.controller(app);
  }
});
