
function select_gmt_from_menu(inst_gmt){

  // reset all buttons to original color
  d3.selectAll('.h_medium').style('background','#D0D0D0');

  // set clicked button to blue
  d3.select('#'+inst_gmt+'_button').style('background','#6699CC');

  // append new select gmt group: glyph, name, and remove x 
  d3.select('#current_gmt')
    .selectAll('div')
    .remove();

  // grab div 
  inst_group = d3.select('#current_gmt');


  // make visible 
  inst_group
    .transition()
    .duration(100)
    .style('opacity','1');

  // append glyph svg
  glyph_svg = inst_group
    .append('div')
      .append('svg')
    .attr('class', 'glyph_squares')
    .attr('id','glyph_'+inst_gmt)
    .attr('width',  '24px')
    .attr('height', '24px')
    .on('click', clicking_glyph );

  // make glyph 
  //
  // append background rect
  glyph_svg
    .append('rect')
    .attr('fill','red')
    .attr('height','24px')
    .attr('width','24px');

  // append lines 
  glyph_svg
    .append('line')
    .attr('x1',0)
    .attr('x2',24)
    .attr('y1',12)
    .attr('y2',12)
    .attr('stroke-width','2px');

  glyph_svg
    .append('line')
    .attr('x1',12)
    .attr('x2',12)
    .attr('y1',0)
    .attr('y2',24)
    .attr('stroke-width','2px');

  // append border rect 
  glyph_svg
    .append('rect')
    .attr('fill','none')
    .attr('stroke','white')
    .attr('stroke-width','6px')
    .attr('height','24px')
    .attr('width','24px');

  // append highlighting rect 
  glyph_svg
    .append('rect')
    .attr('fill','none')
    .attr('stroke-width','2px')
    .attr('height','24px')
    .attr('width','24px')
    .attr('class','highlight_gmt')
    .attr('stroke',function(){
      inst_stroke = 'white';
      if (d3.selectAll('.selected_gmts')[0].length > 1){
        inst_stroke = 'black';
      }
      return inst_stroke;
    });

  // append gmt name 
  inst_group
    .append('div')
    .html(inst_gmt.replace(/_/g,' '))
    .style('float','left');

  // append remove x 
  inst_group
    .append('div')
    .attr('class','remove_existing_gmt')
    .on('click',function(){
      return console.log('clicking the x ')
    })
    .style('transform','rotate(45deg)')
    .html('+')
    .style('float','left')
    .style('opacity',function(){
      inst_opacity = 1;
      if (d3.select('#not_current_gmt').empty() == true){
        inst_opacity = 0;
      };
      return inst_opacity;
    });

  // remove float left 
  inst_group
    .style('clear','both');


};


// highlight the current glyph 
function clicking_glyph(){
  // get inst_glyph name: cylph_ChEA
  inst_glyph = d3.select(this).attr('id');
 
  console.log('inside clicking glyph function' );
  // clear all highlight rects

  d3.selectAll('.highlight_gmt').attr('stroke','white')

  // set the current glyph to black
  d3.select('#'+inst_glyph)
    .select('.highlight_gmt')
    .attr('stroke','black');

}

