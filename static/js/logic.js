// Get URL for GeoJSON
// const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

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
    
    // Construct the 6-digit hexadecimal string to define the color for each marker
    function colorString(depth){
        let outputString = "#" + depthConversion(depth) + depthConversion(maxDepth - depth) + "3a";
        return outputString;
    };

    // Calculate the colors for the legend. The legend consists of 5 color blocks representing a depth of 0 km at one extreme,
    // the maximum depth in the data set at the other extreme, and 3 intermediate points (25%, 50%. and 75% of the maximum depth).
    function colorGrades(maxDepth) {
        let colorGradesArray = [];

        for (let k = 0; k < 1.25; k = k + 0.25) {
            let colorBarCode = "#" + depthConversion(k * maxDepth) + depthConversion(maxDepth - k*maxDepth) + "3a";
            colorGradesArray.push(colorBarCode);
        };
        return colorGradesArray;
    };

    // Create legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function (myMap) {
        // Create a div for the legend to occupy
        let div = L.DomUtil.create('div', 'legend');
        
        // Provide the colors for the legend
        grades = colorGrades(maxDepth);
        
        // Provide the labels for the colors in the legend
        labels=[String(0)+" km", String(Math.trunc(0.25*maxDepth)) + " km", String(Math.trunc(0.5*maxDepth))+" km", String(Math.trunc(0.75*maxDepth))+" km", String(Math.trunc(maxDepth))+" km"];
        
        // Make a heading for the legend
        div.innerHTML += '<h4>Earthquake </br> Depth</h4>';
        
        // Construct the legend in the div.
        for (let j = 0; j < grades.length; j++) {
            div.innerHTML +=
                '<li><i style="background:' + grades[j] + '"></i> ' + labels[j] + "</li>"
        };
        return div
    };
    // Add the legend to the map
    legend.addTo(myMap);

    L.geoJson(data, {        
        onEachFeature: function(feature, layer){
            // Add a popup to each feature
            layer.bindPopup("<dl><dt>Magnitude:</dt><dd>" + feature.properties.mag + "</dd><dt>Location:</dt><dd>" + feature.properties.place + "</dd><dt>Depth:</dt><dd>" + feature.geometry.coordinates[2] + " km</dd><dt>Time:</dt><dd>" + new Date(feature.properties.time) + "</dd></dl>")
        },
        pointToLayer: function(feature, latlng){
            // Create circles at the lat/long coordinates of each earthquake
            return L.circleMarker(latlng, {
                // Use depthConversion function to create hexadecimal color string. Deeper earthquakes are redder, and shallow earthquakes are greener.
                color: colorString(feature.geometry.coordinates[2]),
                fillOpacity: 0.4,
                // Scale the radius to the magnitude. Richter scale magnitudes are logarithmic (base 10). I made my scale base 2 so that you can see the difference between magnitudes without making circles that are as large as the map
                radius: ((2 ** feature.properties.mag)/2) + 1
            }) 
        }
    }).addTo(myMap);
})