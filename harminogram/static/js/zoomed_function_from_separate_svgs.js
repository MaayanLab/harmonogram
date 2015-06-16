// define zoomed function 
function zoomed() {

  // transfer to x and y translate
  trans_x = d3.event.translate[0]
  trans_y = d3.event.translate[1]

  // zoom into clustergram 
  /////////////////////////////
  // if height is less than width, zoom vertically only
  // zoom vertically
  if (d3.event.scale < zoom_switch ){

    // reset x translate
    // get the old y translate 
    tmp_y_trans = d3.event.translate[1];
    // reset translate vector - keeping old y_trans
    zoom.translate([0,tmp_y_trans]);

    // zoom in y direction only - tranlsate in y only 
    ///////////////////////////////////////////////////
    if (d3.event.translate[1] <= 0){
      // allow panning if in the negative direction
      svg_obj.attr("transform", "translate(" + [ 0, trans_y ] + ") scale(1, " + d3.event.scale + ")");
      
      // row labels - only translate in one dimension, also zoom 
      d3.select('#row_labels')
        .attr("transform", "translate(" + [row_margin.left , trans_y ] + ") scale(" + d3.event.scale + ")");

    }
    else {
      // do not translate 
      // reset the translate vector
      zoom.translate([0,0]);
      // apply transform 
      svg_obj.attr("transform", "translate(0,0) scale(1, " + d3.event.scale + ")");

    }
  }
  // zoom in both directions 
  else {

    console.log('2d zooming ')

    // available panning room 
    // multiply extra zoom (zoom - 1) by the width 
    pan_room = (d3.event.scale/zoom_switch - 1) * clustergram_width ;

    // row labels - only translate in one dimension, also zoom 
    d3.select('#row_labels')
      .attr("transform", "translate(" + [row_margin.left , trans_y ] + ") scale(" + d3.event.scale + ")");

    // pan rules
    ////////////////////////
    // no panning in the positive direction 
    if (d3.event.translate[0] > 0){

      // reset the translate vector - keeping the old y_trans
      zoom.translate([0,trans_y]);

      // only translate in the y direction, zoom in both directions 
      svg_obj.attr("transform", "translate(" + [ 0, trans_y ] + ") scale("+ d3.event.scale/zoom_switch +", " + d3.event.scale + ")") ;

      // column labels - only translate in one dimension, also zoom  
      d3.select('#col_labels')
        .attr("transform", "translate(" + [col_margin.left , col_margin.top ] + ") scale(" + d3.event.scale/zoom_switch + ")");

    }
    // allow panning in the negative direction if there is enough panning room
    else if (d3.event.translate[0] <= - pan_room ) {
      // reset the translate vector 
      zoom.translate([-pan_room,trans_y]);

      // translate canvas
      svg_obj.attr("transform", "translate(" + [ -pan_room, trans_y ] + ") scale("+ d3.event.scale/zoom_switch +", " + d3.event.scale + ")");

      // column labels - only translate in one dimension, also zoom  
      d3.select('#col_labels')
        .attr("transform", "translate(" + [col_margin.left , col_margin.top ] + ") scale(" + d3.event.scale/zoom_switch + ")");

    }
    // allow two dimensional panning
    else{
      // unrestricted
      svg_obj.attr("transform", "translate(" + [ trans_x, trans_y ] + ") scale("+ d3.event.scale/zoom_switch +", " + d3.event.scale + ")");

      // column labels - only translate in one dimension, also zoom  
      d3.select('#col_labels')
        .attr("transform", "translate(" + [col_margin.left + trans_x, col_margin.top ] + ") scale(" + d3.event.scale/zoom_switch + ")");

    };

  };

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

};