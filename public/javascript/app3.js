$( window ).load(function() {
    console.log('ready2');


});

var login = function() {
  var user = $('#username').val();
  var password = $('#password').val();
  $.get('/user' + username).done(renderUser);
};

var renderUser = function() {
  $('#savedRoutes').show();
};
