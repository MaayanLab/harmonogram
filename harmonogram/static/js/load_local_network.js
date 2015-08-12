function load_class_clustergram(inst_prot_class){

	// clear input search box 
	$('#gene_search_box').val('')

	// only make clustergram if its a new class
	if (inst_prot_class != glob_prot_class)	{

		// save global variable
		glob_prot_class = inst_prot_class;

		// change active button states
		d3.select('#class_buttons')
			.selectAll('label')
			.attr('class','btn btn-primary prot_class');

		console.log(this)
		// d3.select(this)
		// 	.attr('class','btn btn-primary prot_class active');


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

			// // make global copy of network_data 
			// global_network_data = network_data;
			// // pass the network data to d3_clustergram 
			// make_d3_clustergram(network_data);

	    // define the outer margins of the visualization 
	    var outer_margins = {
	        'top':1,
	        'bottom':1,
	        'left':225,
	        'right':1
	      };

	    // define callback function for clicking on tile 
	    function click_tile_callback(tile_info){
	      console.log('my callback')
	      console.log('clicking on ' + tile_info.row + ' row and ' + tile_info.col + ' col with value ' + String(tile_info.value))
	    };

	    // define arguments object 
	    var arguments_obj = {
	      'network_data': network_data,
	      'svg_div_id': 'svg_div',
	      'row_label':'Genes',
	      'col_label':'Resources',
	      'outer_margins': outer_margins,
	      // 'opacity_scale':'log',
	      // 'input_domain':7,
	      'tile_colors':['#000000','#1C86EE'],
	      'title_tile': true,
	      // 'click_tile': click_tile_callback,
	      // 'click_group': click_group_callback
	      // 'resize':false
	      // 'order':'rank'
	    };

	    // make clustergram: pass network_data and the div name where the svg should be made 
	    d3_clustergram.make_clust( arguments_obj );


		  // turn off the wait sign 
		  $.unblockUI();

		});

	};
};

function highlight_resource_types(){

	// This will set up the resource type color key 
	// and generate an array of genes for later use
	//////////////////////////////////////////////////////

	res_hexcodes = ['#097054','#FFDE00','#6599FF','#FF9900','#834C24','#003366','#1F1209']

	// get all data groups
	all_groups = [];

	// loop through col_nodes
	for (i=0; i<col_nodes.length; i++){
		// do not include grants in group color labels
		if (col_nodes[i]['data_group'] != 'grants'){
			all_groups.push( col_nodes[i]['data_group'] ); 
		};

		// find the index of grants
		if (col_nodes[i]['data_group'] == 'grants'){
			col_index_grants = i;
		}
	};
	
	// get unique groups 
	all_groups = _.uniq(all_groups);

	// generate an object to associate group with color 
	res_color_dict = {};

	// loop through the data groups 
	for (i=0; i<all_groups.length; i++){
		res_color_dict[all_groups[i]] = res_hexcodes[i];
	};

	// add color key 
	////////////////////
	// add keys 
	key_divs = d3.select('#res_color_key_div')
		.selectAll('row')
		.data(all_groups)
		.enter()
		.append('row')
		.style('padding-top','15px');

	// add color 
	key_divs
		.append('div')
		.attr('class','col-xs-2')
		// get rid of excess padding 
		.style('padding-left','5px')
		.style('padding-right','0px')
		.style('padding-top','1px')
		.append('div')
		.style('width','12px')
		.style('height','12px')
		.style('background-color', function(d){
			return res_color_dict[d];
		})

	// add names 
	key_divs
		.append('div')
		.attr('class','col-xs-10 res_names_in_key')
		.append('text')
		.text(function(d){ 
			inst_res = d.replace(/_/g, ' ');
			inst_res = _(inst_res).capitalize();
			return inst_res ;
		})

	// generate a list of genes for auto complete 
	////////////////////////////////////////////////
	// get all genes 
	all_genes = [];

	// loop through row_nodes
	for (i=0; i<row_nodes.length; i++){
		all_genes.push( row_nodes[i]['name'] ); 
	};

	// use Jquery autocomplete
	////////////////////////////////
  $( "#gene_search_box" ).autocomplete({
    source: all_genes
  });


};

// submit genes button 
$("#gene_search_box").keyup(function (e) {
    if (e.keyCode == 13) {
        // Do something
				// console.log('pressed enter');
				find_gene_in_clust();
    }
});

// find gene in clustergram 
function find_gene_in_clust(){
	// get the searched gene 
	search_gene = $('#gene_search_box').val();

	if (all_genes.indexOf(search_gene) != -1){
	  // zoom and highlight found gene 
	  /////////////////////////////////
	  zoom_and_highlight_found_gene(search_gene);
		
	}


};


