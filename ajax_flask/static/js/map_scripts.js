
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

  // move sim_matrix information into global variables 
  col_nodes  = sim_matrix.col_nodes ;
  row_nodes  = sim_matrix.row_nodes ;
  inst_links = sim_matrix.links; 

  // font size controls 
  // scale default font size: input domain is the number of nodes
  min_node_num = 10;
  max_node_num = 2000;
  min_fs = 8;
  max_fs = 16;

  // controls how much the font size is increased by zooming
  max_fs_zoom = 0.1; 
  // output range is the font size 
  scale_font_size = d3.scale.log().domain([min_node_num,max_node_num]).range([min_fs,max_fs]).clamp('true');
  // define the scaling for the reduce font size factor 
  scale_reduce_font_size_factor = d3.scale.log().domain([min_node_num,max_node_num]).range([1,max_fs_zoom]).clamp('true');
  // define the scaling for the zoomability of the adjacency matrix
  scale_zoom  = d3.scale.log().domain([min_node_num,max_node_num]).range([2,17]).clamp('true');
  // define the scaling for the rects 
  scale_rects = d3.scale.log().domain([min_node_num,max_node_num]).range([50,6]).clamp('true');

  // font size is a variable since it gets scaled down with zooming  
  default_fs = scale_font_size(col_nodes.length); 
  // calculate the reduce font-size factor: 0 for no reduction in font size and 1 for full reduction of font size
  reduce_font_size_factor = scale_reduce_font_size_factor(row_nodes.length);

  // margin variables 
  top_margin = 90;
  buffer_margin = 5;
  white_rect_width = 500;
  small_white_rect = 100;
  rect_margin_large = white_rect_width - top_margin - buffer_margin;
  rect_margin_small = small_white_rect - top_margin - buffer_margin;

  // Margins 
  col_margin = {top:top_margin,               right:0, bottom:0, left:top_margin+buffer_margin};
  row_margin = {top:top_margin+buffer_margin, right:0, bottom:0, left:top_margin};
  margin     = {top:top_margin+buffer_margin, right:0, bottom:0, left:top_margin+buffer_margin};

  // map size 
  overall_size = 400 ;
  map_width  = overall_size;
  map_height = overall_size*(row_nodes.length/col_nodes.length);
  svg_width = 700;
  svg_height = 1500;
  
  // scaling functions 
  // scale used to size rects 
  x_scale = d3.scale.ordinal().rangeBands([0, map_width]) ;
  y_scale = d3.scale.ordinal().rangeBands([0, map_height]); 

  // set opacity scale 
  // Expression Only 
  if ( _.contains( _.keys(inst_links[0]), 'value' ) ){
    // get the object from the arry that has the maximum value 
    max_link = _.max( inst_links, function(d){ return Math.abs(d.value) } )
    opacity_scale = d3.scale.linear().domain([0, Math.abs(max_link.value) ]).clamp(true) ;
  }
  // Enrichment Only 
  else if ( _.contains( _.keys(inst_links[0]), 'value_up' ) ){
    // get the object from the arry that has the maximum value 
    max_link_up = _.max( inst_links, function(d){ return Math.abs(d.value_up) } )
    max_value_up = max_link_up['value_up']
    max_link_dn = _.max( inst_links, function(d){ return Math.abs(d.value_dn) } )
    max_value_dn = Math.abs(max_link_dn['value_dn'])

    // find the maximum absolute value of the link 
    max_all = _.max( [max_value_up, max_value_dn] )

    // set the opacity 
    opacity_scale = d3.scale.linear().domain([0, Math.abs(max_all) ]).clamp(true) ;
  }

  // Enrichment And Expression 
  else if ( _.contains( _.keys(inst_links[0]), 'enr' ) ){

    // Expression Opacity Scale 
    // get the object from the arry that has the maximum value 
    // up
    tmp_enr = _.max( inst_links, function(d){ return Math.abs(d.enr_up) } )
    max_enr_up = tmp_enr['enr_up']
    // dn
    tmp_enr = _.max( inst_links, function(d){ return Math.abs(d.enr_dn) } )
    max_enr_dn = Math.abs(tmp_enr['enr_dn'])
    console.log(max_enr_up)
    console.log(max_enr_dn)
    // global max 
    max_enr = _.max([max_enr_up, max_enr_dn])
    console.log( 'max updn ' + max_enr)
    // set the opacity for enrichment 
    opacity_scale_enr = d3.scale.linear().domain([0, Math.abs(max_enr) ]).clamp(true) ;

    // Expression Opacity Scale 
    // get the object from the arry that has the maximum value 
    tmp_exp = _.max( inst_links, function(d){ return Math.abs(d.exp) } )
    max_value_exp = tmp_exp['exp']
    // set the opacity for enrichment 
    opacity_scale_exp = d3.scale.linear().domain([0, Math.abs(max_value_exp) ]).clamp(true) ;

    console.log('enr ' + max_enr)
    console.log('exp ' + max_value_exp)
  };

  // after all of the variables have been initialized then run the callback function 
  callback(sim_matrix); 
};
