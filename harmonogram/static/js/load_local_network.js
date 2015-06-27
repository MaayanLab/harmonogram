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

	// This will set up the resource type color key 
	// and generate an array of genes for later use
	//////////////////////////////////////////////////////

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
	
	// // get unique genes - not necessary
	// all_genes = _.uniq(all_genes);

	// // use the list of genes for autocomplete 
 //  $( "#gene_search_box" ).autocomplete({
 //    source: all_genes
 //  });	



	// implementing typeahead
	////////////////////////////
	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;
	 
	    // an array that will be populated with substring matches
	    matches = [];
	 
	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');
	 
	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });
	 
	    cb(matches);
	  };
	};
	 	 
	// select the container and the input box 
	$('#gene_search_box').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  source: substringMatcher(all_genes)
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
	// console.log(this);
	search_gene = $('#gene_search_box').val();

	// find the index of the gene 
  inst_gene_index = _.indexOf( all_genes, search_gene );	

  // // fake zoom 
  // fake_zoom = 1;

  // get y position 
  inst_y_pos = y_scale(inst_gene_index)  ;

  // console.log(inst_gene_index)
  // console.log(inst_y_pos)

  // highlight row name 
  // console.log('trying to highlight row name')
  // console.log(search_gene)
	d3.selectAll('.row_label_text')
		.filter(function(d){ return d.name == search_gene})
		.select('text')
		.style('font-weight','bold');

	d3.selectAll('.row_label_text')
		.filter(function(d){ return d.name == search_gene})
		.select('rect')
		.style('opacity',1);


  // // reset zoom 
  // // zoom.scale(1).translate([margin.left, margin.top]);
  // zoom.scale(fake_zoom,1);

  // apply transformation: trans_x, trans_y, zoom_x, zoom_y
  // use a transition duration of 1 second 
  ///////////////////////////////////////////
  // // first zoom 
  // apply_transformation(0,0,1,fake_zoom, 2000); 
  // // then transition 
  // apply_transformation(0,inst_y_pos,1,fake_zoom, 2000);



  // // apply interpolated pan and zoom 
  // interpolate_pan_zoom( 0, viz_height/2, 2 );




  // calculate the y panning required to center the found gene 
  console.log('inst_y_pos '+String(inst_y_pos))
  pan_dy = viz_height/2 - inst_y_pos;
  console.log('pan_dy into two_translate_zoom ' + pan_dy)

  // use two translate method to control zooming 
  // pan_x, pan_y, zoom 
  two_translate_zoom(0, pan_dy, zoom_switch );


};



