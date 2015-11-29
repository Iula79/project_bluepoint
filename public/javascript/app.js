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
    }).done(function(data) {});
    $('#login').click(signIn);
    $('#logout').click(signOut);
    $('#signup').click(signUp);
});

function loadGoogle() {
    if (typeof google != 'undefined' && google && google.load) {
        google.load('visualization', '1', {
            packages: ['columnchart']
        });
        initMap();
    } else {
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




    map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');
    // Listen to change events from the start and end lists.
    var onChangeHandler = function() {
        //console.log("change handler");
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);


    };
    //
    $('#submit').click(onChangeHandler);
    // directionsDisplay.addListener("drag", onChangeHandler);
    pathsArray = []

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
                    myPath = new Object();
                    myPath.pathName = "path" + i;
                    myPath.lat_long = [];
                    myPath.elevations = [];
                    myPath.standardDeviation = 0;
                    pathsArray.push(myPath)
                    new google.maps.DirectionsRenderer({
                        map: map,
                        directions: response,
                        draggable: true,
                        routeIndex: i
                    });
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



        var arrayOfPathsCoordinates = [];

        function showSteps(directionResult) {
            // For each step, place a marker, and add the text to the marker's infowindow.
            // Also attach the marker to an array so we can keep track of it and remove it
            // when calculating new routes
            // Loop over all possible routes and print legs

            // a result of a directionResult request is an object for each route, that contains an object "leg" (an array of one element) that contains an array with a certain number of object "steps" that each contains an array with a certain number of "lat_long" functions that each contains a lat and a long. We are looping over the result in order to get those lat and long.

            console.log("These are the routes:");
            console.log(directionResult.routes);
            console.log("THIS IS HOW MANY ROUTES THERE ARE AND I AM OUTSIDE OF THE FOR LOOP:");
            console.log(directionResult.routes.length);
            for (var i = 0; i < directionResult.routes.length; i++) {
                var myRoute = directionResult.routes[i].legs[0];
                //console.log(directionResult.routes[i].legs[0]);
                var arrayOfSteps = [];
                console.log("this is my route " + i);
                console.log(myRoute);
                console.log("these are the steps for route " + i);
                console.log(myRoute.steps);
                console.log("this is how many steps there are in route " + i);
                console.log(myRoute.steps.length);
                setMarkers();
                for (var j = 0; j < myRoute.steps.length; j++) {

                    console.log("this is step number " + j + "of route " + i);
                    console.log(myRoute.steps[j]);
                    console.log("this is how many lats and length there are in step " + j + "of route " + i);
                    console.log(myRoute.steps[j].lat_lngs.length);
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
                        arrayOfSteps.push(latitude_longitudeObj);
                    }
                }
                console.log(arrayOfSteps);
                pathsArray[i].lat_long = arrayOfSteps
                arrayOfPathsCoordinates.push(arrayOfSteps);
            }
            console.log(arrayOfPathsCoordinates);


            //creating a new location map
            var elevator = new google.maps.ElevationService();

            // Draw the path, using the Visualization API and the Elevation service.
            displayPathElevation(arrayOfPathsCoordinates, elevator, map);
            //console.log("here!")



            function displayPathElevation(path, elevator, map) {

                for (var d = 0; d < path.length; d++) {
                    singlePath = path[d];
                    //console.log(newPath)
                    $("<canvas>", {
                        'id': "MyChart" + d,
                        'class': "canvas"
                    }).appendTo('#container');

                    // Display a polyline of the elevation path.
                    new google.maps.Polyline({
                        path: singlePath,
                        strokeColor: 'rgb(255, 15, 15) ',
                        opacity: 0.4,
                        map: map
                    });

                    // Create a PathElevationRequest object using this array.
                    // Ask for 10 samples along that path.
                    // Initiate the path request.
                    elevator.getElevationAlongPath({
                        'path': singlePath,
                        'samples': 10
                    }, plotElevation);
                    //for resultset in response['results']:
                    // elevationArray = [];
                    // elevationArray.push(results[d].elevation);
                    // console.log("this is elevationArray");
                    // console.log(elevationArray);
                }

                // Takes an array of ElevationResult objects, draws the path on the map
                // and plots the elevation profile on a Visualization API ColumnChart.

                arrayOfPathElevations = []

                function plotElevation(elevations, status) {
                    //console.log(elevations)
                    var elevationList = [];
                    console.log(status)
                    var chartDiv = document.getElementById('elevation_chart');
                    if (status !== google.maps.ElevationStatus.OK) {
                        // Show the error code inside the chartDiv.
                        chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
                            status;
                        return;
                    }

                    // Extract the data from which to populate the chart.
                    // Because the samples are equidistant, the 'Sample'
                    // column here does double duty as distance along the
                    // X axis.

                    var data = new google.visualization.DataTable();
                    console.log("This is data:");
                    console.log(data);
                    data.addColumn('string', 'Sample');
                    data.addColumn('number', 'Elevation');
                    for (var i = 0; i < elevations.length; i++) {
                        data.addRow(['', elevations[i].elevation]);

                        //console.log("this is elevations " + elevations[i].elevation);
                        singleSpotElevation = elevations[i].elevation;
                        elevationList.push(singleSpotElevation);
                    }
                    console.log("elevationList: " + elevationList);

                    arrayOfPathElevations.push(elevationList);;
                    // Create a new chart in the elevation_chart DIV.

                    // var chart = new google.visualization.ColumnChart(chartDiv);
                    // // Draw the chart using the data within its DIV.
                    // chart.draw(data, {
                    //     height: 150,
                    //     legend: 'none',
                    //     titleY: 'Elevation (m)'
                    // });
                    var data = {
                        labels: ["step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8","step9","step10"],
                        datasets: [{
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: elevationList
                        }]
                    };
                    var ctx = document.getElementById("MyChart" + "0").getContext("2d");
                    var myLineChart = new Chart(ctx).Line(data)

                    calculateBestPath(arrayOfPathElevations);
                    // end of plotElevation
                }
                console.log(arrayOfPathElevations);

                function standardDeviation(array) {
                    var avg = average(array);

                    var squareDiffs = array.map(function(value) {
                        var diff = value - avg;
                        var sqrDiff = diff * diff;
                        return sqrDiff;
                    });

                    var avgSquareDiff = average(squareDiffs);

                    var stdDev = Math.sqrt(avgSquareDiff);
                    return stdDev;
                }

                function average(array) {
                    var total = 0;
                    array.forEach(function(val) {
                        total += val;
                    });
                    var avg = total / array.length;
                    return (avg);
                }


                function calculateBestPath(paths) {

                    console.log("this is paths");
                    console.log(paths);
                    console.log(paths.length);
                    deviationsObjects = [];
                    deviationsArray = [];
                    for (var i = 0; i < paths.length; i++) {
                        console.log("this is the deviation for path" + i);
                        console.log(standardDeviation(paths[i]));
                        var myObject = new Object();
                        myObject.pathName = "path" + i;
                        myObject.deviation = standardDeviation(paths[i]);
                        var deviation = standardDeviation(paths[i]);
                        deviationsArray.push(deviation);
                        deviationsObjects.push(myObject);
                    }
                    console.log(deviationsArray);
                    console.log(deviationsObjects);
                    var min = Math.min(...deviationsArray);
                    for (var j = 0; j < deviationsObjects.length; j++) {
                        if (min === deviationsObjects[j].deviation) {
                            alert("the best path is " + deviationsObjects[j].pathName)
                            return deviationsObjects[j].pathName;
                        }
                    }
                }


                //end of displayPathElevation
            }

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
            // end of showSteps
        }
        //end of calculateAndDisplayRoute
    }


    function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    }
    //end of initMap
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
  console.log("signing in");
  var userObject = {
    name: $('#username').val(),
    password: $('#password').val()
  };
  $.get('/users/', userObject, function(data) {
  });
  $.post('/sessions/', userObject, function(data){
  }).done(getSaveButton, getUpdateButton);
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
    $('body').append(userDiv);
    $(userDiv).append(saveButton);
    $('#logout').css({'display': 'block'});
    $('#login').css({'display': 'none'});
    $('#username').val('');
    $('#password').val('');
    $('#save-broute-button').on('click', saveRoute);
    $.ajax({
      url: "/users/" + data[0]._id + "/broutes",
      method: "GET"
    }).done(showBroutes);
};

