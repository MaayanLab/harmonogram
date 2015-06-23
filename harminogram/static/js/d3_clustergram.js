
// make the svg exp map (one value per tile)
function make_d3_clustergram(network_data) {

  // remove old visualization
  ////////////////////////////////
  d3.select("#main_svg").remove();

  // initialize clustergram variables 
  initialize_clustergram(network_data)

  // display col and row title 
  d3.select('#row_title').style('display','block');
  d3.select('#col_title').style('display','block');

  // toggle sidebar to make more space for visualization
  d3.select('#wrapper').attr('class','toggled');

  // display clustergram_container and clust_instruct_container
  d3.select('#clustergram_container').style('display','block');
  d3.select('#clust_instruct_container').style('display','block');

  // shift the footer left
  d3.select('#footer_div')
    .style('margin-left','0px');

  // define the variable zoom, a d3 method 
  zoom = d3.behavior.zoom().scaleExtent([1,real_zoom*zoom_switch]).on('zoom',zoomed);

  // initialize matrix
  /////////////////////////
  matrix = [] ;
  
  // initialize matrix 
  row_nodes.forEach( function(tmp,i) {
    matrix[i] = d3.range(col_nodes.length).map(function(j) { return {pos_x: j, pos_y: i, value:0, group:0}; });
  }); 

  // Add information to the matrix
  network_data.links.forEach( function(link) {
    // transfer link information to the new adj matrix
    matrix[link.source][link.target].value = link.value;
    // transfer group information to the adj matrix 
    matrix[link.source][link.target].group = 1;
    // transfer color 
    matrix[link.source][link.target].color = link.color;
  });

  // make clustergram visualization 
  ///////////////////////////////////////

  // initailize clust_group with id clust_group
  clust_group = d3.select("#svg_div")
      .append("svg")
      .attr('id', 'main_svg')
      .attr("width",  svg_width  + margin.left + margin.right + spillover_x_offset)
      .attr("height", svg_height + margin.top  + margin.bottom)
      .attr('border',1)
      .call( zoom ) 
      .append("g")
      .attr('id', 'clust_group')
      .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

  // grey background rect for clustergram  
  d3.select('#clust_group')
    .append("rect")
    .attr("class", "background")
    .attr('id','grey_background')
    .attr("width", svg_width)
    .attr("height", svg_height);

  // make rows 
  // use matrix for the data join, which contains a two dimensional 
  // array of objects, each row of this matrix will be passed into the row function 
  var row_obj =  clust_group.selectAll(".row")
    .data(matrix)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .each( row_function );

  // white lines in clustergram 
  /////////////////////////////////

  // horizontal lines
  row_obj.append('line')
    .attr('x2', 20*svg_width)
    .style('stroke-width', border_width/zoom_switch+'px')

  // append vertical line groups 
  vert_lines = clust_group
    .selectAll('.vert_lines')
    .data(col_nodes)
    .enter()
    .append('g')
    .attr('class','vert_lines')
    .attr('transform', function(d,i){ return 'translate(' + x_scale(i) + ') rotate(-90)'; })

  // add vertical lines 
  vert_lines
    .append('line')
    .attr('x1',0)
    .attr('x2',-20*svg_height)
    .style('stroke-width', border_width+'px')


  // row labels 
  //////////////////////////////////

  // white background rect for row labels
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width', row_label_width+'px')
    .attr('height', '3000px')
    .attr('class','white_bars');

  // append group for row labels 
  d3.select('#main_svg')
    .append("g")
    .attr('id', 'row_labels')
    .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")")

  // generate and position the row labels
  var row_label_obj = d3.select('#row_labels')
    .selectAll('.row_label_text')
    .data(row_nodes)
    .enter()
    .append('g')
    .attr('class','row_label_text')
    .attr('transform', function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .on('click', reorder_click_row );

  // append row label text 
  row_label_obj.append('text')
    // !! this will be fixed once I have separate x and y scales 
    // !! can be improved 
    .attr('y', y_scale.rangeBand()/2 )
    .attr('dy', y_scale.rangeBand()/4)
    .attr('text-anchor','end')
    .style('font-size',default_fs_row+'px')
    .text(function(d, i) { return d.name; } )


  // col labels 
  //////////////////////////////////

  // white background rect for col labels 
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('height', col_label_width+'px')
    .attr('width', '3000px')
    .attr('class','white_bars');

  // append group for column labels 
  d3.select('#main_svg')
    .append("g")
    .attr('id', 'col_labels')
    .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");

  // offset click group column label 
  x_offset_click = x_scale.rangeBand()/2 + border_width
  // reduce width of rotated rects
  reduce_rect_width = x_scale.rangeBand()* 0.36 

  // add main column label group 
  col_label_obj = d3.select('#col_labels')
    .selectAll(".col_label_text")
    .data(col_nodes)
    .enter()
    .append("g")
    .attr("class", "col_label_text")
    .attr("transform", function(d, i) { return "translate(" + x_scale(i) + ") rotate(-90)"; })

  // append group for individual column label 
  col_label_click = col_label_obj
    // append new group for rect and label (not white lines)
    .append('g')
    .attr('class','col_label_click')
    // rotate column labels 
    .attr('transform', 'translate('+x_scale.rangeBand()/2+','+ x_offset_click +') rotate(45)')
    .on('click', reorder_click_col );

  // add column label 
  col_label_click
    .append("text")
    .attr("x", 0)
    .attr("y", x_scale.rangeBand() / 2)
    .attr('dx',2*border_width)
    // .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .attr('full_name',function(d) { return d.name } )
    .style('font-size',default_fs_col+'px')
    .text(function(d, i) { return d.name; });

  // add triangle under rotated labels
  col_label_click
    .append('path')
    .style('stroke-width',0)
    .attr('d', function(d) { 
        // x and y are flipped since its rotated 
        origin_y = - border_width
        start_x  = 0;
        final_x  =  x_scale.rangeBand() - reduce_rect_width ;
        start_y  = -(x_scale.rangeBand() - reduce_rect_width + border_width) ;
        final_y  =  -border_width;
        output_string = 'M '+origin_y+',0 L ' + start_y + ',' + start_x + ', L ' + final_y + ','+final_x+' Z';
        return output_string;
       })
    .attr('fill','#eee')


  // Rects to hide spillover 
  ///////////////////////////////

  // white rect to cover excess labels 
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width',  row_label_width+'px')
    .attr('height', col_label_width+'px')
    .attr('id','top_left_white');


  // hide spillover from right
  d3.select('#main_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width', '200px')
    .attr('height', '3000px')
    .attr('transform', function() { 
      tmp_left = margin.left + svg_width;
      // compensate for margin
      tmp_top = margin.top - 5;
      return 'translate('+tmp_left+','+tmp_top+')'
    })
    .attr('class','white_bars');

  // hide spillover from slanged column labels
  d3.select('#main_svg')
    .append('path')
    .style('stroke-width','0')
    // mini-language for drawing path in d3, used to draw triangle 
    .attr('d', 'M 0,0 L 500,-500, L 500,0 Z')
    .attr('fill','white')
    .attr('id','slant_traingle')
    .attr('transform', function(){
      tmp_left = (margin.left + svg_width );
      tmp_top = col_label_width ; 
      return 'translate('+tmp_left+','+tmp_top+')' 
    })


  // initialize zoom and translate 
  ///////////////////////////////////

  // initialize translate vector to compensate for label margins 
  zoom.translate([ margin.left, margin.top]);

  // resize window 
  d3.select(window).on('resize', timeout_resize); 

  // disable double-click zoom: double click should reset zoom level 
  // do this for all svg elements 
  d3.selectAll("svg").on("dblclick.zoom", null);    

  // add double click zoom reset
  d3.select('#main_svg')
    .on('dblclick', function() { 

      console.log('double clicking')
      
      // reset adj zoom 
      d3.select('#clust_group')
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");
      // reset column label zoom 
      d3.select('#col_labels')
        .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");
      // reset row label zoom 
      d3.select('#row_labels')
        .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")");
        
      // use Qiaonan method to reset zoom 
      zoom.scale(1).translate([margin.left, margin.top]);

      // reset the font size because double click zoom is not disabled
      d3.selectAll('.row_label_text').select('text').style('font-size', default_fs_row+'px');
      d3.selectAll('.col_label_text').select('text').style('font-size', default_fs_col+'px');

      // reset the heights of the bars
      // recalculate the original heights
      col_label_obj.select('rect')
        // column is rotated - effectively width and height are switched
        .attr('width', function(d,i) { return bar_scale_col( d.nl_pval ); })
        .attr('transform', function(d, i) { return "translate(0,0)"; });

    });
};

