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

    for (let i = 0; i < data.features.length; i++) {
        depth[i] = data["features"][i]["geometry"]["coordinates"][2];
    };

    console.log(depth);
    let maxDepth = Math.max(...depth);
    console.log(maxDepth);
    console.log("HEx#"+ (Math.trunc(((255/maxDepth) * 600))).toString(16));

    L.geoJson(data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup("<dl><dt>Magnitude</dt><dd>" + feature.properties.mag + "</dd><dt>Location</dt><dd>" + feature.properties.place + "</dd><dt>Depth</dt><dd>" + feature.geometry.coordinates[2] + " km</dd></dl>")
        },
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                color: "#"+ (Math.trunc(((maxDepth/255) * feature.geometry.coordinates[2]))).toString(16) + (255 - (Math.trunc(((maxDepth/255) * feature.geometry.coordinates[2])))).toString(16) + "0",
                // Set the radius proportional to the magnitude of the earthquake. I chose to scale the logarithmic from base 2 instead
                // of base 10 so that the smaller ones could still be seen, but the bigger ones don't take over the map
                radius: ((2 ** feature.properties.mag)/2) + 1
            }) 
        }
    }).addTo(myMap);
})
