// create function for styling districts layer
function getStyle(feature) {
    if (feature.properties.PARTY === 'Democrat') {
        return {
            fillColor: 'blue',
            color: 'white',
            weight: 1,
            opactity: 0.5,
//            dashArray: '3',
            fillOpacity: 0.7
        };
    } else if (feature.properties.PARTY === 'Republican') {
        return {
            fillColor: 'red',
            color: 'white',
            weight: 1,
            opactity: 0.5,
//            dashArray: '3',
            fillOpacity: 0.7
        };
    } else {
        return {
            fillColor: 'white',
            color: 'white',
            weight: 2,
            opactity: 1,
            dashArray: '3',
            fillOpacity: 0.7

        };
    }
}

// function for a mouseover event
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        darshArray: '',
        fillOpacity: 0.7
    });

    if (L.Browser.ie && L.Browser.opera && L.Broswer.edge) {
        layer.bringToFront();
    }

    var mapLegend = document.getElementById('map-legend');
    if (layer.feature.properties.PARTY === 'Democrat') {
        mapLegend.innerHTML = layer.feature.properties.NAME;
        mapLegend.style = 'color:Blue';
    } else if (layer.feature.properties.PARTY === 'Republican') {
        mapLegend.innerHTML = layer.feature.properties.NAME;
        mapLegend.style = 'color:red';
    } else {
        mapLegend.innerHTML = null;
    }
}

// function to reset style after mouseover event
function resetHighlight(e) {
    districts.resetStyle(e.target);
    document.getElementById('map-legend').innerHTML = null;
}

// function to zoom to feature on a click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


//parent function so highlightFeature, resetHighlight, and zoomToFeature can be applied to each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    if (feature.properties) {
        layer.bindPopup(`
        <h3>District ID: ${feature.properties.DISTRICTID}</h3>
        <p>Representative: ${feature.properties.NAME}</p>
        <p>Party: ${feature.properties.PARTY}</p>
        `);
    }
}

// create variable for basemap
var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

// create variable for alternative basemap
var esriTopo = L.esri.basemapLayer('Topographic');

// create variable for districts layer
var districts = L.esri.featureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Congressional_Districts/FeatureServer/0',
    simplifyFactor: 0.5,
    precision: 5,
    //apply styling function
    style: getStyle,
    //applies function to each feature
    onEachFeature: onEachFeature
});

// create map, baselayers, and overlay variables
var map = L.map('map', {
    center: [39, -97.5],
    zoom: 4,
    layers: [Stamen_TonerLite, districts]
});

var baseLayers = {
    'Stamen Toner': Stamen_TonerLite,
    'ESRI topo': esriTopo,
};

var overlays = {
    'U.S. districts': districts,
};

//add baselayers and overlays to the map
L.control.layers(baseLayers, overlays).addTo(map);