var getUpdateButton = function(){
  var updateButton = $("<button>", {
    id: "update-button",
    text: "update profile"
  });
  $("#user-data").append(updateButton);
  updateButton.on('click', showUpdateForm);
};

var showUpdateForm = function(){
  var updateForm = $("<div>", {
    id: "update-form",
  });
  var updateName = $("<input>", {
    id: "update-name",
    placeholder: "Update Name"
  });
  var updateEmail = $("<input>", {
    id: "update-email",
    placeholder: "Update Email"
  });
  var submitUpdate = $("<button>", {
    id: "submit-update",
    text: "Change Profile"
  });
  var currentProfile = $("<p>", {
    id: "current-profile",
    text: "Name: " + userID[0].name + ", Email: " + userID[0].email
  });
  var cancelUpdate = $("<button>", {
    id: "cancel-update",
    text: "Cancel Update"
  })
  $(updateForm).remove();
  $(updateForm).append(currentProfile);
  $(updateForm).append(updateName);
  $(updateForm).append(updateEmail);
  $(updateForm).append(submitUpdate);
  $(updateForm).append(cancelUpdate);
  $('#user-data').append(updateForm);

  submitUpdate.on('click', changeProfile);
  cancelUpdate.on('click', removeUpdateForm);
};

var changeProfile = function(){
  if ($('#update-name').val() == "" || $('#update-email').val() == "") {
    alert("Please enter name and email");
  } else {
  var userObject = {
    name: $('#update-name').val(),
    email: $('#update-email').val()
  };
  $.ajax({
    url: "/users/" + userID[0]._id,
    method: "PUT",
    data: userObject
  }).done(removeUpdateForm);
};
};

