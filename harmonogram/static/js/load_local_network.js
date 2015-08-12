function load_class_clustergram(inst_prot_class){

	// clear input search box 
	$('#gene_search_box').val('')

	// only make clustergram if its a new class
	if (inst_prot_class != glob_prot_class)	{

		// save global variable
		glob_prot_class = inst_prot_class;

		// // change active button states
		// d3.select('#class_buttons')
		// 	.selectAll('label')
		// 	.attr('class','btn btn-primary prot_class');

		// console.log(this)
		// // d3.select(this)
		// // 	.attr('class','btn btn-primary prot_class active');


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