// add new gmt 
function plus_new_gmt(){

  console.log('adding new gmt');

  // // remove plus sign
  // d3.select('#add_new_gmt')
  //   .remove();

  // change id of current_gmt to not_current_gmt
  d3.select('#current_gmt').attr('id','not_current_gmt');

  // remove highlight from all squares
  d3.selectAll('.highlight_gmt')
    .attr('stroke','white');

  // append new current_gmt
  inst_group = d3.select('#selected_gmts_group')
    .append('div')
    .attr('class','selected_gmts')
    .attr('id','current_gmt');

  // make visible 
  inst_group
    .transition()
    .duration(100)
    .style('opacity','1');

// append glyph svg
  glyph_svg = inst_group
    .append('div')
    .append('svg')
    .attr('id','glyph_unknown')
    .attr('class', 'glyph_squares')
    .attr('width',  '24px')
    .attr('height', '24px')
    // .on('click', function(d,i){ return "console.log('clicking on the glyph');" ; });
    .on('click', clicking_glyph );

  // make glyph 
  //
  // append background rect
  glyph_svg
    .append('rect')
    .attr('fill','red')
    .attr('height','24px')
    .attr('width','24px');

  // append lines 
  glyph_svg
    .append('line')
    .attr('x1',0)
    .attr('x2',24)
    .attr('y1',12)
    .attr('y2',12)
    .attr('stroke-width','2px');
  glyph_svg
    .append('line')
    .attr('x1',12)
    .attr('x2',12)
    .attr('y1',0)
    .attr('y2',24)
    .attr('stroke-width','2px');

  // append border rect 
  glyph_svg
    .append('rect')
    .attr('fill','none')
    .attr('stroke','white')
    .attr('stroke-width','6px')
    .attr('height','24px')
    .attr('width','24px');

  // append highlighting rect: for new rect 

  glyph_svg
    .append('rect')
    .attr('fill','none')
    .attr('stroke','black')
    .attr('stroke-width','2px')
    .attr('height','24px')
    .attr('width','24px')
    .attr('class','highlight_gmt');

  // append gmt name 
  inst_group
    .append('div')
    .html('Select Library')
    .style('color','red')
    .style('float','left');

  // append remove x 
  inst_group
    .append('div')
    .attr('class','remove_existing_gmt')
    .on('click',function(){
      return console.log('clicking the x')
    })
    .style('transform','rotate(45deg)')
    .html('+')
    .style('float','left')
    .style('opacity',function(){
      inst_opacity = 1;
      if (d3.select('#not_current_gmt').empty() == true){
        inst_opacity = 0;
      };
      return inst_opacity;
    });

  // remove float left so a new line can be appended below 
  inst_group
    .style('clear','both');

  // make all other x buttons visible 
  d3.selectAll('.remove_existing_gmt')
    .style('opacity',1);

  // remove plus sign if there are three gmts 
  if (d3.selectAll('.selected_gmts')[0].length == 3){
    d3.select('#add_new_gmt')
      .style('display','none')
  };


};

// remove existing gmt
function x_existing_gmt(inst_button){
  console.log('remove the gmt');
};

// double click zoom reset
function add_double_click() {

  // add double click zoom reset
  // 
  d3.select('#main_svg')
    .on('dblclick', function() { 

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
      zoom.scale(1).translate([0,0]);

      // reset the font size because double click zoom is not disabled
      d3.selectAll('.row_label_text').select('text').style('font-size', default_fs+'px');
      d3.selectAll('.col_label_text').select('text').style('font-size', default_fs+'px');

      // reset the heights of the bars
      // recalculate the original heights
      col_label_obj.select('rect')
        // column is rotated - effectively width and height are switched
        .attr('width', function(d,i) { return bar_scale_col( d.nl_pval ); })
        .attr('transform', function(d, i) { return "translate(0,0)"; });

    });
};

// define zoomed function 
function zoomed() {

  // transfer to x and y translate
  trans_x = d3.event.translate[0]
  trans_y = d3.event.translate[1]

  // matrix
  svg_obj.attr("transform", "translate(" + [ trans_x + margin.left, trans_y + margin.top ] 
    + ") scale(" + d3.event.scale + ")");

  // column labels - only translate in one dimension, also zoom  
  d3.select('#col_labels')
  .attr("transform", "translate(" + [col_margin.left + trans_x, col_margin.top + (d3.event.scale-1)*0.0] 
    + ") scale(" + d3.event.scale + ")");
  
  // row labels - only translate in one dimension, also zoom 
  d3.select('#row_labels')
  .attr("transform", "translate(" + [row_margin.left + (d3.event.scale-1)*0.0 , row_margin.top+ trans_y ] 
    + ") scale(" + d3.event.scale + ")");

  // reduce font-size to compensate for zoom 
  // calculate the recuction of the font size 
  reduce_font_size = d3.scale.linear().domain([0,1]).range([1,d3.event.scale]).clamp('true');
  // scale down the font to compensate for zooming 
  fin_font = default_fs/(reduce_font_size(reduce_font_size_factor)); 
  // add back the 'px' to the font size 
  fin_font = fin_font + 'px';
  // change the font size of the labels 
  d3.selectAll('.row_label_text').select('text').style('font-size', fin_font);
  d3.selectAll('.col_label_text').select('text').style('font-size', fin_font);

  // reduce the height of the enrichment bars based on the zoom applied 
  // recalculate the height and divide by the zooming scale 
  col_label_obj.select('rect')
    // column is rotated - effectively width and height are switched
    .attr('width', function(d,i) { return bar_scale_col( d.nl_pval ) / d3.event.scale ; });

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
  var t = svg_obj.transition().duration(2500);

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
  var t = svg_obj.transition().duration(2500);

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