var removeUpdateForm = function(){
  $('#update-form').detach();
  $.ajax({
    url: "/users/" + userID[0]._id,
    method: "GET"
  }).done(updateUserID);
};
var updateUserID = function(data){
  userID[0].name = data.name;
  userID[0].email = data.email;
  console.log(userID);
}

function showBroutes(data) {
  var savedBroutesDiv = $("<div>", {
    id: "saved-broutes-div"
  });
  $('#user-data').append(savedBroutesDiv);
  appendBroute(data);
};

function signOut() {
  console.log("signing out");
  userID = "";
  $.ajax({
    url: '/sessions',
    method: 'DELETE',
    success: function() {
      console.log('logged out');
  }});
  $('#user-data').remove();
  $('#login').css({'display': 'block'});
  $('#logout').css({'display': 'none'});
  $("#start").val("");
  $("#end").val("");
  initMap();
  $('#directionsPanel').css({'display': 'none'});
};

function saveRoute() {
  console.log('saving route');
  var start = $('#start').val();
  var end = $('#end').val();
  var brouteObject = {
    startPoint: start,
    endPoint: end
  };
  $.post("/users/" + userID[0]._id + "/broutes", brouteObject, function(data) {
  }).done(emptyBrouteList);
};

function getRouteToDelete(){
  $.ajax({
    url: "/users/" + userID[0]._id + "/broutes",
    method: "GET"
  }).done(deleteRoute);
};

function emptyBrouteList(){
  $('#saved-broutes-div').empty();
  $.ajax({
    url: "/users/" + userID[0]._id + "/broutes",
    method: "GET"
  }).done(appendBroute);
};

function appendBroute(data) {
  data.forEach(function(broute){
    var brouteStart = broute.startPoint;
    var brouteEnd = broute.endPoint;
    var brouteStart = broute.startPoint;
    var brouteEnd = broute.endPoint;
    var brouteID = broute._id;
    var deleteButton = $("<button>", {
      class: "delete-button",
      id: brouteID,
      text: "Delete Route"
    });
    var loadRouteButton = $("<button>", {
      class: "load-route-button",
      id: brouteID,
      text: "Load Route"
    });
    var oneBroute = $("<div>",{
      class: "one-broute",
    });
    var brouteTag = $("<p>", {
      text: "Start: " + brouteStart + ", End: " + brouteEnd
    });
    $(oneBroute).append(brouteTag);
    $(oneBroute).append(loadRouteButton);
    $(oneBroute).append(deleteButton);
    $('#saved-broutes-div').append(oneBroute);
    });
    $('.load-route-button').on('click', function(){
      $.ajax({
        url: '/users/' + userID[0]._id + "/broutes/" + $(this).attr('id'),
        method: "GET"
      }).done(getRouteValues);
        });
    $('.delete-button').on('click', function(){
      $.ajax({
        url: "/users/" + userID[0]._id + "/broutes/" + $(this).attr("id"),
        method: "DELETE"
      }).done(emptyBrouteList);
    });
};

var getRouteValues = function(data){
  $("#start").val(data.startPoint);
  $("#end").val(data.endPoint);
  initMap();
  $("#submit").click();
};
