$(document).ready(function() {
  loadGoogle();
    $('#show-sign-up').click(function() {
      $('#sign-up-box').animate({
        top: '20px',
        opacity: '1.0'
      })
    });
    $.ajax({
  url: '/map',
  method: 'GET',
}).done(function (data) {
});
    $('#login').click(signIn);
    $('#logout').click(signOut);
    $('#signup').click(signUp);
});

function loadGoogle() {
  if(typeof google != 'undefined' && google && google.load)
  {
    google.load('visualization', '1', {packages: ['columnchart']});
    initMap();
  }
  else {
    setTimeout(loadGoogle, 30);
  }
}

function initMap() {
    var markerArray = [];


    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService();

    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
            lat: 40.771,
            lng: -73.974
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    });

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        draggable: true
    });


    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow();

    // Display the route between the initial start and end selections.
    // calculateAndDisplayRoute(
    //     directionsDisplay, directionsService, markerArray, stepDisplay, map);

    // Listen to change events from the start and end lists.

    map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');

    var onChangeHandler = function() {
      //console.log("change handler");
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);

    };
    //
    $('#submit').click(onChangeHandler);
    // directionsDisplay.addListener("drag", onChangeHandler);

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING or BICYCLING directions.
     var selectedMode = document.getElementById('mode').value;
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
          for (var i = 0, len = response.routes.length; i < len; i++) {
              new google.maps.DirectionsRenderer({
                  map: map,
                  directions: response,
                  draggable: true,
                  routeIndex: i
              })
            //console.log(response.routes[i].warnings);
            console.log(response.routes);
            directionsDisplay.setDirections(response);
            //console.log(response);
            directionsDisplay.setPanel(document.getElementById("directionsPanel"));
            $('#directionsPanel').css('display', 'inline-block');
          }
          showSteps(response, markerArray, stepDisplay, map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });



var arrayOfPathsElevations = [];

function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes
    // Loop over all possible routes and print legs

    // a result of a directionResult request is an object for each route, that contains an object "leg" (an array of one element) that contains an array with a certain number of object "steps" that each contains an arrai with a certain number of "lat_long" functions that each contains a lat and a long

    console.log("These are the routes:");
    console.log(directionResult.routes);
    console.log("THIS IS HOW MANY ROUTES THERE ARE AND I AM OUTSIDE OF THE FOR LOOP:");
    console.log(directionResult.routes.length);
    for (var i = 0; i < directionResult.routes.length; i++) {
        var myRoute = directionResult.routes[i].legs[0];
        //console.log(directionResult.routes[i].legs[0]);
        var arrayOfLegs = [];
        console.log("this is my route " + i);
        console.log(myRoute);
        console.log("these are the steps for route " + i)
        console.log(myRoute.steps);
        console.log("this is how many steps there are in route " + i)
        console.log(myRoute.steps.length)
        for (var j = 0; j < myRoute.steps.length; j++) {
          console.log("this is step number " + j + "of route " + i);
          console.log(myRoute.steps[j]);
          console.log("this is how many lats and length there are in step " + j + "of route " + i)
          console.log(myRoute.steps[j].lat_lngs.length)
            for (var f = 0; f < myRoute.steps[j].lat_lngs.length; f++) {
                //console.log("this is how many lat and lengs there are on each latleng array")
                //console.log(myRoute.steps[j].lat_lngs[f].length)
                //  console.log("This is the latitude:" + myRoute.steps[j].lat_lngs[f].lat());
                //  console.log("This is the longitude:" + myRoute.steps[j].lat_lngs[f].lng());
                var latitude = myRoute.steps[j].lat_lngs[f].lat();
                var longitude = myRoute.steps[j].lat_lngs[f].lng();
                latitude_longitudeObj = {
                    lat: latitude,
                    lng: longitude
                };
                arrayOfLegs.push(latitude_longitudeObj);
            }
        }
    console.log(arrayOfLegs);
    arrayOfPathsElevations.push(arrayOfLegs);
}
console.log(arrayOfPathsElevations)
// var arrayOfLegs = [];



