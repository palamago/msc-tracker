var styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

/*functions*/
function calcTime(offsetHours) {
  var nowHere = new Date();
  var nowUTC0 = new Date(nowHere.valueOf() + nowHere.getTimezoneOffset() * 60000);
  nowUTC0.setHours(nowUTC0.getHours() + offsetHours+1);
  return ((nowUTC0.getHours()) < 10 ? '0' : '') + (nowUTC0.getHours())+':'+(nowUTC0.getMinutes() < 10 ? '0' : '') + nowUTC0.getMinutes();
}

//from https://gist.github.com/basarat/4670200
//given "0-360" returns the nearest cardinal direction "N/NE/E/SE/S/SW/W/NW/N" 
function getCardinal(angle) {
    //easy to customize by changing the number of directions you have 
    var directions = 8;
    
    var degree = 360 / directions;
    angle = angle + degree/2;
    
    if (angle >= 0 * degree && angle < 1 * degree)
        return "norte";
    if (angle >= 1 * degree && angle < 2 * degree)
        return "noreste";
    if (angle >= 2 * degree && angle < 3 * degree)
        return "este";
    if (angle >= 3 * degree && angle < 4 * degree)
        return "sudeste";
    if (angle >= 4 * degree && angle < 5 * degree)
        return "sur";
    if (angle >= 5 * degree && angle < 6 * degree)
        return "suroeste";
    if (angle >= 6 * degree && angle < 7 * degree)
        return "oeste";
    if (angle >= 7 * degree && angle < 8 * degree)
        return "noroeste";
    //Should never happen: 
    return "norte";
}

function setWeather(position){
  //clima
  //http://api.openweathermap.org/data/2.5/weather?lat=-8.048022&lon=-34.867175&appid=a394a6fbb161a4cac37416ccd5480743&lang=es&units=metric
  var urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat='+position.lat+'&lon='+position.lng+'&appid=a394a6fbb161a4cac37416ccd5480743&lang=es&units=metric&callback=?';
  $.getJSON( urlWeather, function( data ) {
    $('#temp .data').html(parseInt(data.main.temp)+'º C');
    $('#temp .data-label').html('Temperatura en '+data.name);

    $('#wind .data').html((parseInt(data.wind.speed)*3.6).toFixed(0)+' km/h');
    $('#wind .data-label').html('Viento '+getCardinal(data.wind.deg));
    if(data.weather[0]){
      $('#icon .data').html('<img class="img-responsive" src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png"/>');
      $('#icon .data-label').html(data.weather[0].description);
    }
    //console.log(data);
  });
}

function setTime(position){
  //time geonames API
  //http://api.geonames.org/timezoneJSON?lat=-4.687032&lng=-32.76278&username=palamago&callback=callback
  var urlTime = 'http://api.geonames.org/timezoneJSON?lat='+position.lat+'&lng='+position.lng+'&username=palamago&callback=?'; 
  $.getJSON( urlTime, function( data ) {
    
    $('#date .data').html(calcTime(data.rawOffset));
    $('#date .data-label').html((data.countryName)?data.countryName:'Alta mar');
    //console.log(data);
  });

  //https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1491245642752&key=AIzaSyCBg51hxe-fK9ML6owYNyAUY_GVkFncMwY&language=es
  /*var timestamp = Date.now() / 1000;
  var urlTime = 'https://maps.googleapis.com/maps/api/timezone/json?location='+position.lat+','+position.lng+'&timestamp='+timestamp+'&key=AIzaSyCBg51hxe-fK9ML6owYNyAUY_GVkFncMwY&language=es'; 
  $.getJSON( urlTime, function( data ) {
    $('#date .data').html(calcTime(data.rawOffset + data.dstOffset));
    $('#date .data-label').html(data.timeZoneName);
  });*/

}

function initMap() {
  
  //map
  var styledMap = new google.maps.StyledMapType(styles,{name: "Mapa oscuro"});
  var mapOptions = {
    zoom: 5,
    mapTypeControl: false,
    disableDefaultUI: true
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  d3.csv("data/tracking.csv?t="+Date.now(), function(tracks){

    tracks = tracks.map(function(t){
      t.lat = parseFloat(t.lat);
      t.lng = parseFloat(t.lng);
      t.date = t.date.split('_')[0] + ' ' + t.date.split('_')[1].replace(/-/g, ":");
      return t;
    });

    //position
    var position = tracks.reverse()[0];
    $('#map').height($(window).height());
    
    map.setCenter(position);

    //marker
    var marker = new google.maps.Marker({
      position: position,
/*      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10
      },*/
      animation: google.maps.Animation.DROP,
      map: map
    });

    setWeather(position);
    setTime(position);


    //infowindow
    /*var infowindow = new google.maps.InfoWindow({
      content: '<p><strong>Actualizado: </strong>El '+position.date.replace(' ',' a las ')+'</p>'+
               '<p><strong>Latitud: </strong>'+position.lat+'   <strong>Longitud: </strong>'+position.lng+'</p>'+
               '<p><strong>Proa: </strong><img style="width:100%" src="'+position.proa+'"/></p>'+
               '<p><strong>Popa: </strong><img style="width:100%" src="'+position.popa+'"/></p>'
    });*/

    marker.addListener('click', function() {
      var content = '<p><strong>Actualizado: </strong>El '+position.date.replace(' ',' a las ')+'</p>'+
               '<p><strong>Latitud: </strong>'+position.lat+'   <strong>Longitud: </strong>'+position.lng+'</p>'+
               '<p><strong>Vista proa: </strong><img style="width:100%" src="'+position.proa+'"/></p>'+
               '<p><strong>Vista popa: </strong><img style="width:100%" src="'+position.popa+'"/></p>';
      //infowindow.open(map, marker);
      $('#details').find('.modal-body').html(content);
      $('#details').modal('show');
    });

    //polilyne
    var course = new google.maps.Polyline({
      path: tracks,
      geodesic: true,
      strokeColor: '#f7685c',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    course.setMap(map);

  });

}