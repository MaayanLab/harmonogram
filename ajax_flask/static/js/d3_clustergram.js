
// make the svg exp map (one value per tile)
function make_d3_clustergram(sim_matrix) {

  // remove old map
  d3.select("#main_svg").remove();
  d3.select('#kinase_substrates').remove();

  // initialize clustergram 
  initialize_clustergram(sim_matrix)

  // display col and row title 
  d3.select('#row_title').style('display','block')
  d3.select('#col_title').style('display','block')

  // define the variable zoom, a d3 method 
  zoom = d3.behavior.zoom().scaleExtent([0.5,3]).on('zoom',zoomed);

  // initialize variables 
  matrix = [] ;
  
  // initialize matrix 
  row_nodes.forEach( function(tmp,i) {
    matrix[i] = d3.range(col_nodes.length).map(function(j) { return {pos_x: j, pos_y: i, value:0, group:0}; });
  }); 

  // Add information to the matrix
  sim_matrix.links.forEach( function(link) {
    // transfer link information to the new adj matrix
    matrix[link.source][link.target].value += link.value;
    // transfer group information to the adj matrix 
    matrix[link.source][link.target].group = 1;
  });

  // Sort single values 
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

  // INITIALIZE SVG
  svg = d3.select("#svg_div")
      .append("svg")
      .attr('id', 'main_svg')
      .attr("width",  svg_width  + margin.left + margin.right)
      .attr("height", svg_height + margin.top  + margin.bottom)
      .attr('border',1)
      // .style("margin-left", -margin.left + "px")
      .call( zoom ) 
      .append("g")
      .attr('id', 'adj_mat')
      .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

  // disable double-click zoom: double click should reset zoom level 
  d3.select("svg").on("dblclick.zoom", null);    

  // White Rects to cover the svg
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width', white_rect_width+'px')
    .attr('height', '6000px')
    .attr('transform', 'translate(-'+rect_margin_large+',0)')
    .attr('class','white_bars');

  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('height', white_rect_width+'px')
    .attr('width', '6000px')
    .attr('transform', 'translate(0,-'+rect_margin_large+')')
    .attr('class','white_bars');

  // column group
  d3.select('#main_svg')
    .append("g")
    .attr('id', 'col_labels')
    .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");

  // row group 
  d3.select('#main_svg')
    .append("g")
    .attr('id', 'row_labels')
    .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")")

  // White Rects to cover the excess labels 
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width',  small_white_rect+'px')
    .attr('height', small_white_rect+'px')
    .attr('transform', 'translate(-'+rect_margin_small+',-'+rect_margin_small+')')
    .attr('id','top_left_white');

  // Add the background - one large rect 
  d3.select('#adj_mat')
    .append("rect")
    .attr("class", "background")
    .attr("width", map_width)
    .attr("height", map_height);

  // Make Expression Rows   
  var row =  svg.selectAll(".row")
    .data(matrix)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .each( row_function );

  // horizontal line
  row.append('line')
    .attr('x2', map_width)

  // select all columns 
  var col_label = d3.select('#col_labels')
    .selectAll(".col_label_text")
    // append one row of the matrix 
    .data(matrix[0])
    .enter()
    .append("g")
    .attr("class", "col_label_text")
    .attr("transform", function(d, i) { return "translate(" + x_scale(i) + ") rotate(-90)"; })
    .on('click', reorder_click_col ); 

  // vertical line
  col_label.append('line')
    .attr('x2', -100*map_height)

  var text_offset = 5;

  // set scale for enrichment rects 
  ///////////////////////////////////
  enr_max = Math.max.apply(Math, col_nodes.map(function(o){return Math.abs(o.nl_pval);}))
  var col_label_width = 50;
  var bar_scale_col = d3.scale
    .linear()
    .domain([0, enr_max])
    .range([0, col_label_width]);    

  // append rects to the row labels for highlighting purposes 
  col_label.append('rect')
    // column is rotated - effectively width and height are switched
    .attr('width', function(d,i) { return bar_scale_col( col_nodes[i].nl_pval ); })
    .attr('height', x_scale.rangeBand())
    .attr('fill', 'red')
    .attr('opacity',0.6)
    .attr('transform', function(d, i) { return "translate(0,0)"; });

  col_label.append('title')
    .text(function(d,i){ return col_nodes[i].pval_bh});

  col_label.append("text")
    .attr("x", 0)
    .attr("y", x_scale.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .style('font-size',default_fs+'px')
    .text(function(d, i) { return col_nodes[i].name; });

  // generate and position the row labels
  var row_label = d3.select('#row_labels')
    .selectAll('.row_label_text')
    .data(matrix)
    .enter()
    .append('g')
    .attr('class','row_label_text')
    .attr('transform', function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .on('click', reorder_click_row );

  // set scale for enrichment rects 
  ///////////////////////////////////
  term_max = Math.max.apply(Math, row_nodes.map(function(o){return Math.abs(o.nl_pval);}))
  var row_label_width = 50;
  var bar_scale_row = d3.scale
    .linear()
    .domain([0, term_max])
    .range([0, row_label_width]);    
                    
  // // append rects to the row labels for highlighting purposes 
  // row_label.append('rect')
  //   .attr('width', function(d,i) { return bar_scale_row( row_nodes[i].nl_pval )} )
  //   .attr('height', x_scale.rangeBand())
  //   .attr('fill', 'black')
  //   .attr('transform', function(d, i) { return "translate(-"+ bar_scale_row( row_nodes[i].nl_pval ) +",0)"; })
  //   .attr('opacity','0.3'); // remove the bar for now

  row_label.append('text')
    .attr('y', x_scale.rangeBand() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor','end')
    .style('font-size',default_fs+'px')
    .text(function(d, i) { return row_nodes[i].name; } ); 

  // run add double click zoom function 
  add_double_click(); 
};

// initialize function 
function initialize_clustergram(sim_matrix){
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

}

// row function 
function row_function(row_data) {
  // generate cells in each row (this is the current row)
  cell =  d3.select(this)
    .selectAll(".cell")
    .data( row_data )
    .enter()

    // append rect 
    .append("rect")
    // set class 
    .attr('class', 'cell')
    // set x position of rect
    .attr("x", function(d) { return x_scale(d.pos_x); })
    // set rect width
    .attr("width", x_scale.rangeBand())
    // set rect height
    .attr("height", y_scale.rangeBand())
    // set opacity of rect
    .style("fill-opacity", function(d) { 
      // calculate output opacity using the scale 
      output_opacity = opacity_scale( Math.abs(d.value) );
      // return z
      return output_opacity ; 
    }) 

    // set rect fill: red #FF0000: up-regulated kinase, blue #1C86EE : down-regulated kinase 
    .style('fill', function(d) { 

      // only one value for each tile 
      inst_z = d.value ;

      // switch the color based on up/dn enrichment 
      return inst_z > 0 ? '#FF0000' : '#1C86EE' ;
    } )
    .on("mouseover", function(p) {
      d3.selectAll(".row_label_text text").classed("active", function(d, i) { return i == p.pos_y; });
      d3.selectAll(".col_label_text text").classed("active", function(d, i) { return i == p.pos_x; });
    })
    .on("mouseout", function mouseout() {
      d3.selectAll("text").classed("active", false);
    })
};

// reorder based on cluetering and rank of results 
function reorder_clust_rank(order_type) {

  if ( order_type == 'clust' ){ 
    // order by enrichment 
    x_scale.domain(orders.clust_row);
    y_scale.domain(orders.clust_col);
  }
  else if (order_type == 'rank'){
    // order by enrichment 
    x_scale.domain(orders.rank_row);
    y_scale.domain(orders.rank_col);
  };

  // define the t variable as the transition function 
  var t = svg.transition().duration(2500);

  // reorder matrix
  t.selectAll(".row")
    .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .selectAll(".cell")
    .attr('x', function(d){ 
      return x_scale(d.pos_x);
    })

  // Move Row Labels
  // 
  d3.select('#row_labels').selectAll('.row_label_text')
      .transition().duration(2500)
      .attr('transform', function(d, i) { return 'translate(0,' + y_scale(i) + ')'; });

  // t.selectAll(".column")
  d3.select('#col_labels').selectAll(".col_label_text")
      .transition().duration(2500)
      .attr("transform", function(d, i) { 
        return "translate(" + x_scale(i) + ")rotate(-90)"; 
      });
};
