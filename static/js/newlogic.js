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

    let colorList = [];

    // let depthRange = maxDepth;

    // for (let i = 0; i < 10; i++){
    //     depthRange = 
    // };

    function depthConversion(depth){
        const factor = 255/maxDepth;
        let conversion = factor * depth;

        console.log("Conversion Decimal:", conversion);
        let red = (Math.trunc(conversion)).toString(16);
        console.log(red);
        if (red < 0) {
            red = "0";
        };
        if (red.length > 2){
            red = "ff"
        };
        if (red.length < 2){
            red = "0" + red
        }
        
        console.log("Red adjusted: ", red);
        return red
        }
    
    L.geoJson(data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup("<dl><dt>Magnitude</dt><dd>" + feature.properties.mag + "</dd><dt>Location</dt><dd>" + feature.properties.place + "</dd><dt>Depth</dt><dd>" + feature.geometry.coordinates[2] + " km</dd></dl>")
        },
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                color: "#" + depthConversion(feature.geometry.coordinates[2]) + depthConversion(maxDepth - feature.geometry.coordinates[2]) + "00",
                radius: ((2 ** feature.properties.mag)/2) + 1
            }) 
        }
    }).addTo(myMap);
})