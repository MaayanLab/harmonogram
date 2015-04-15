

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



function click_tile(d,i){ 

  // find the current kinase in the array of enriched kinases using grep
  //
  // gather all the enrichment data (enr_kin) from the current cell line (found by accessing d.pos_x from the array of all cell lines) 
  // then find the enrichment data from the current kinase (found by accessing d.pos_y from the array of all kinase nodes row_nodes)

  console.log(d)
  console.log(col_nodes[d.pos_x])
  console.log(d)
  console.log(row_nodes[d.pos_y])
  

  result = $.grep( col_nodes[d.pos_x].enr_kin, function(e) { return e.kin == row_nodes[d.pos_y].name } );

  var inst_kinase = row_nodes[d.pos_y].name ;
  var inst_cl     = col_nodes[d.pos_x].name ;

  // gather the found array element(s)
  //
  // there may be more than one match, if there are up/dn enrichments for a single kinase in a single cell line 
  console.log('result.length '+result.length)

  // initialize intersect and rank arrays 
  var inst_intersect = [] ;
  var inst_rank = [] ;

  // loop through the found enrichment results (at most two, one up and one down) 
  for (inst_result = 0; inst_result < result.length; inst_result++ ){

    // transfer over the current result
    int_prots = result[inst_result] ;

    // collecting the intersect and rank data into arrays 
    for (j = 0; j < int_prots.int.length; j++ ){
        inst_intersect.push( int_prots.int[j].pr );
        inst_rank.push(      int_prots.int[j].rk );
    };

  };

  // generate the bar graph
  // 
  display_intersect(inst_cl, inst_kinase, inst_intersect, inst_rank);

  // Highlight the current cell
  //
  // search for the row (kinase) label 
  tmp =d3.selectAll('.row_label_text').filter( function() { return inst_kinase == d3.select(this).select('text').text() } ) ;
  // find the amount that the row was transformed
  tmp2 = tmp.attr('transform');
  // process this and retain only the y value 
  y_tf = tmp2.split(',')[1].split(')')[0] ;
  y_tf = parseFloat(y_tf) + y_scale.rangeBand()*0.1 ;

  // search for the column (kinase) label 
  tmp =d3.selectAll('.col_label_text').filter( function() { return inst_cl == d3.select(this).select('text').text() } ) ;
  // find the amount that the row was transformed
  tmp2 = tmp.attr('transform');

  x_tf = tmp.attr('transform').split('(')[1].split(')')[0] ;
  x_tf = parseFloat(x_tf ) + x_scale.rangeBand()*0.1;

  // Highlight current cell
  //
  // remove the old cell higlights  
  d3.selectAll('.cell_highlight').remove();

  // highlight the current cell 
  d3.select('#adj_mat')
  .append('rect')
  .attr("width",  x_scale.rangeBand()*0.8)
  .attr("height", y_scale.rangeBand()*0.8)
  .attr('transform', 'translate(' + x_tf + ',' + y_tf + ')')
  .attr('class', 'cell_highlight')
  .attr('stroke','black')
  .attr('stroke-width',2)
  .attr('fill-opacity', 0.0); 

};


function display_intersect( inst_cl, inst_kinase, psites, ranks) {
    
  // remove elements
  d3.select('#title_substrates').remove();
  d3.selectAll('#intersect_psites_bar').remove();
  d3.selectAll('.intersect_psites_title').remove();


  inst_string = inst_cl + ': ' + inst_kinase ;

  d3.select('#the_aside')
    .append('div')
    .attr('id','kinase_substrates');

  d3.select('#kinase_substrates')
    .append('div')
    .attr('id','title_substrates')
    .text(inst_string);


  d3.select('#kinase_substrates')
      .append('div')
      .attr('id', 'intersect_psites_bar')
      .style('margin-left', '40px');
      


  // initialize variables 
  // the height of the line in pixels
  h_line  = 18, 
  h       = h_line * psites.length,
  max_x   = [],
  // vertical offset for the bar text 
  offset  = 12; 

  // transfer to data
  //
  // initialize data 
  data = [];
  for (x = 0; x<psites.length; x++){ 
      var obj = {};
      obj.term = psites[x]; 
      obj.rank = ranks[x];
      data.push(obj);
  }

  // sort the terms based on decreasing rank 
  data.sort(function(a, b){
      var a1= a.rank, b1= b.rank;
      if(a1== b1) return 0;
      return a1< b1? 1: -1;
  });

  var bar_scale_x = d3.scale
      .linear()
      .domain([0, 1])
      .range([0, 100]);    

  var bar_offset_x = d3.scale 
      .linear()
      .domain([-1,0])
      .range([-100,0]);

  // make the svg elements and define the variable svg
  bar_svg = d3.select('#intersect_psites_bar')
      .append('svg')
      .attr('height', h)
      .attr('width', '300px')
      .attr('id','top_ptm_svg');

  // make a new variable of appended groups
  var bar_groups = bar_svg
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'top_ptm_bar_class')
      // shift the x positions of the rects so that negative ranks are shifted left 
      .attr('transform', function(d,i) {
        // initialize offset
        inst_offset = 100;

        // only offset negative ranks 
        if (d.rank<0){

          inst_offset = bar_offset_x(d.rank) + 100 ;
        }
        return 'translate(' + inst_offset + ', 0)' ;
      });


  // append a rect element to the groups, which are saved in the variable bar_groups
  bar_groups.append('rect')
      .attr('y', function(d, j) {return j * h_line; })
      // functionally set the color 
      // used to be '#C0C0C0'
      // set rect fill: red #FF0000: up-regulated kinase, blue #1C86EE : down-regulated kinase 
      .attr('fill', function(d,i){
        // initialize for up phosphosites 
        inst_fill = '#FF0000';
        if (d.rank<0){
          inst_fill = '#1c86EE';
        }
        return inst_fill;
      } )
      // set all opacities to 0.5 
      .attr('fill-opacity',0.5)
      .attr('height', 16)
      .attr('width', function(d,j) {return bar_scale_x( Math.abs(d.rank) ); });
      

  bar_groups.append('text')
     .text(function(d) { return d.term;})
     .attr('y', function(d, j) {return j * h_line + offset; })
     .attr('class', 'top_ptm_text')
     .attr('width',70)
     // set the x offset for the text 
     .attr('x', function(d,i){
      // initialize text offset
      text_offset = 5 ;
      if (d.rank<0){
        // if its a negative rank, down enrichment, then offset the text to the left 
        text_offset = -5 + bar_offset_x( Math.abs(d.rank) ) ;
      }
      // output text_offset 
      return text_offset;
     })


     // .attr('text-anchor','end')

     .attr('text-anchor', function(d,i){
      // initialize the text alignment at the start 
      inst_align = 'start';
      if (d.rank<0){ 
        // if its a negative rank, downd enrihcment, then anchor text at the end 
        inst_align = 'end';
      }
      return inst_align;
     }); 


  // add instructions, if they are not already there 
  // remove old instructions
  // d3.select('#instructions_intersect').remove();    
  d3.select('#intersect_psites_bar')
      .append('div')
      .attr('id','instructions_intersect')
      // .append('text')
      .text('The longer the bar (above) the higher the phospho-site ranks in the list of up-/dn-regulated phospho-sites from this cell line.')
};