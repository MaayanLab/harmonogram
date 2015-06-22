
function select_gmt_from_menu(inst_gmt){

  // first remove previously current gmt from list of gmts in gmt_colors 
  var remove_gmt = d3.select('#current_gmt').attr('class').replace('selected_gmts','').replace(' ','') ;
  delete gmt_colors[remove_gmt];

  // set up global variable for gmt that is being selected
  inst_select_gmt = inst_gmt;

  // reset all buttons to original color
  d3.selectAll('.h_medium').style('background','#D0D0D0');

  // set clicked button to blue
  d3.select('#'+inst_gmt+'_button').style('background','#6699CC');

  // if the gmt does not have an assigned color, then assign it the next global color
  // if ( gmt_colors.hasOwnProperty(inst_gmt) == false ){
  if ( inst_gmt in gmt_colors == false ){

    // check for missing color 
    if ( _.contains( _.values(gmt_colors), 'red') == false ) {
      inst_color  = 'red';
    }
    else if ( _.contains( _.values(gmt_colors), 'blue') == false ) {
      inst_color  = 'blue';
    }
    else if ( _.contains( _.values(gmt_colors), 'black') == false ) {
      inst_color  = 'black';
    };

    // asign a new key value pair 
    gmt_colors[inst_gmt] = inst_color;
  };

  // only add gmt if the gmt is not already selected 
  // check for a div with the gmt name as a class
  if (d3.selectAll('.'+inst_gmt).empty() == true){

    d3.select('#current_gmt')
      .selectAll('div')
      .remove();

    // grab div 
    var inst_group = d3.select('#current_gmt');

    // add the gmt name as a class
    inst_group
      .attr('class', inst_gmt + ' selected_gmts');

    // gmt labels 
    make_gmt_labels(inst_group);

  };

  // clean gmt_colors 
  //
  // get all gmts 
  tmp_all_gmts = _.keys(gmt_colors);
  // check each gmt 
  for (i = 0; i < tmp_all_gmts; i ++){
    if ( d3.selectAll('.'+ tmp_all_gmts[i]).empty() == true ){
      // remove gmt from gmt_colors
      delete gmt_colors[tmp_all_gmts[i]];
    };
  };


};


// add new gmt 
function plus_new_gmt(){

  // set the inst_select_gmt
  inst_select_gmt = 'unknown'

  console.log('adding new gmt');

  // change id of current_gmt to not_current_gmt
  d3.select('#current_gmt').attr('id','not_current_gmt');

  // remove highlight from all squares
  d3.selectAll('.highlight_gmt')
    .style('stroke','white');

  // append new current_gmt
  var inst_group = d3.select('#selected_gmts_group')
    .append('div')
    .attr('class','selected_gmts unknown')
    .attr('id','current_gmt');

  // gmt labels 
  make_gmt_labels(inst_group) ; 


};


// highlight the current glyph 
function clicking_glyph(){
  // get inst_glyph name: cylph_ChEA
  inst_glyph = d3.select(this).attr('id');
 
  console.log('inside clicking glyph function' );
  // clear all highlight rects

  // remove highlight from all squares
  d3.selectAll('.highlight_gmt')
    .style('stroke','white')

  // set the current glyph to black
  d3.select('#'+inst_glyph)
    .select('.highlight_gmt')
    .style('stroke','black');

  // change id of current_gmt to not_current_gmt
  d3.select('#current_gmt').attr('id','not_current_gmt');


  // get current gmt 
  inst_gmt = inst_glyph.replace('glyph_','');

  console.log(inst_gmt);

  // set the current gmt to the current, find by class
  d3.selectAll('.'+inst_gmt)
    .attr('id','current_gmt');

};