// row function 
function row_function(row_data) {

  // generate tiles in the current row 
  cell =  d3.select(this)
    // data join 
    .selectAll(".cell")
    .data( row_data )
    .enter()
    .append("rect")
    .attr('class', 'cell')
    .attr("x", function(d) { return x_scale(d.pos_x); })
    .attr("width", x_scale.rangeBand())
    .attr("height", y_scale.rangeBand())
    .style("fill-opacity", function(d) { 
      // calculate output opacity using the opacity scale 
      output_opacity = opacity_scale( Math.abs(d.value) );
      return output_opacity ; 
    }) 
    // switch the color based on up/dn enrichment 
    .style('fill', function(d) { 
      // console.log(d)
      // return d.value > 0 ? '#FF0000' : '#1C86EE' ;
      if (d.value != 0){
        inst_color = d.color;
      }
      else{
        inst_color = null;
      }
      return inst_color ;
    } )
    .on("mouseover", function(p) {
      d3.selectAll(".row_label_text text").classed("active", function(d, i) { return i == p.pos_y; });
      d3.selectAll(".col_label_text text").classed("active", function(d, i) { return i == p.pos_x; });
    })
    .on("mouseout", function mouseout() {
      d3.selectAll("text").classed("active", false);
    })
};

function reorder_clust_rank(order_type) {

  // load orders 
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
  var t = clust_group.transition().duration(2500);

  // reorder matrix
  t.selectAll(".row")
    .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .selectAll(".cell")
    .attr('x', function(d){ 
      return x_scale(d.pos_x);
    })

  // Move Row Labels
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

// initialize clustergram: size, scales, etc. 
function initialize_clustergram(network_data){
  
  // move network_data information into global variables 
  col_nodes  = network_data.col_nodes ;
  row_nodes  = network_data.row_nodes ;
  inst_links = network_data.links; 

  // initialize visualization size
  set_visualization_size();

  // define screen width font size scale 
  scale_fs_screen = d3.scale.linear().domain([800,2000]).range([0.5,1.0]).clamp('true');

  // font size controls 
  // scale default font size: input domain is the number of nodes
  min_node_num = 30;
  max_node_num = 2000;
  min_fs = 0.5;
  // reduce or increase the font size based on the total screen width 
  max_fs = 15 * scale_fs_screen(screen_width);
  // output range is the font size 
  scale_font_size = d3.scale.log().domain([min_node_num,max_node_num]).range([max_fs,min_fs]).clamp('true');

  // controls how much the font size is increased by zooming when the number of nodes is at its max
  // and zooming is required 
  // 1: do not increase font size while zooming
  // 0: increase font size while zooming
  max_fs_zoom = 0.0; 
  // define the scaling for the reduce font size factor 
  scale_reduce_font_size_factor = d3.scale.log().domain([min_node_num,max_node_num]).range([1,max_fs_zoom]).clamp('true');
  // define the scaling for the zoomability of the adjacency matrix
  scale_zoom  = d3.scale.log().domain([min_node_num,max_node_num]).range([2,17]).clamp('true');

  // font size is a variable since it gets scaled down with zooming  
  default_fs_row = scale_font_size(row_nodes.length); 
  default_fs_col = scale_font_size(col_nodes.length); 
  // calculate the reduce font-size factor: 0 for no reduction in font size and 1 for full reduction of font size
  reduce_font_size_factor_row = scale_reduce_font_size_factor(row_nodes.length);
  reduce_font_size_factor_col = scale_reduce_font_size_factor(col_nodes.length);

  // set up the real zoom (2d zoom) as a function of the number of col_nodes
  // since these are the nodes that are zoomed into in 2d zooming 
  real_zoom_scale = d3.scale.linear().domain([min_node_num,max_node_num]).range([2,7]).clamp('true');
  // calculate the zoom factor - the more nodes the more zooming allowed
  real_zoom = real_zoom_scale(col_nodes.length);

  // set opacity scale 
  max_link = _.max( inst_links, function(d){ return Math.abs(d.value) } )
  opacity_scale = d3.scale.linear().domain([0, Math.abs(max_link.value) ]).clamp(true).range([0.0,1.0]) ; 
};

function set_visualization_size(){

  // find the label with the most characters and use it to adjust the row and col margins 
  row_max_char = _.max(row_nodes, function(inst) {return inst.name.length;}).name.length;
  col_max_char = _.max(col_nodes, function(inst) {return inst.name.length;}).name.length;

  // define label scale parameters: the more characters in the longest name, the larger the margin 
  min_num_char = 5;
  max_num_char = 40;
  min_label_width = 50;
  max_label_width = 250;
  label_scale = d3.scale.linear().domain([min_num_char,max_num_char]).range([min_label_width,max_label_width]).clamp('true');

  // set col_label_width and row_label_width
  row_label_width = label_scale(row_max_char) ;
  triangle_space = 30;
  col_label_width = label_scale(col_max_char) + triangle_space ;

  // distance between labels and clustergram
  label_margin = 5;

  // Margins 
  col_margin = { top:col_label_width - label_margin, right:0, bottom:0, left:row_label_width              };
  row_margin = { top:col_label_width,                right:0, bottom:0, left:row_label_width-label_margin };
  margin     = { top:col_label_width,                right:0, bottom:0, left:row_label_width              };

  // from http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
  x_window = window.innerWidth ;
  y_window = window.innerHeight ;

  // set wrapper width and height
  d3.select('#wrapper').style('width', x_window);
  d3.select('#wrapper').style('height',y_window);

  // initalize clutergram container 
  // 
  // get screen width 
  screen_width  = Number(d3.select('#wrapper').style('width').replace('px',''));
  // get screen height
  screen_height = Number(d3.select('#wrapper').style('height').replace('px',''));

  // define offsets for permanent row and col margins 
  // takes into consideration sidebar
  container_row_offset = 280;
  // takes into consideration footer and header margin
  container_col_offset = 50;

  // adjust container with border
  // define width and height of clustergram container 
  width_clust_container  = screen_width - container_row_offset;
  height_clust_container = screen_height - container_col_offset;


  // Clustergram Container 
  ///////////////////////////////
  // set clustergram_container and clust_and_row_container dimensions 
  // clustergram_container
  d3.select('#clustergram_container').style('width', width_clust_container+'px')
  d3.select('#clustergram_container').style('height', height_clust_container+'px')
  // clust_and_row_container
  d3.select('#clust_and_row_container').style('width',width_clust_container+'px')
  d3.select('#clust_and_row_container').style('height',height_clust_container+'px')

  // SVG 
  ////////////////
  // define offset for svg
  // compenstates for permanent row and column labels as well
  // as x spillover 
  spillover_x_offset = label_scale(col_max_char)* 0.8 ;
  svg_x_offset = 50 + spillover_x_offset;
  svg_y_offset = 50;

  // svg size: less than container size 
  // subtract fixed length for permanent col and row labels and variable length for specific col and row labels 
  svg_width  = width_clust_container  - svg_x_offset - row_label_width ;
  svg_height = height_clust_container - svg_y_offset - col_label_width ;

  // set zoom factor 
  zoom_factor = (svg_width/col_nodes.length)/(svg_height/row_nodes.length)

  // ensure that width of rects is not less than height 
  // !! needs to be fixed, need more symmetry in the panning/zoom rules 
  if (zoom_factor < 1){
    // scale the height 
    svg_height = svg_width*(row_nodes.length/col_nodes.length);
  };

  // scaling functions 
  // scale used to size rects 
  x_scale = d3.scale.ordinal().rangeBands([0, svg_width]) ;
  y_scale = d3.scale.ordinal().rangeBands([0, svg_height]); 

  // Sort rows and columns 
  orders = {
    name:     d3.range(col_nodes.length).sort(function(a, b) { return d3.ascending( col_nodes[a].name, col_nodes[b].name); }),
    // rank 
    rank_row: d3.range(col_nodes.length).sort(function(a, b) { return col_nodes[b].rank  - col_nodes[a].rank; }),
    rank_col: d3.range(row_nodes.length).sort(function(a, b) { return row_nodes[b].rank  - row_nodes[a].rank; }),
    // clustered 
    clust_row: d3.range(col_nodes.length).sort(function(a, b) { return col_nodes[b].clust  - col_nodes[a].clust; }),
    clust_col: d3.range(row_nodes.length).sort(function(a, b) { return row_nodes[b].clust  - row_nodes[a].clust; })
    
  };
  
  // Assign the default sort order for the columns 
  x_scale.domain(orders.clust_row);
  y_scale.domain(orders.clust_col);

  // define border width 
  border_width = x_scale.rangeBand()/16.66;

  // define the zoom switch value
  // switch from 1 to 2d zoom 
  zoom_switch = (svg_width/col_nodes.length)/(svg_height/row_nodes.length);
};

// recalculate the size of the visualization
// and remake the clustergram 
function reset_visualization_size(){

  // recalculate the size 
  set_visualization_size();

  // reset zoom and translate 
  zoom.scale(1).translate([margin.left, margin.top]);

  // pass the network data to d3_clustergram 
  make_d3_clustergram(global_network_data);
};

// define zoomed function 
function zoomed() {

  // gather transformation components 
  /////////////////////////////////////
  // gather zoom components 
  zoom_x = d3.event.scale;
  zoom_y = d3.event.scale;

  // gather translate vector components 
  trans_x = d3.event.translate[0] - margin.left;
  trans_y = d3.event.translate[1] - margin.top;


  // y - rules 
  ///////////////////////////////////////////////////

  // available panning room in the y direction 
  // multiple extra room (zoom - 1) by the width
  // always defined in the same way 
  pan_room_y = (d3.event.scale - 1) * svg_height ;

  // do not translate if translate in y direction is positive 
  if (trans_y >= 0 ) {
    // restrict transformation parameters 
    // no panning in either direction 
    trans_y = 0; 
  }
  // restrict y pan to pan_room_y if necessary 
  else if (trans_y <= -pan_room_y) {
    // restrict transformation parameters 
    // no panning in x direction 
    trans_y = -pan_room_y; 
  };

  // x - rules 
  ///////////////////////////////////////////////////
  // zoom in y direction only - translate in y only
  if (d3.event.scale < zoom_switch) {
    // no x translate or zoom 
    trans_x = 0;
    zoom_x = 1;

  }
  // zoom in both directions 
  // scale is greater than zoom_switch 
  else{

    // available panning room in the x direction 
    // multiple extra room (zoom - 1) by the width
    pan_room_x = (d3.event.scale/zoom_switch - 1) * svg_width ;

    // no panning in the positive direction 
    if (trans_x > 0){

      // restrict transformation parameters 
      // no panning in the x direction 
      trans_x = 0; 
      // set zoom_x
      zoom_x = d3.event.scale/zoom_switch;

    }
    // restrict panning to pan_room_x 
    else if (trans_x <= -pan_room_x){

      // restrict transformation parameters 
      // no panning in the x direction 
      trans_x = -pan_room_x; 
      // set zoom_x 
      zoom_x = d3.event.scale/zoom_switch;

    }
    // allow two dimensional panning 
    else{

      // restrict transformation parameters 
      // set zoom_x 
      zoom_x = d3.event.scale/zoom_switch;

    };

  };

  // apply transformation and reset translate vector 
  // the zoom vector (zoom.scale) never gets reset 
  ///////////////////////////////////////////////////
  // translate clustergram 
  clust_group.attr('transform','translate(' + [ margin.left + trans_x, margin.top + trans_y ] + ') scale('+ zoom_x +',' + zoom_y + ')');

  // transform row labels 
  d3.select('#row_labels')
    .attr('transform','translate(' + [row_margin.left , margin.top + trans_y] + ') scale(' + zoom_y + ')');

  // transform col labels
  // move down col labels as zooming occurs, subtract trans_x - 20 almost works 
  d3.select('#col_labels')
    .attr('transform','translate(' + [col_margin.left + trans_x , col_margin.top] + ') scale(' + zoom_x + ')');

  // reset translate vector - add back margins to trans_x and trans_y  
  zoom.translate([ trans_x +  margin.left, trans_y + margin.top]);

  // Font Sizes 
  //////////////////
  // reduce the font size by dividing by some part of the zoom 
  // if reduce_font_size_factor_ is 1, then the font will be divided by the whole zoom - and the labels will not increase in size 
  // if reduce_font_size_factor_ is 0, then the font will be divided 1 - and the labels will increase in size 

  // reduce font-size to compensate for zoom 
  // calculate the recuction of the font size 
  reduce_font_size = d3.scale.linear().domain([0,1]).range([1,zoom_y]).clamp('true');
  // scale down the font to compensate for zooming 
  fin_font = default_fs_row/(reduce_font_size(reduce_font_size_factor_row)); 
  // add back the 'px' to the font size 
  fin_font = fin_font + 'px';
  // change the font size of the labels 
  d3.selectAll('.row_label_text').select('text').style('font-size', fin_font);


  // reduce font-size to compensate for zoom 
  // calculate the recuction of the font size 
  reduce_font_size = d3.scale.linear().domain([0,1]).range([1,zoom_x]).clamp('true');
  // scale down the font to compensate for zooming 
  fin_font = default_fs_col/(reduce_font_size(reduce_font_size_factor_col)); 
  // add back the 'px' to the font size 
  fin_font = fin_font + 'px';
  // change the font size of the labels 
  d3.selectAll('.col_label_text').select('text').style('font-size', fin_font);
};

// reorder columns with row click 
function reorder_click_row(d,i){

  // get inst row (gene)
  inst_gene = d3.select(this).select('text').text();

  // set font to bold 
  d3.selectAll('.row_label_text').select('text').style('font-weight','normal')
  d3.select(this).select('text').style('font-weight','bold');

  // set rect to increased opacity 
  d3.selectAll('.row_label_text').select('rect').style('opacity',0.3);
  d3.select(this).select('rect').style('opacity',0.5)

  // set rect opacity higher 
  
  // find the row number of this term from row_nodes 
  // gather row node names 
  tmp_arr = []
  for (i=0; i<row_nodes.length; i++){
    tmp_arr.push(row_nodes[i].name);
  }

  // find index 
  inst_row = _.indexOf( tmp_arr, inst_gene );

  // gather the values of the input genes 
  tmp_arr = [];
  for (j=0; j<col_nodes.length; j++) {
    tmp_arr.push(matrix[inst_row][j].value);
  }

  // sort the rows 
  tmp_sort = d3.range( tmp_arr.length ).sort(function(a, b) { return tmp_arr[b]  - tmp_arr[a]; })

  // resort the columns (resort x)
  x_scale.domain(tmp_sort);

  // reorder
  // define the t variable as the transition function 
  var t = clust_group.transition().duration(2500);

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

// reorder rows with column click 
function reorder_click_col(d,i){

  // get inst col (term)
  inst_term = d3.select(this).select('text').attr('full_name')

  // add outline 
  d3.selectAll('.col_label_text').select('rect').style('stroke-width',0)
  d3.select(this).select('rect').style('stroke','black').style('stroke-width',1);

  // set font to bold 
  d3.selectAll('.col_label_text').select('text').style('font-weight','normal')
  d3.select(this).select('text').style('font-weight','bold');

  // set rect to increased opacity 
  d3.selectAll('.col_label_text').select('rect').style('opacity',0.6);
  d3.select(this).select('rect').style('opacity',0.9)

  // find the column number of this term from col_nodes 
  // gather column node names 
  tmp_arr = []
  for (i=0; i<col_nodes.length; i++){
    tmp_arr.push(col_nodes[i].name);
  }

  // find index 
  inst_col = _.indexOf( tmp_arr, inst_term );

  // gather the values of the input genes 
  tmp_arr = [];
  for (i=0; i<row_nodes.length; i++) {
    tmp_arr.push(matrix[i][inst_col].value);
  }

  // sort the rows 
  tmp_sort = d3.range( tmp_arr.length).sort(function(a, b) { return tmp_arr[b]  - tmp_arr[a]; })

  // resort rows - y axis 
  y_scale.domain(tmp_sort);

  // reorder
  // define the t variable as the transition function 
  var t = clust_group.transition().duration(2500);

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

// resize clustergram with screensize change
var doit;
function timeout_resize(){

  // clear timeout
  clearTimeout(doit);

  doit = setTimeout( reset_visualization_size, 500)  ;
};
