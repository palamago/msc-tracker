$(document).ready(function(){

  d3.csv("data/tracking.csv?t="+Date.now(), function(tracks){
    console.log(tracks);
  });


  function openModal(){  
    var content = '<p><strong>Actualizado: </strong>El '+position.date.replace(' ',' a las ')+'</p>'+
                 '<p><strong>Latitud: </strong>'+position.lat+'   <strong>Longitud: </strong>'+position.lng+'</p>'+
                 '<p><strong>Vista proa: </strong><img style="width:100%" src="'+position.proa+'"/></p>'+
                 '<p><strong>Vista popa: </strong><img style="width:100%" src="'+position.popa+'"/></p>';
        //infowindow.open(map, marker);
        $('#details').find('.modal-body').html(content);
        $('#details').modal('show');
  }

});

