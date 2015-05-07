// double click zoom reset
function add_double_click() {

  // add double click zoom reset
  // 
  d3.select('#main_svg')
    .on('dblclick', function() { 

      // reset adj zoom 
      d3.select('#adj_mat')
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");
      // reset column label zoom 
      d3.select('#col_labels')
        .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");
      // reset row label zoom 
      d3.select('#row_labels')
        .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")");
      // use Qiaonan method to reset zoom 
      zoom.scale(1).translate([0,0]);

      // reset the font size because double click zoom is not disabled
      d3.selectAll('.row_label_text').select('text').style('font-size', default_fs+'px');
      d3.selectAll('.col_label_text').select('text').style('font-size', default_fs+'px');

    });
};

// define zoomed function 
function zoomed() {

  // transfer to x and y translate
  trans_x = d3.event.translate[0]
  trans_y = d3.event.translate[1]

  // // restrict translate
  // if (trans_x>0){
  //   trans_x = 0;
  // };
  // if (trans_y>0){
  //   trans_y = 0;
  // };

  // matrix
  svg.attr("transform", "translate(" + [ trans_x + margin.left, trans_y + margin.top ] 
    + ") scale(" + d3.event.scale + ")");

  // column labels
  d3.select('#col_labels')
  .attr("transform", "translate(" + [col_margin.left + trans_x, col_margin.top + (d3.event.scale-1)*0.0] 
    + ") scale(" + d3.event.scale + ")");
  
  // row labels 
  d3.select('#row_labels')
  .attr("transform", "translate(" + [row_margin.left + (d3.event.scale-1)*0.0 , row_margin.top+ trans_y ] 
    + ") scale(" + d3.event.scale + ")");

  // reduce font size based on the zoom applied
  //
  // calculate the recuction of the font size 
  reduce_font_size = d3.scale.linear().domain([0,1]).range([1,d3.event.scale]).clamp('true');
  // scale down the font to compensate for zooming 
  fin_font = default_fs/(reduce_font_size(reduce_font_size_factor)); 
  // add back the 'px' to the font size 
  fin_font = fin_font + 'px';

  // change the font size of the labels 
  d3.selectAll('.row_label_text').select('text').style('font-size', fin_font);
  d3.selectAll('.col_label_text').select('text').style('font-size', fin_font);
}

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

// reorder rows with column click 
function reorder_click_col(d,i){

  // get inst col (term)
  inst_term = d3.select(this).select('text').text();
  
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
}
