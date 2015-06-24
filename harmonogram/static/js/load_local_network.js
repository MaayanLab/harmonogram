function load_class_clustergram(inst_prot_class){

	// only make clustergram if its a new class
	if (inst_prot_class != glob_prot_class)	{

		// save global variable
		glob_prot_class = inst_prot_class;

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

		// use d3 to load a json 
		d3.json('/harmonogram/static/networks/'+inst_prot_class+'_cumul_probs.json', function(network_data){

			// make global copy of network_data 
			global_network_data = network_data;

			// pass the network data to d3_clustergram 
			make_d3_clustergram(network_data);

		  // turn off the wait sign 
		  $.unblockUI();

		});

	};
};

function highlight_resource_types(){
	console.log('here');

	res_hexcodes = ['#097054','#FFDE00','#6599FF','#FF9900','#834C24','#003366','#1F1209']

	// get all data groups
	all_groups = [];

	// loop through col_nodes
	for (i=0; i<col_nodes.length; i++){
		all_groups.push( col_nodes[i]['data_group'] ); 
	};
	
	// get unique groups 
	all_groups = _.uniq(all_groups);

	// generate an object to associate group with color 
	res_color_dict = {};

	// loop through the data groups 
	for (i=0; i<all_groups.length; i++){
		res_color_dict[all_groups[i]] = res_hexcodes[i];
	};

};