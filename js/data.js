$(document).ready(function(){

  d3.csv("data/tracking.csv?t="+Date.now(), function(tracks){
    
    var labels = tracks.columns.map(function(c){
      return { title: c }
    });

    var dataSet = tracks.filter(function(c){
      return (c.proa);
    }).map(function(t){
      return [t.date,t.lat,t.lng,t.proa,t.popa,t.md5_proa,t.md5_popa]
    });

    $('#data').dataTable( {
      data: dataSet,
      columns: labels,
      scrollY:        400,
      deferRender:    true,
      scroller:       true,
      responsive: true,
      "columnDefs": [
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return '<img width="100" src="'+data+'"/>';
                },
                "targets": [3,4]
            }
        ]
    });
  });

});

