
// initialize gmt 
gmt_name = 'ChEA'
// gmt_name = 'KEA'


// request clustergram 
$( "#searchForm" ).submit( function( event ) {

  // stop form from working normally 
  event.preventDefault();
 
  // only make request if there are genes 
  if ( $('#gene_input_box').val() == ''){
    $('#modal_no_input').modal()
  }
  // make request 
  else {

    // get data from forms 
    var $form = $( this );
    
    // get gene names from textarea 
    var inst_genes = $form.find( "textarea[name='genes']" ).val();
    var url = $form.attr( "action" );

    // number of enriched terms 
    num_terms = 20; 

    // docker_vs_local
    /////////////////////////////////
    // manually set url (local - works for local and docker)
    url = '/enrichrgram/'
    // // !!! (docker - does not work)
    // url = '/'

    // set up variable for the post request with gene list: inst_genes
    var posting = $.post( url, { genes: inst_genes, num_terms: num_terms, gmt_colors:JSON.stringify(gmt_colors) } );
   
    console.log('making post request')

    // set up wait message before request is made 
    $.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .8, 
            color: '#fff' 
        } });

    // when results are returned from flask 
    // generate the d3 visualization 
    posting.done( function( network_data ) { 

      // wait message 
      d3.select('.blockMsg').select('h1').text('Waiting for matrix to load...');

      // make d3 visualization
      make_d3_clustergram(network_data)
   
      // change the title of the terms 
      // d3.select('#col_title').text( 'Enriched ' + gmt_name.replace( /_/g, ' ') + ' Terms')
      d3.select('#col_title').text( 'Enriched Terms')

      // turn off the wait sign 
      $.unblockUI();

      // // toggle close the sidebar
      // d3.select('#wrapper').attr('class','toggled')

    });

  }; // end make requst

});


