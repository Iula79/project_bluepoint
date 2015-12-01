function loadGoogle() {
    if (typeof google != 'undefined' && google && google.load) {
        google.load('visualization', '1', {
            packages: ['columnchart']
        });
    } else {
        setTimeout(loadGoogle, 30);
    }
}
loadGoogle();


function initMap() {
    var markerArray = [];


    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService();

    //Create an ElevationService
    var elevator = new google.maps.ElevationService();

    var stepDisplay = new google.maps.InfoWindow();

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


    // Listen to change events from the start and end lists.
    var onChangeHandler = function() {
        //Calculates the route on the map
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Displays the elevation on the map
        displayLocationElevation({lat: 40.76521, lng: -73.98028000000001}, elevator, stepDisplay, map);
    };
    document.getElementById('submit').addEventListener('click', onChangeHandler);

}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

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
}

path = [];
//making a function that shows latitude and longitude for every step in the path and pushes the values to a path array
function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var j = 0; j < myRoute.steps.length; j++) {
        for (var f = 0; f < myRoute.steps[j].lat_lngs.length; f++) {
            console.log("This is the latitude:" + myRoute.steps[j].lat_lngs[f].lat());
            console.log("This is the longitude:" + myRoute.steps[j].lat_lngs[f].lng());
            var latitude = myRoute.steps[j].lat_lngs[f].lat();
            var longitude = myRoute.steps[j].lat_lngs[f].lng();
            latitude_longitudeObj = {
                lat: latitude,
                lng: longitude
            };

            path.push(latitude_longitudeObj);
        }
        console.log(path[j]);
    }
}


function displayLocationElevation(location, elevator, stepDisplay, map) {
    elevator.getElevationForLocations({
   'locations': [location]
 }, function(results, status) {
   stepDisplay.setPosition(location);
   if (status === google.maps.ElevationStatus.OK) {
     // Retrieve the first result
     if (results[0]) {
       // Open the infowindow indicating the elevation at the clicked position.
       stepDisplay.setContent('The elevation at this point <br>is ' +
           results[0].elevation + ' meters.');
     } else {
       stepDisplay.setContent('No results found');
     }
   } else {
     stepDisplay.setContent('Elevation service failed due to: ' + status);
   }
 });
}
