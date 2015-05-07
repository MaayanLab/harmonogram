
function make_new_map(network_data){
  // remove old map
  d3.select("#main_svg").remove();
  d3.select('#kinase_substrates').remove();

  // wait message 
  d3.select('.blockMsg').select('h1').text('Waiting for matrix to load...');

  // pass in data and callback function 
  start_making_exp_map(network_data, make_svg_enrichment_genes );

};

// get parameters from sim_matrix before the matrix is made
function start_making_exp_map(sim_matrix, callback) {

  

  // after all of the variables have been initialized then run the callback function 
  callback(sim_matrix); 
};
