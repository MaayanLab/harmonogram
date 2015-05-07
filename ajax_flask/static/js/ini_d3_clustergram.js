// initialize clustergram: size, scales, etc. 
function initialize_clustergram(network_data){
  
  // move network_data information into global variables 
  col_nodes  = network_data.col_nodes ;
  row_nodes  = network_data.row_nodes ;
  inst_links = network_data.links; 

  // font size controls 
  // scale default font size: input domain is the number of nodes
  min_node_num = 10;
  max_node_num = 100;
  max_fs = 15;
  min_fs = 6;

  // controls how much the font size is increased by zooming when the number of nodes is at its max
  // and they need to be zoomed into
  // 1: do not increase font size while zooming
  // 0: increase font size while zooming
  max_fs_zoom = 0.7; 
  // output range is the font size 
  scale_font_size = d3.scale.log().domain([min_node_num,max_node_num]).range([max_fs,min_fs]).clamp('true');
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

  console.log(default_fs)

  // label width
  label_width = 100;
  // distance between labels and clustergram
  label_margin = 5;

  // this is the final rect 
  small_white_rect = label_width;

  // find the label with the most characters and use it to adjust the row and col margins 
  row_max_char = _.max(row_nodes, function(inst) {return inst.name.length;}).name.length;
  col_max_char = _.max(col_nodes, function(inst) {return inst.name.length;}).name.length;

  // define label scale parameters: the more characters in the longest name, the larger the margin 
  min_num_char = 7;
  max_num_char = 50;
  min_label_width = 85;
  max_label_width = 200;
  label_scale = d3.scale.linear().domain([min_num_char,max_num_char]).range([min_label_width,max_label_width]).clamp('true');

  // set col_label_width and row_label_width
  row_label_width = label_scale(row_max_char) ;
  col_label_width = label_scale(col_max_char) ;

  // Margins 
  col_margin = { top:col_label_width - label_margin,  right:0, bottom:0, left:row_label_width };
  row_margin = { top:col_label_width, right:0, bottom:0, left:row_label_width - label_margin };
  margin     = { top:col_label_width, right:0, bottom:0, left:row_label_width };

  // clustergram size 
  overall_size = 500 ;
  clustergram_width  = overall_size;
  clustergram_height = overall_size*(row_nodes.length/col_nodes.length);
  svg_width = 800;
  svg_height = 1500;
  
  // scaling functions 
  // scale used to size rects 
  x_scale = d3.scale.ordinal().rangeBands([0, clustergram_width]) ;
  y_scale = d3.scale.ordinal().rangeBands([0, clustergram_height]); 

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
};