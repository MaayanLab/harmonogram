
console.log('in load local network');

// use d3 to load a json 
d3.json('/harminogram/static/networks/network_cumul_probs.json', function(network_data){

	// pass the network data to d3_clustergram 
	make_d3_clustergram(network_data)
	console.log(network_data)
});
