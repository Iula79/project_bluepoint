#Project Blue Point Route Finder: 
## "Because your commute doesn't have to be an uphill battle" 
--------------------

### Mission Statement: 
Our app was designed to find the path between two points that offers the fewest number of hills.  Thus, making your trip a lot easier.

### To accomplish this task we utilized: 
+ [Google Maps Javascript API] (https://developers.google.com/maps/documentation/javascript/). 
+ NodeJS
+ Express
+ MongoDB

### App abilities and functionality: 

The Google Maps API allowed us to get route data as well as possible alternative routes to our destination. 
We then had to split up the route data into legs and run a seperate elevation function on those legs. We were able to then utilized this data
and the standard deviation from the average elevation to determine which path had the fewest number of hills and elevation changes. 

All users on our site will be able to search for the ideal route between any two given points.
Our app also allows users to create a unique account and save favorite routes.  These favorite routes will display when the user is signed in. 