// function createArrayOfLegs(path1) {
//     for (var i = 0; i< path1.length; i++){
//         var singleArray = [path[i], path[i+1]];
//         arrayOfLegs.push(singleArray);
//     }
//
// }
// createArrayOfLegs(path);
// console.log("this is the array of legs");
// console.log(arrayOfLegs);

    //creating a new location map
    var elevator = new google.maps.ElevationService();

    // Draw the path, using the Visualization API and the Elevation service.

    displayPathElevation(arrayOfPathsElevations, elevator, map);
    //console.log("here!")



    function displayPathElevation(path, elevator, map) {

        for (var d =0; d<path.length; d++ ) {
            singlePath = path[d];
            //console.log(newPath)

        // Display a polyline of the elevation path.
      new google.maps.Polyline({
            path: singlePath,
            strokeColor: 'rgb(255, 15, 15) ',
            opacity: 0.4,
            map: map
        });

        // Create a PathElevationRequest object using this array.
        // Ask for 256 samples along that path.
        // Initiate the path request.
        elevator.getElevationAlongPath({
            'path': singlePath,
            'samples': 10
        }, plotElevation, setMarkers());
    }
    // Takes an array of ElevationResult objects, draws the path on the map
    // and plots the elevation profile on a Visualization API ColumnChart.
    function plotElevation(elevations, status) {
        var chartDiv = document.getElementById('elevation_chart');
        if (status !== google.maps.ElevationStatus.OK) {
            // Show the error code inside the chartDiv.
            chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
                status;
            return;
        }
        google.load('visualization', '1', {
            packages: ['columnchart']
        });
        // Extract the data from which to populate the chart.
        // Because the samples are equidistant, the 'Sample'
        // column here does double duty as distance along the
        // X axis.
        elevationList = []


        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sample');
        data.addColumn('number', 'Elevation');
        for (var i = 0; i < elevations.length; i++) {
            data.addRow(['', elevations[i].elevation]);

            //console.log("this is elevations " + elevations[i].elevation);
            singleSpotElevation = elevations[i].elevation
            elevationList.push(singleSpotElevation)
        }
        console.log("elevationList: " + elevationList)

        // Create a new chart in the elevation_chart DIV.

        var chart = new google.visualization.ColumnChart(chartDiv);
        // Draw the chart using the data within its DIV.
        chart.draw(data, {
            height: 150,
            legend: 'none',
            titleY: 'Elevation (m)'
        });

    }

    //setMarkers();
  };

function setMarkers() {
  //console.log("setting markers");
    for (var i = 0; i < myRoute.steps.length; i++) {
        //is the double marker necessary?
        var marker = markerArray[i] || new google.maps.Marker();
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}
directionsDisplay.addListener("drag", initMap);


};

};

function calculateMedianElevation(path ){}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
};

function signUp(){
  console.log("sign me up")
  var userObject = {
    name: $('#newUsername').val(),
    password: $('#newPassword').val(),
    email: $('#newEmail').val()
       }
  $.post('/users/', userObject, function(data) {
    console.log(data);
  });
  $('#newUsername').val('');
  $('#newPassword').val('');
  $('#newEmail').val('');
  $('#passwordConfirmation').val('');
  $('#sign-up-box').animate({
    opacity: '0.0'
  })

};

function signIn() {
  console.log("signing in")
  var userObject = {
    name: $('#username').val(),
    password: $('#password').val()
  };
  if (name != "" || password != ""){
  $.get('/users/', userObject, function(data) {

  });
  $.post('/sessions/', userObject, function(data){
    console.log(data);
    console.log(data[0].name);
  }).done(getSaveButton);
  };
};
var userID = "";
  function getSaveButton(data) {
    var userDiv = $("<div>", {
      id: "user-data"
    });
    var saveButton = $("<button>", {
      text: "Save Broute",
      id: "save-broute-button"
    });
    userID = data;
    $('#container').append(userDiv);
    $(userDiv).append(saveButton);
    $('#logout').css({'display': 'block'});
    $('#login').css({'display': 'none'});
    $('#username').val('');
    $('#password').val('');
    $('#save-broute-button').on('click', saveRoute);
    console.log("/users/" + data[0]._id + "/broutes");
    $.ajax({
      url: "/users/" + data[0]._id + "/broutes",
      method: "GET"
    }).done(showBroutes);
};
var broutesList = "";
function showBroutes(data) {
  broutesList = data;
  console.log(data);
  data.forEach(function(broute){
    var brouteContent = broute.content;
    var brouteTag = $("<p>", {
      text: brouteContent
    });
    $('#user-data').append(brouteTag);
  });

};

function signOut() {
  console.log("signing out");
  userID = "";
  broutesList = "";
  $.ajax({
    url: '/sessions',
    method: 'DELETE',
    success: function() {
      console.log('logged out');
  }});
  $('#login').css({'display': 'block'});
    $('#logout').css({'display': 'none'});
    $('#save-broute-button').css({'display': 'none'})
};

function saveRoute() {
  console.log('saving route');
  var start = $('#start').val();
  var end = $('#end').val();
  console.log(start);
  console.log(end);
  console.log(userID);
  $.ajax({
    url: "/users/" + userID[0]._id + "/broutes",
    method: "POST",
    data: JSON.stringify({content: start})
  }).done(refreshBroutes);
  // push start and end to broutes
  //display list of broutes
  //click on broute to display map
};



function refreshBroutes() {
  broutesList.forEach(function(broute){
    var brouteContent = broute.content;
    var brouteTag = $("<p>", {
      text: brouteContent
    });
    $('#user-data').append(brouteTag);
  });
};
