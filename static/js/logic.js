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

// Style the markers
// let markerStyle = {

// };

let metadata = [];
let magnitude = [];
let place = [];
let depth = [];

// Bring in data for markers
d3.json(url).then(function(data){
    // console.log(data.features.length);

    for (let i = 0; i < data.features.length; i++) {
        magnitude[i] = [data["features"][i]["properties"]["mag"]];
        place[i] = [data["features"][i]["properties"]["place"]];
        depth[i] = [data["features"][i]["geometry"]["coordinates"][2]];
    };

    console.log("Magnitudes: ", magnitude);
    console.log("Locations: ", place);
    console.log("Depths (km): ", depth);

    for (let j = 0; j < data.features.length; j++) {
        metadata[j] = ("Magnitude: " + String(magnitude[j]) + "Location: " + String(place[j]) + "Depth: " + String(depth[j]));
    };
    
    console.log("Metadata: ", metadata);

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        }
    }).bindPopup(metadata).addTo(myMap);
})
