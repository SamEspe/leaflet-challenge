// Get URL for GeoJSON
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create Leaflet map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3
  });

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Bring in data for markers
d3.json(url).then(function(data){

    let depth = [];
    
    // Create array of depths
    for (let i = 0; i < data.features.length; i++) {
        depth[i] = data["features"][i]["geometry"]["coordinates"][2];
    };

    // Find the depth of the deepest earthquake
    let maxDepth = Math.max(...depth);

    function depthConversion(depth){
        // Create conversion factor that scales each earthquake's depth to the deepest one
        const factor = 255/maxDepth;
        // Convert the depth relative to deepest earthquake
        let conversion = factor * depth;
        // Convert the relative depth to a Hexadecimal string
        let color = (Math.trunc(conversion)).toString(16);
        // A negative depth doesn't make sense, so I set it to 0km
        if (color < 0) {
            color = "0";
            };
        //  If the hexadecimal string has more than two digits, set it to the maximum value of a 2-digit hexadecimal string  
        if (color.length > 2){
            color = "ff"
            };
        // If the hexadecimal string is only one digit, add a leading 0
        if (color.length < 2){
            color = "0" + color
            }
        return color
        }
    
    L.geoJson(data, {
        onEachFeature: function(feature, layer){
            // Add a popup to each feature
            let color = "#" + depthConversion(feature.geometry.coordinates[2]) + depthConversion(maxDepth - feature.geometry.coordinates[2]) + "3a"

            layer.bindPopup("<dl><dt>Magnitude:</dt><dd>" + feature.properties.mag + "</dd><dt>Location:</dt><dd>" + feature.properties.place + "</dd><dt>Depth:</dt><dd>" + feature.geometry.coordinates[2] + " km</dd><dt>Color:</dt><dd>" + color + "</dl>")
        },
        pointToLayer: function(feature, latlng){
            // Create circles at the lat/long coordinates of each earthquake
            return L.circleMarker(latlng, {
                // Use depthConversion function to create hexadecimal color string. Deeper earthquakes are redder, and shallow earthquakes are greener.
                color: "#" + depthConversion(feature.geometry.coordinates[2]) + depthConversion(maxDepth - feature.geometry.coordinates[2]) + "3a",
                fillOpacity: 0.4,
                // Scale the radius to the magnitude. Richter scale magnitudes are logarithmic (base 10). I made my scale base 2 so that you can see the difference between magnitudes without making circles that are as large as the map
                radius: ((2 ** feature.properties.mag)/2) + 1
            }) 
        }
    }).addTo(myMap);
})