// remove existing gmt
function remove_existing_gmt(inst_button){
  var inst_gmt = d3.select(this).attr('id').replace('x_','');

  // remove the gmt line 
  d3.selectAll('.'+inst_gmt)
    .remove();

  // add plus sign if there are unknown gmts
  if (d3.selectAll('.unknown')[0].length == 0 ){
      d3.select('#add_new_gmt')
        .style('display','block');
  };  

  // remove x if there is only one gmt available 
  if (d3.selectAll('.selected_gmts')[0].length == 1 ){
    d3.selectAll('.remove_existing_gmt')
      .style('display','none');

    // make last remaining gmt the current_gmt 
    d3.select('#not_current_gmt')
      .attr('id','current_gmt');

  };

  // if the current gmt was removed, then choose another
  if (d3.select('#current_gmt').empty() == true){
    d3.select('#not_current_gmt')
      .attr('id','current_gmt');
  }

  // highlight current gmt
  d3.select('#current_gmt')
    .selectAll('.highlight_gmt')
    .style('stroke','black');
  
  // remove key value pair from gmt_colors 
  delete gmt_colors[inst_gmt];
};

// choose colors for glyphs
function auto_choose_colors(){

  console.log('in auto_choose_colors ' + inst_select_gmt )

  // if adding a new gmt 
  if (inst_select_gmt == 'unknown'){

    // check for missing color 
    if ( _.contains( _.values(gmt_colors), 'red') == false ) {
      inst_color  = 'red';
    }
    else if ( _.contains( _.values(gmt_colors), 'blue') == false ) {
      inst_color  = 'blue';
    }
    else if ( _.contains( _.values(gmt_colors), 'black') == false ) {
      inst_color  = 'black';
    };

    // define a global next color
    global_next_color = inst_color;

  }
  else{

    // grab color from the dictionary 
    inst_color = gmt_colors[inst_select_gmt];

  };

  return inst_color;
};

