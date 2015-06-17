
// make the svg exp map (one value per tile)
function make_d3_clustergram(network_data) {


  // ///////////////////////////////
  // // remove old visualization 
  // ///////////////////////////////

  // // remove old clustergram
  // d3.select("#main_svg").remove();


  ///////////////////////////////
  // initialize variables 
  ///////////////////////////////

  // initialize clustergram variables 
  initialize_clustergram(network_data)

  // define the variable zoom, a d3 method 
  max_zoom_out = 0.1
  max_zoom_in = 10
  zoom = d3.behavior.zoom().scaleExtent([1,10*zoom_switch]).on('zoom',zoomed);

  // // define border width 
  // border_width = x_scale.rangeBand()/16.66
  // offset click group column label 
  x_offset_click = x_scale.rangeBand()/2 + border_width
  // reduce width of rotated rects
  reduce_rect_width = x_scale.rangeBand()* 0.36 


  ///////////////////////
  // initialize matrix 
  ///////////////////////

  // initialize variables 
  matrix = [] ;
  
  // initialize matrix 
  row_nodes.forEach( function(tmp,i) {
    matrix[i] = d3.range(col_nodes.length).map(function(j) { return {pos_x: j, pos_y: i, value:0, group:0}; });
  }); 

  // Add information to the matrix
  network_data.links.forEach( function(link) {

    // transfer link information to the new adj matrix
    matrix[link.source][link.target].value += link.value;
    // transfer group information to the adj matrix 
    matrix[link.source][link.target].group = 1;
    // transfer color 
    matrix[link.source][link.target].color = link.color;

  });


  ////////////////////////////
  // make visualization 
  ////////////////////////////


  ///////////////////////////
  // column labels 
  ///////////////////////////

  // initialize column label group 
  col_label_svg = d3.select('#svg_div')
    .append('svg')
    .attr('id','col_label_svg') 
    // need to improve this
    .attr('width',  clustergram_width + margin.left + margin.right )
    .attr('height', margin.top )
    .call(zoom)

  // column group
  col_label_svg
    .append("g")
    .attr('id', 'col_labels')
    .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");

  // select all columns 
  col_label_obj = d3.select('#col_labels')
    .selectAll(".col_label_text")
    .data(col_nodes)
    .enter()
    .append("g")
    .attr("class", "col_label_text")
    .attr("transform", function(d, i) { return "translate(" + x_scale(i) + ") rotate(-90)"; })

  col_label_click = col_label_obj
    // append new group for rect and label (not white lines)
    .append('g')
    .attr('class','col_label_click')
    // rotate column labels 
    .attr('transform', 'translate('+x_scale.rangeBand()/2+','+ x_offset_click +') rotate(45)')
    .on('click', reorder_click_col );

  // add separating vertical line, below the labels 
  d3.select('#col_labels')
    .selectAll('.col_label_text')
    .append('line')
    .attr('x1', 0)
    .attr('x2', -20*clustergram_height)
    .style('stroke-width', border_width+'px')

  // for hover effect 
  col_label_click
    .append('title')
    .text(function(d,i){ return d.pval_bh});

  col_label_click
    .append("text")
    .attr("x", 0)
    .attr("y", x_scale.rangeBand() / 2)
    .attr('dx',2*border_width)
    // .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .attr('full_name',function(d) { return d.name } )
    .style('font-size',default_fs+'px')
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

  //////////////////////////
  // Cover excess labels 
  //////////////////////////

  // White Rects to cover the excess labels 
  d3.select('#col_label_svg')
    .append('rect')
    .attr('fill', 'white')
    .attr('width',  row_label_width+'px')
    .attr('height', col_label_width+'px')
    .attr('id','top_left_white');


  ///////////////////////////
  // row labels 
  ///////////////////////////

  // make row label svg
  row_label_svg = d3.select('#svg_div')
    .append('svg')
    .attr('id','row_label_svg')
    .attr('width', margin.left + margin.right)
    .attr('height', clustergram_height)
    .call(zoom)

  // row group 
  row_label_svg
    .append("g")
    .attr('id', 'row_labels')
    .attr("transform", "translate(" + row_margin.left + ",0)")

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
    .attr('y', x_scale.rangeBand() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor','end')
    .style('font-size',default_fs+'px')
    .text(function(d, i) { return d.name; } )

 

  /////////////////
  // clustergram 
  /////////////////

  // initailize svg_obj 
  svg_obj = d3.select("#svg_div")
      .append("svg")
      .attr('id', 'main_svg')
      .attr("width",  clustergram_width )
      .attr("height", clustergram_height)
      .attr('border',1)
      .call( zoom ) 
      .append("g")
      .attr('id', 'clust_group')
      // .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

  // Add the background - one large rect 
  d3.select('#clust_group')
    .append("rect")
    .attr("class", "background")
    .attr('id','grey_background')
    .attr("width", clustergram_width)
    .attr("height", clustergram_height);

  // Make Expression Rows   
  // use matrix for the data join, which contains a two dimensional 
  // array of objects, each row of this matrix will be passed into the row function 
  var row_obj =  svg_obj.selectAll(".row")
    .data(matrix)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
    .each( row_function );

  // horizontal line
  row_obj.append('line')
    .attr('x2', 20*clustergram_width)
    // scale down the width of the horizontal lines 
    .style('stroke-width', border_width/zoom_switch+'px')

   // try to add vertical lines 
  vert_lines = svg_obj
    .selectAll(".vert_lines")
    .data(col_nodes)
    .enter()
    .append("g")
    .attr("class", "vert_lines")
    .attr("transform", function(d, i) { return "translate(" + x_scale(i) + ") rotate(-90)"; })

  // add separating vertical line, below the labels 
  vert_lines
    // .selectAll('.vert_lines')
    .append('line')
    .attr('x1', 0)
    .attr('x2', -20*clustergram_height)
    .style('stroke-width', border_width+'px');
    // .style('stroke','black');

  // remove float left from svg_obj
  svg_obj
    .style('clear','both');


  ////////////////////////////////
  // zoom 
  ////////////////////////////////

  // disable double-click zoom: double click should reset zoom level 
  // do this for all svg elements 
  d3.selectAll("svg").on("dblclick.zoom", null);    

  // run add double click zoom function 
  add_double_click(); 

  // reset the toggle switch 
  // d3.select('#clust_button').attr('class','btn btn-primary active');
  // d3.select('#rank_button').attr('class','btn btn-primary');
  // simulate click
  $('#clust_button').click();

 
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
      return d.color;
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
  var t = svg_obj.transition().duration(2500);

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





