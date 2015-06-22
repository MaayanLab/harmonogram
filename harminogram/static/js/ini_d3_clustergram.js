// initialize dropdown 


/////////////////////////////////////////////////////////////
// initialize the website in clustergram view 
/////////////////////////////////////////////////////////////

// // initialize clustergram variables 
// initialize_clustergram(network_data)

// // display col and row title 
// d3.select('#row_title').style('display','block');
// d3.select('#col_title').style('display','block');

// // toggle sidebar to make more space for visualization
// d3.select('#wrapper').attr('class','toggled');

// // remove initial components
// d3.select('#website_title').style('display','none');
// d3.selectAll('.initial_paragraph').style('display','none');
// d3.select('#gmt_menu').style('display','none');
// d3.select('#add_new_gmt').style('display','none');

// // display clustergram_container and clust_instruct_container
// d3.select('#clustergram_container').style('display','block');
// d3.select('#clust_instruct_container').style('display','block');

// // shift the footer left
// d3.select('#footer_div')
//   // .transition()
//   // .duration(250)
//   .style('margin-left','0px');

// // remove gmt labels 
// d3.select('#container_gmt_labels').style('display','none');

/////////////////////////////////////////////////////////////



// initialize global dictionary to associate gmts with colors
gmt_colors = {};
gmt_colors.ChEA = 'red';

// define example genelist 
example_gene_list_50 = ["CD2BP2", "SLBP", "FOXK2", "STMN2", "SMAD4", "EIF6", "SF1", "CTNND2", "DBN1", "IQGAP2", "P2RX6", "ANKRD6", "C9ORF40", "ARHGEF7", "GOLGA2", "PPME1", "FAM129A", "YES1", "GLI4", "1600027N09RIK", "PTS", "PATL1", "ORAI1", "SPATS2L", "DCX", "HK2", "CSPG4", "AMBRA1", "SENP3", "THOP1", "DSG2", "PER1", "ACLY", "NR1H4", "PTPN7", "BRD2", "TAX1BP1", "RGS14", "SLC40A1", "CNN3", "PLSCR1", "PIP5K1B", "GRB14", "CTR9", "ARHGAP15", "TOM1L2", "ZNF148", "TBC1D12", "BAIAP2", "TOP2A"];

// could be improved
////////////////////
d3.json('/harminogram/static/enrichr_gmt_data/enrichr_gmts.json', function(data){

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

  // all_categories
  all_categories = Object.keys(gmt_cat);

  // manually define categories (manual order)
  all_categories = ["Transcription", "Pathways", "Ontologies", "Disease/Drugs", "Cell Types", "Misc" ]

  // remove legacy from options 
  var index = all_categories.indexOf('Legacy');    // <-- Not supported in <IE9
  if (index !== -1) {
      all_categories.splice(index, 1);
  }

  // construct accordion menu from gmts 
  // https://github.com/vctrfrnndz/jquery-accordion
  gmt_buttons = d3.select('#gmt_menu')
    .selectAll()
    .data(all_categories)
    .enter()

    // selection 
    .append('section')
    .attr('data-accordion','')
    .attr('id',function(d){return d.replace(' ','_').replace('/','_') })

    // button 
    .append('button')
    .attr('data-control','')
    .attr('class','h_top btn')
    .attr('id',function(d){return d.replace(' ','_').replace('/','_')+'_button' })
    .html(function(d){return d})

  // fill in lower level 
  // 
  // loop through categories 
  for (i=0; i<all_categories.length; i++){

    // select button 
    d3.select('#'+all_categories[i].replace(' ','_').replace('/','_'))
    .selectAll()
    .data( gmt_cat[all_categories[i]] )
    .enter()
    .append('div')
    .attr('data-content','')
    
    // append article
    .append('article')
    .attr('data-accordion','')

    // append button
    .append('button')
    .attr('data-control','')
    .attr('class','h_medium btn')
    .attr('onclick', function(d,i){ return "gmt_name = " + "'" + d + "'; select_gmt_from_menu('"+d+"')" ; })
    .attr('id',function(d){return d + '_button'})
    .html(function(d){return d.replace( /_/g, ' ')})
    
  }

  // show the dropdown menu
  d3.selectAll('.h_top')
    .transition()
    .duration(1000)
    .style('opacity',1.0)

  // Initialize the collapsable menu after everything has been made by d3
  $(document).ready(function() {
    $('#gmt_menu [data-accordion]').accordion({
      transitionSpeed: 1500, // Transition speed on miliseconds.
      transitionEasing: 'ease', // CSS value for easing
      controlElement: '[data-control]', // CSS selector for the element acting as a button inside accordions.
      contentElement: '[data-content]', // CSS selector for the element containing hide/show content.
      groupElement: '[data-accordion-group]', // CSS selector for a parent element containing a group of accordions.
      singleOpen: true // Opens a single accordion a time. If false, multiple accordions can be open a time.
    });
  });

  // initialize the transcription tab to be opened, wait one second
  setTimeout( function() {
    $('#Transcription_button').click();

        // display title 
        d3.select('#title_selected_libraries').transition().delay(0).style('opacity',1);

    setTimeout( function() {

        // highlight transcription factors 
        d3.select('#ChEA_button')
        .transition()
        .duration(200)
        .style('background','#6699CC');

        // show the chea gmt selection 
        //
        // display manual gmt name 
        d3.select('.selected_gmts').transition().delay(200).style('opacity',1);

        // selet ChEA as the inital library 
        select_gmt_from_menu('ChEA')

        // show the add new gmt button 
        d3.select('#add_new_gmt').transition().delay(500).style('opacity',1);

      }, 700)

  }, 1000)

})