// double click zoom reset
function add_double_click() {

  // add double click zoom reset
  // 
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
  svg_obj.attr('transform','translate(' + [ margin.left + trans_x, margin.top + trans_y ] + ') scale('+ zoom_x +',' + zoom_y + ')');

  // transform row labels 
  d3.select('#row_labels')
    .attr('transform','translate(' + [row_margin.left , margin.top + trans_y] + ') scale(' + zoom_y + ')');

  // transform col labels
  // move down col labels as zooming occurs, subtract trans_x - 20 almost works 
  d3.select('#col_labels')
    .attr('transform','translate(' + [col_margin.left + trans_x , col_margin.top] + ') scale(' + zoom_x + ')');

  // reset translate vector - add back margins to trans_x and trans_y  
  zoom.translate([ trans_x +  margin.left, trans_y + margin.top]);


  // reduce font-size to compensate for zoom 
  // calculate the recuction of the font size 
  reduce_font_size = d3.scale.linear().domain([0,1]).range([1,d3.event.scale]).clamp('true');
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

// re-run enrichrgram 
function rerun_enrichrgram(){

  // toggle sidebar to make more space for visualization
  d3.select('#wrapper').attr('class','');

  // remove clustergram components 
  d3.select('#clustergram_container').style('display','none');
  d3.select('#clust_instruct_container').style('display','none');

  // show initial components 
  d3.select('#website_title').style('display','block')
    .style('opacity',0).transition().duration(200).style('opacity',1);

  d3.selectAll('.initial_paragraph').style('display','block')
    .style('opacity',0).transition().duration(200).style('opacity',1);

  d3.select('#gmt_menu').style('display','block')
    .style('opacity',0).transition().duration(200).style('opacity',1);

  d3.select('#container_gmt_labels').style('display','block')
    .style('opacity',0).transition().duration(200).style('opacity',1);

  // d3.select('#add_new_gmt').style('display','block')
  //   .style('opacity',0).transition().duration(200).style('opacity',1);


  // show return to previous enrichrgram button
  d3.select('#return_prev_enrichrgram').style('display','block')

  // shift the footer right since sidebar is back
  d3.select('#footer_div')
    .transition()
    .duration(200)
    .style('margin-left','200px');
};



// return to previous enrichrgram 
function return_prev_enrichrgram(){

  console.log('return to previous enrichrgram')

  // toggle sidebar to make more space for visualization
  d3.select('#wrapper').attr('class','toggled');

  // remove clustergram components 
  d3.select('#clustergram_container').style('display','block');
  d3.select('#clust_instruct_container').style('display','block');

  // show initial components 
  d3.select('#website_title').style('display','none');
  d3.selectAll('.initial_paragraph').style('display','none');
  d3.select('#gmt_menu').style('display','none');
  d3.select('#container_gmt_labels').style('display','none');
  
  // shift the footer left since sidebar is not shown
  d3.select('#footer_div')
    .transition()
    .duration(200)
    .style('margin-left','0px');

};

// make the gmt labels in the homepage 
function make_gmt_labels(inst_group){
  // make visible 
  inst_group
    .transition()
    .duration(100)
    .style('opacity','1');

  // append glyph svg
  glyph_svg = inst_group
    .append('div')
    .append('svg')
    .attr('id','glyph_'+inst_select_gmt)
    .attr('class', 'glyph_squares')
    .attr('width',  '24px')
    .attr('height', '24px')
    .on('click', clicking_glyph );

  // make glyph 
  // append background rect
  glyph_svg
    .append('rect')
    .attr('fill', auto_choose_colors )
    .attr('height','24px')
    .attr('width','24px');

  // append lines 
  glyph_svg
    .append('line')
    .attr('x1',0)
    .attr('x2',24)
    .attr('y1',12)
    .attr('y2',12)
    .style('stroke-width','2px');

  glyph_svg
    .append('line')
    .attr('x1',12)
    .attr('x2',12)
    .attr('y1',0)
    .attr('y2',24)
    .style('stroke-width','2px');

  // append border rect 
  glyph_svg
    .append('rect')
    .attr('fill','none')
    .style('stroke','white')
    .style('stroke-width','6px')
    .attr('height','24px')
    .attr('width','24px');

  // append highlighting rect: for new rect 
  glyph_svg
    .append('rect')
    .attr('fill','none')
    .style('stroke-width','2px')
    .attr('height','24px')
    .attr('width','24px')
    .attr('class','highlight_gmt')
    .style('stroke','black');

  // append gmt name 
  inst_group
    .append('div')
    .html( function(){
      if (inst_select_gmt == 'unknown'){
        inst_text = 'Select Library'
      }
      else {
        inst_text = inst_select_gmt.replace(/_/g,' ') ;
      }
      return inst_text;
    })
    .style('color',function(){
      if ( inst_select_gmt == 'unknown' ){
        inst_color = 'red';
      }
      else{
        inst_color = 'black';
      };
      return inst_color;
    })
    .style('float','left');

  // append remove x 
  inst_group
    .append('div')
    .attr('class','remove_existing_gmt')
    .attr('id','x_'+inst_select_gmt)
    .on('click', remove_existing_gmt )
    .style('transform','rotate(45deg)')
    .html('+')
    .style('float','left')
    .style('display','none');

  // remove float left so a new line can be appended below 
  inst_group
    .style('clear','both');

  // add plus sign if there are no unknown gmts 
  if (d3.selectAll('.unknown')[0].length == 0 ){
      d3.select('#add_new_gmt')
        .style('display','block');
  };

  // remove plus sign if there are unknown gmts
  if (d3.selectAll('.unknown')[0].length > 0 ){
      d3.select('#add_new_gmt')
        .style('display','none');
  };

  // remove plus sign if there are three gmts 
  if (d3.selectAll('.selected_gmts')[0].length == 3 ){
      d3.select('#add_new_gmt')
        .style('display','none');
  };

  // show x remove_existing_gmt if there are multiple gmts
  if (d3.selectAll('.selected_gmts')[0].length > 1 ){
    d3.selectAll('.remove_existing_gmt')
      .style('display','block');
  };
};