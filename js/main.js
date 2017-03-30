function initMap() {
  
  d3.csv("data/tracking.csv", function(tracks){
    var position = tracks.reverse()[0];
    position.lat = parseFloat(position.lat);
    position.lng = parseFloat(position.lng);
    $('#map').height($(window).height());
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: position
    });
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
  });

}