// initialize clustergram: size, scales, etc. 
function initialize_clustergram(network_data){
  
  // move network_data information into global variables 
  col_nodes  = network_data.col_nodes ;
  row_nodes  = network_data.row_nodes ;
  inst_links = network_data.links; 

  // initialize visualization size
  set_visualization_size();
  
  

  // font size controls 
  // scale default font size: input domain is the number of nodes
  min_node_num = 5;
  max_node_num = 800;
  min_fs = 0.5;
  max_fs = 20;

  // controls how much the font size is increased by zooming when the number of nodes is at its max
  // and they need to be zoomed into
  // 1: do not increase font size while zooming
  // 0: increase font size while zooming
  max_fs_zoom = 0.25; 
  // output range is the font size 
  scale_font_size = d3.scale.log().domain([min_node_num,max_node_num]).range([max_fs,min_fs]).clamp('true');
  // define the scaling for the reduce font size factor 
  scale_reduce_font_size_factor = d3.scale.log().domain([min_node_num,max_node_num]).range([1,max_fs_zoom]).clamp('true');
  // define the scaling for the zoomability of the adjacency matrix
  scale_zoom  = d3.scale.log().domain([min_node_num,max_node_num]).range([2,17]).clamp('true');
  // define the scaling for the rects 
  scale_rects = d3.scale.log().domain([min_node_num,max_node_num]).range([50,6]).clamp('true');

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

function set_visualization_size(){
  console.log('resizing')

  // define offsets for permanent row and col margins 
  row_offset = 230;
  col_offset = 10;

  // // define margins for genes and resources labels
  // genes_label_margin = 50;
  // resources_label_margin = 50;

  // define offset for svg
  svg_x_offset = 190;
  svg_y_offset = 140;

  // find the label with the most characters and use it to adjust the row and col margins 
  row_max_char = _.max(row_nodes, function(inst) {return inst.name.length;}).name.length;
  col_max_char = _.max(col_nodes, function(inst) {return inst.name.length;}).name.length;

  // define label scale parameters: the more characters in the longest name, the larger the margin 
  min_num_char = 5;
  max_num_char = 40;
  min_label_width = 50;
  max_label_width = 210;
  label_scale = d3.scale.linear().domain([min_num_char,max_num_char]).range([min_label_width,max_label_width]).clamp('true');

  // set col_label_width and row_label_width
  row_label_width = label_scale(row_max_char) ;
  // !! add a little more space to compensate for triangles 
  col_label_width = label_scale(col_max_char) + 30 ;

  // distance between labels and clustergram
  // label_margin = 2*border_width;
  label_margin = 5;

  // Margins 
  col_margin = { top:col_label_width - label_margin, right:0, bottom:0, left:row_label_width              };//!!
  row_margin = { top:col_label_width,                right:0, bottom:0, left:row_label_width-label_margin };//!!
  margin     = { top:col_label_width,                right:0, bottom:0, left:row_label_width              };
  offset     = { top:col_label_width+col_offset,     right:0, bottom:0, left:row_label_width+row_offset   };

  // from http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
  x_window = window.innerWidth ;
  y_window = window.innerHeight ;

  // set wrapper width and height
  d3.select('#wrapper').style('width', x_window);
  d3.select('#wrapper').style('height',y_window);

  // initalize clutergram container 
  // `
  // get screen width 
  screen_width  = Number(d3.select('#wrapper').style('width').replace('px',''));
  // get screen height
  screen_height = Number(d3.select('#wrapper').style('height').replace('px',''));

  // adjust container with border
  // define width and height of clustergram container 
  width_clust_container  = screen_width - offset.left;
  height_clust_container = screen_height - offset.top;

  // adjust the width of the main container
  d3.select('#main_container').style('width', width_clust_container+'px')

  // set zoom factor 
  zoom_factor = (width_clust_container/col_nodes.length)/(height_clust_container/row_nodes.length)

  // ensure that width of rects is not less than height 
  // !! needs to be fixed, need more symmetry in the panning/zoom rules 
  if (zoom_factor < 1){
    // scale the height 
    height_clust_container = width_clust_container*(row_nodes.length/col_nodes.length);
  };


  // set clustergram_container
  d3.select('#clustergram_container').style('width', width_clust_container+'px')
  d3.select('#clustergram_container').style('height', height_clust_container+'px')

  // set height of clust_and_row_container
  d3.select('#clust_and_row_container').style('width',width_clust_container+'px')
  d3.select('#clust_and_row_container').style('height',height_clust_container+'px')

  // clustergram size 
  // !! this can be improved 
  svg_width  = width_clust_container  - svg_x_offset  ;
  svg_height = height_clust_container - svg_y_offset;

  // scaling functions 
  // scale used to size rects 
  x_scale = d3.scale.ordinal().rangeBands([0, svg_width]) ;
  y_scale = d3.scale.ordinal().rangeBands([0, svg_height]); 

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
  border_width = x_scale.rangeBand()/16.66;

  // label width
  label_width = 100;

  // this is the final rect 
  small_white_rect = label_width;

  // define the zoom switch value
  // switch from 1 to 2d zoom 
  zoom_switch = (svg_width/col_nodes.length)/(svg_height/row_nodes.length);

};

// recalculate the size of the visualization
// and remake the clustergram 
function reset_visualization_size(){

  // recalculate the size 
  set_visualization_size();


  // use Qiaonan method to reset zoom 
  zoom.scale(1).translate([margin.left, margin.top]);



  // pass the network data to d3_clustergram 
  make_d3_clustergram(global_network_data);

}

// set var doit 
var doit;


// function with timeout
function timeout_resize(){

  // clear timeout
  clearTimeout(doit);

  doit = setTimeout( reset_visualization_size, 500)  ;


};

// resize window 
d3.select(window).on('resize', timeout_resize); 