
// gene input form 
$( "#searchForm" ).submit( function( event ) {
 
  // stop form from working normally 
  event.preventDefault();
 
  // get data from forms 
  var $form = $( this );
  
  // get gene names from textarea 
  var inst_genes = $form.find( "textarea[name='genes']" ).val();
  var url = $form.attr( "action" );

  // number of enriched terms 
  num_terms = 30; 

  // manually set url
  // url = '/clustergram_flask/'
  // !!! temporarily change for local development 
  url = '/'

  // set up variable for the post request with gene list: inst_genes
  var posting = $.post( url, { genes: inst_genes, num_terms: num_terms } );
 
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
  // generate d3 visualization 
  posting.done( function( network_data ) { 

    // make a map from the returned object 
    make_new_map(network_data);

    // turn off the wait sign 
     $.unblockUI();

  });


});


function make_new_map(network_data){
  // remove old map
  d3.select("#main_svg").remove();
  d3.select('#kinase_substrates').remove();

  // wait message 
  d3.select('.blockMsg').select('h1').text('Waiting for matrix to load...');

  // pass in data and callback function 
  start_making_exp_map(network_data, make_svg_enrichment_genes );

};

// get parameters from sim_matrix before the matrix is made
function start_making_exp_map(sim_matrix, callback) {

  // after all of the variables have been initialized then run the callback function 
  callback(sim_matrix); 
};


