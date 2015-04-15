

// test form 
$( "#searchForm" ).submit( function( event ) {
 
  // stop form from working normally 
  event.preventDefault();
 

  // get data from forms 
  var $form = $( this );
  

 	// get gene names from textarea 
  var inst_genes = $form.find( "textarea[name='genes']" ).val();
  var url = $form.attr( "action" );
 	
 	// console.log(inst_genes)

  // make the post 
  var posting = $.post( url, { genes: inst_genes } );
 
	  // set up wait message 
	  $.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .8, 
            color: '#fff' 
        } });

  // wait until results are returned from flask 
  posting.done(function( network_data ) {

    // try to make a map from the returned object 
    make_new_map(network_data);

		// turn off the wait sign 
	   $.unblockUI();

  });


});
