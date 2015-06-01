// initialize dropdown 
console.log('make jquery get request')

d3.json('./static/enrichr_gmt_data/enrichr_gmts.json', function(data){

  gmt_data = data['libraries']

  // generate array of gene names 
  gmt_names = []
  // gather category names 
  category_names = []

  // generate a gmt category object 
  gmt_cat = {}

  // gather gmt names 
  for (i = 0; i < gmt_data.length; i++){
    // console.log( gmt_data[i].isActive )
    // only keep active gmts 
    if (gmt_data[i].isActive == true){ 
      // get gmt names 
      gmt_names.push( gmt_data[i].libraryName );
      // get category names 
      category_names.push( gmt_data[i].category )

      // // generate the dicrionary 
      // gmt_cat.push({
      //   key: gmt_data[i].libraryName,
      //   value: gmt_data[i].category
      // })

      // generate the dictionary 
      if (gmt_data[i].category in gmt_cat){
        gmt_cat[gmt_data[i].category].push(gmt_data[i].libraryName)
      }
      else{
        // set the key value pair 
        gmt_cat[gmt_data[i].category] = []
        gmt_cat[gmt_data[i].category].push(gmt_data[i].libraryName)
      }

    }
  }

  //


  // // add dropdown elements with d3 
  // d3.select('#dropdown_list')
  //   .selectAll()
  //   .data(gmt_names)
  //   .enter()
  //   .append('li')
  //   .append('a')
  //   .attr('onclick', function(d,i){ return "gmt_name = " + "'" + d + "'" ; })
  //   .html(function(d,i){return d})
  //   .attr('href','#')

  // // construct collapsable menu from gmts 
  // gmt_buttons = d3.select('#gmt_menu')
  //   .selectAll()
  //   .data(gmt_names)
  //   .enter()

  //   // selection 
  //   .append('section')
  //   .attr('data-accordion','')

  //   // button 
  //   .append('button')
  //   .attr('data-control','')
  //   .attr('class','h_top btn')
  //   .html(function(d,i){return d})

  //   // data content div 
  //   .append('div')
  //   .attr('data-content','')

  //   // append article 
  //   .append('article')
  //   .attr('attr','data-accordion')

  //   // append button 
  //   .append('button')
  //   .attr('data-control','')
  //   .attr('class','h_medium btn')
  //   .html('something')


  })

// initialize clustergram: size, scales, etc. 
function initialize_clustergram(network_data){
  
  // move network_data information into global variables 
  col_nodes  = network_data.col_nodes ;
  row_nodes  = network_data.row_nodes ;
  inst_links = network_data.links; 

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

  // Sort rows and columns 
  orders = {
    name:     d3.range(col_nodes.length).sort(function(a, b) { return d3.ascending( col_nodes[a].name, col_nodes[b].name); }),

    rank_row: d3.range(col_nodes.length).sort(function(a, b) { return col_nodes[b].rank  - col_nodes[a].rank; }),
    rank_col: d3.range(row_nodes.length).sort(function(a, b) { return row_nodes[b].rank  - row_nodes[a].rank; }),

    clust_row: d3.range(col_nodes.length).sort(function(a, b) { return col_nodes[b].clust  - col_nodes[a].clust; }),
    clust_col: d3.range(row_nodes.length).sort(function(a, b) { return row_nodes[b].clust  - row_nodes[a].clust; })
    
  };
  
  // Assign the default sort order for the columns 
  x_scale.domain(orders.clust_row);
  y_scale.domain(orders.clust_col);

  // define border width 
  border_width = x_scale.rangeBand()/16.66

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

  // label width
  label_width = 100;
  // distance between labels and clustergram
  label_margin = 2*border_width;

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
    // global max 
    max_enr = _.max([max_enr_up, max_enr_dn])
    // set the opacity for enrichment 
    opacity_scale_enr = d3.scale.linear().domain([0, Math.abs(max_enr) ]).clamp(true) ;

    // Expression Opacity Scale 
    // get the object from the arry that has the maximum value 
    tmp_exp = _.max( inst_links, function(d){ return Math.abs(d.exp) } )
    max_value_exp = tmp_exp['exp']
    // set the opacity for enrichment 
    opacity_scale_exp = d3.scale.linear().domain([0, Math.abs(max_value_exp) ]).clamp(true) ;

  };
};