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
	console.log($('#gene_search_box').val());
}

// $(document).ready(function(){
// $('form').submit(
// 	console.log('submit form')
// 	);
// })


var textareaval=$('#userInput').val();

function outputTranslated()
{
$('#toBeTranslatedForm').submit(function() {
   alert(textareaval);
});
}