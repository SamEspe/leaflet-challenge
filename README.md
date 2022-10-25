# Mapping Earthquakes with Leaflet

## Contributor: Sam Espe

### Overview
In this project, I created a map that visualizes the last 30 days of earthquake data, as compiled and provided by the United States Geological Survey (USGS).

#### Data Source
The USGS provides data on earthquakes around the world [here](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) for people to use. They provide different data sets so one can choose a set for a relevant time frame and magnitude range. I chose to use the data set that contained all of the earthquakes from the last 30 days. Each data set is in a geoJSON format, a standardized JSON used for geographical data. The website accesses the relevant geoJSON by the direct URL: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson. The 30-day geoJSON is updated every minute, so obtaining the geoJSON directly from the website, instead of downloading a particular geoJSON, provides the most up-to-date earthquake data.

#### Displaying the Data
I created a map using the Leaflet JavaScript library. I used OpenStreetMap as my base map, and created a layer of markers representing the earthquakes. Each marker has a pop-up feature that, when clicked, displays 

Each earthquake is represented by a circle marker centered on the epicenter. The size of the circle corresponds to the magnitude of the earthquake, with higher magnitude earthquakes having a larger radius. Because the magnitude scale for earthquakes is exponential — that is, a 5.0 earthquake is 10 times more powerful than a 4.0 — the radius of the circle markers is also exponential. The radius is a base 2 exponent instead of a base 10 so that the magnitudes can be accurately displayed while keeping the largest earthquakes from overtaking the entire map. 

The color of the circle represents the depth of the earthquake's hypocenter (the place inside the earth where the earthquake starts). The markers occupy a range from green to red, where green markers represent shallow earthquakes and red markers indicate the deepest earthquakes. The colors are calculated by finding the deepest earthquake in the set, and scaling all other earthquakes relative to that. 

The legend displays the color of the shallowest possible earthquake (0 km), the deepest earthquake in the data set, and three intermediate depths: 25%, 50%, and 75% of the maximum depth. This way, the color more accurately reflects the distribution of depths within the data set.

### Viewing the Map
This map can be viewed by opening the files in Visual Studio Code and opening the HTML file with Live Server. This page is also hosted on GitHub Pages at the following URL: https://samespe.github.io/leaflet-challenge/.
