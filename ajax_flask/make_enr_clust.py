def main(inst_genes, num_terms, dist_type):

	print('in main function of make_enr_clust')

	# calculate enrichment 
	enr = calc_tf_enrichment(inst_genes)

	# reduce the number of enriched terms if necessary
	if len(enr) < num_terms:
		num_terms = len(enr)

	# make clustergram 
	d3_json = make_enrichment_clustergram(enr, num_terms, dist_type)

	return d3_json

# transcription factor enrichment 
def calc_tf_enrichment(inst_gl):
	import calc_enrichment_gl_gmt
	import os


	# import chea gmt
	gmt = {} 

	# print('loading gmt')

	# use the intersection tf gmt: tf_inf.gmt, not ChEA.gmt
	gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/TF/tf_int.gmt')

	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/TF/ChEA.gmt')

	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/KIN/kinase_substrate.gmt')
	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/PP/phosphatase_substrate_GMT.txt')

	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/Phosphatase_Substrates_from_DEPOD.txt')

	# initialize enrichment data 
	enr = {}

	# calculate enrichment
	enr = calc_enrichment_gl_gmt.calc( inst_gl, gmt['chea'] )

	return enr

# make clustergram
def make_enrichment_clustergram(enr, num_terms, dist_type):
	import d3_clustergram

	# convert enr to nodes, data_mat 
	nodes, data_mat = d3_clustergram.convert_enr_to_nodes_mat( enr, num_terms )

	# cluster rows and columns 
	clust_order = d3_clustergram.cluster_row_and_column( nodes, data_mat, dist_type, enr )

	# generate d3_clust json 
	d3_json = d3_clustergram.d3_clust_single_value( nodes, clust_order, data_mat )

	return d3_json
