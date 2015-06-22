

// use d3 to load a json 
// d3.json('/harminogram/static/networks/network_cumul_probs.json', function(network_data){
d3.json('/harminogram/static/networks/example_network.json', function(network_data){

	// make global copy of network_data 
	global_network_data = network_data;

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

	// pass the network data to d3_clustergram 
	make_d3_clustergram(network_data);

  // turn off the wait sign 
  $.unblockUI();

});
