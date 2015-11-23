
function loadGoogle() {
  if(typeof google != 'undefined' && google && google.load)
  {
    google.load('visualization', '1', {packages: ['columnchart']});
  }
  else {
    setTimeout(loadGoogle, 30);
  }
}
loadGoogle();



function initMap() {
  var markerArray = [];


  // Instantiate a directions service.
  var directionsService = new google.maps.DirectionsService;

  // Create a map and center it on Manhattan.
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 40.771, lng: -73.974},
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
  var stepDisplay = new google.maps.InfoWindow;

  // Display the route between the initial start and end selections.
  calculateAndDisplayRoute(
      directionsDisplay, directionsService, markerArray, stepDisplay, map);
  // Listen to change events from the start and end lists.
  var onChangeHandler = function() {
    calculateAndDisplayRoute(
        directionsDisplay, directionsService, markerArray, stepDisplay, map);
  };
  document.getElementById('submit').addEventListener('click', onChangeHandler);

  // directionsDisplay.addListener("directions_changed", function() {
  //   calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
  // });
}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  };

  // Retrieve the start and end locations and create a DirectionsRequest using
  // WALKING directions.
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: google.maps.TravelMode.BICYCLING,
    provideRouteAlternatives: true
  }, function(response, status) {
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(response.routes[0].warnings);
      directionsDisplay.setDirections(response);
      directionsDisplay.setPanel(document.getElementById("directionsPanel"));
      showSteps(response, markerArray, stepDisplay, map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

var path = [];
function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  var myRoute = directionResult.routes[0].legs[0];
  for (var j = 0; j < myRoute.steps.length; j ++ ){
    for (var f = 0; f < myRoute.steps[j].lat_lngs.length; f++) {
      console.log("This is the latitude:" + myRoute.steps[j].lat_lngs[f].lat());
      console.log("This is the longitude:" + myRoute.steps[j].lat_lngs[f].lng());
      var latitude = myRoute.steps[j].lat_lngs[f].lat();
      var longitude = myRoute.steps[j].lat_lngs[f].lng()
      latitude_longitudeObj = {lat: latitude, lng: longitude};

path.push(latitude_longitudeObj);
}
console.log(path);
}

var elevator = new google.maps.ElevationService;

// Draw the path, using the Visualization API and the Elevation service.
displayPathElevation(path, elevator, map);

function displayPathElevation(path, elevator, map) {
 // Display a polyline of the elevation path.
 new google.maps.Polyline({
   path: path,
   strokeColor: '#7d7df2 ',
   opacity: 0.4,
   map: map
 });

 // Create a PathElevationRequest object using this array.
 // Ask for 256 samples along that path.
 // Initiate the path request.
 elevator.getElevationAlongPath({
   'path': path,
   'samples': 256
 }, plotElevation);
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
google.load('visualization', '1', {packages: ['columnchart']});
 // Extract the data from which to populate the chart.
 // Because the samples are equidistant, the 'Sample'
 // column here does double duty as distance along the
 // X axis.
 var data = new google.visualization.DataTable();
 data.addColumn('string', 'Sample');
 data.addColumn('number', 'Elevation');
 for (var i = 0; i < elevations.length; i++) {
   data.addRow(['', elevations[i].elevation]);
 }
 // Create a new chart in the elevation_chart DIV.
 var chart = new google.visualization.ColumnChart(chartDiv);

 // Draw the chart using the data within its DIV.
 chart.draw(data, {
   height: 150,
   legend: 'none',
   titleY: 'Elevation (m)'
 });
}

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
        stepDisplay, marker, myRoute.steps[i].instructions, map);
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
