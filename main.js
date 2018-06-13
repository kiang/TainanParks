window.app = {};
var app = window.app;

app.Button = function(opt_options) {
  var options = opt_options || {};
  var button = document.createElement('button');
  button.innerHTML = options.bText;
  var this_ = this;
  var handleButtonClick = function() {
    window.open(options.bHref);
  };

  button.addEventListener('click', handleButtonClick, false);
  button.addEventListener('touchstart', handleButtonClick, false);

  var element = document.createElement('div');
  element.className = options.bClassName + ' ol-unselectable ol-control';
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
}
ol.inherits(app.Button, ol.control.Control);

var layerGreen = new ol.style.Style({
  image: new ol.style.RegularShape({
    fill: new ol.style.Fill({
        color: 'rgba(0,200,0,0.6)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,0.3)',
        width: 2
    }),
    points: 5,
    radius: 10,
    radius2: 4,
    angle: 0
  })
});

var layerYellow = new ol.style.Style({
  image: new ol.style.RegularShape({
    fill: new ol.style.Fill({
        color: 'rgba(255,255,0,0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,0.3)',
        width: 2
    }),
    points: 3,
    radius: 10,
    radius2: 4,
    angle: 0
  })
});

var layerBrown = new ol.style.Style({
  image: new ol.style.RegularShape({
    fill: new ol.style.Fill({
        color: 'rgba(165,42,42,0.6)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,0.3)',
        width: 2
    }),
    points: 6,
    radius: 10,
    radius2: 4,
    angle: 0
  })
});

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var popup = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

closer.onclick = function() {
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

var baseLayer = new ol.layer.Tile({
    source: new ol.source.WMTS({
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        url: 'http://wmts.nlsc.gov.tw/wmts',
        layer: 'EMAP',
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true,
        attributions: '<a href="http://maps.nlsc.gov.tw/" target="_blank">國土測繪圖資服務雲</a>'
    }),
    opacity: 0.5
});

var parks = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'parks.json',
        format: new ol.format.GeoJSON()
    }),
    style: layerGreen
});

var cunliColors = {
  y: new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(200,200,0,0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1
    })
  }),
  r: new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(200,0,0,0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1
    })
  }),
  g: new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(0,200,0,0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1
    })
  }),
  b: new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(0,0,200,0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1
    })
  }),
  c: new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(200,0,200,0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1
    })
  })
};

var cunli = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'cunli.json',
        format: new ol.format.GeoJSON()
    }),
    style: function(f) {
      switch(f.get('VILLCODE')) {
        case '67000340032':
        case '67000340008':
        case '67000340007':
        case '67000340004':
        case '67000340019':
        case '67000340044':
        case '67000340045':
        case '67000340005':
        case '67000340001':
        return cunliColors.y;
        break;
        case '67000340039':
        case '67000340046':
        case '67000340023':
        case '67000340048':
        case '67000340049':
        case '67000340047':
        case '67000340020':
        case '67000340040':
        case '67000340053':
        case '67000340052':
        case '67000340024':
        return cunliColors.c;
        break;
        case '67000340025':
        case '67000340056':
        case '67000340041':
        case '67000340055':
        case '67000370033':
        case '67000370034':
        case '67000340026':
        case '67000340043':
        case '67000340042':
        case '67000340018':
        case '67000370025':
        return cunliColors.r;
        break;
        case '67000370048':
        case '67000370045':
        case '67000370031':
        case '67000370046':
        case '67000370047':
        case '67000370054':
        case '67000370044':
        case '67000370043':
        case '67000370022':
        case '67000370054':
        case '67000340054':
        return cunliColors.g;
        break;
        case '67000340050':
        case '67000340033':
        case '67000340051':
        case '67000370005':
        case '67000370039':
        case '67000370040':
        case '67000370016':
        case '67000370011':
        case '67000370009':
        case '67000370007':
        case '67000370041':
        case '67000370042':
        case '':
        return cunliColors.b;
        break;
      }
    }
});

var ac = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'ac.json',
        format: new ol.format.GeoJSON()
    }),
    style: layerYellow
});

var school = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'school.json',
        format: new ol.format.GeoJSON()
    }),
    style: layerBrown
});

var appView = new ol.View({
  center: ol.proj.fromLonLat([120.19061375048825, 23.00687226736852]),
  zoom: 14
});

var map = new ol.Map({
  layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
          }), parks, ac, cunli],
  overlays: [popup],
  target: 'map',
  view: appView,
  controls: ol.control.defaults().extend([
    new app.Button({
      bClassName: 'app-button1',
      bText: '原',
      bHref: 'https://github.com/kiang/TainanParks'
    }),
    new app.Button({
      bClassName: 'app-button2',
      bText: '江',
      bHref: 'http://k.olc.tw/'
    })
  ])
});

var geolocation = new ol.Geolocation({
  projection: appView.getProjection()
});

geolocation.setTracking(true);

geolocation.on('error', function(error) {
        console.log(error.message);
      });

var positionFeature = new ol.Feature();

positionFeature.setStyle(new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: '#3399CC'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    })
  })
}));

geolocation.on('change:position', function() {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ?
          new ol.geom.Point(coordinates) : null);
      });

      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [positionFeature]
        })
      });
/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  var message = '';
  var weight = 0;

  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      var p = feature.getProperties();
      for(k in p) {
        if(k !== 'geometry') {
          message += k + ': ' + p[k] + '<br />';
        }
      }
  });
  if(message !== '') {
    content.innerHTML = message;
    popup.setPosition(coordinate);
  } else {
    popup.setPosition(undefined);
    closer.blur();
  }

});
