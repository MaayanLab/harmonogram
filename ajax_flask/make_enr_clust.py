def main( gmt_name, inst_genes, num_terms, dist_type):

	print('in main function of make_enr_clust')
    
	# get results from enrichr 
	# 
	inst_gmt = 'GO_Biological_Process'
	response_dict = enrichr_result(inst_genes, '', inst_gmt)

	# p-value, adjusted pvalue, z-score, combined score, genes 
	# 1: Term 
	# 2: P-value
	# 3: Z-score
	# 4: Combined Score
	# 5: Genes
	for inst_elem in response_dict[0]:
	    print(inst_elem)
	print('\n')


	# # calculate enrichment 
	# enr = calc_tf_enrichment(gmt_name, inst_genes)

	# print(enr[0].keys())
	# array of dicts 
	# pval
	# pval_bon
	# pval_bh
	# name
	# int_genes

	# transfer response_dict to enr structure 
	#
	# initialize enr
	enr = []
	for inst_enr in response_dict:
		# initialize dict 
		inst_dict = {}

		# transfer term 
		inst_dict['name'] = inst_enr[1]
		# transfer pval
		inst_dict['pval'] = inst_enr[2]
		# transfer zscore
		inst_dict['zscore'] = inst_enr[3]
		# transfer combined_score
		inst_dict['combined_score'] = inst_enr[4]
		# transfer int_genes 
		inst_dict['int_genes'] = inst_enr[5]

		# append dict
		enr.append(inst_dict)

	# reduce the number of enriched terms if necessary
	if len(enr) < num_terms:
		num_terms = len(enr)

	# make clustergram 
	d3_json = make_enrichment_clustergram(enr, num_terms, dist_type)

	return d3_json

# transcription factor enrichment 
def calc_tf_enrichment(gmt_name, inst_gl):
	import calc_enrichment_gl_gmt
	import os


	# import chea gmt
	gmt = {} 

	# print('loading gmt')

	# defaule 
	filename = 'ajax_flask/enz_and_tf_lists_gmts/TF/tf_int.gmt'

	if gmt_name == 'tf_int':
		filename = 'ajax_flask/enz_and_tf_lists_gmts/TF/tf_int.gmt'

	elif gmt_name == 'chea':
		filename = 'ajax_flask/enz_and_tf_lists_gmts/TF/ChEA.gmt' 

	elif gmt_name == 'kea':
		filename = 'ajax_flask/enz_and_tf_lists_gmts/KIN/kinase_substrate.gmt' 

	# use the intersection tf gmt: tf_inf.gmt, not ChEA.gmt
	gmt = calc_enrichment_gl_gmt.load_gmt(filename)

	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt()
	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/PP/phosphatase_substrate_GMT.txt')
	# gmt['chea'] = calc_enrichment_gl_gmt.load_gmt('ajax_flask/enz_and_tf_lists_gmts/Phosphatase_Substrates_from_DEPOD.txt')

	# initialize enrichment data 
	enr = {}

	# calculate enrichment
	enr = calc_enrichment_gl_gmt.calc( inst_gl, gmt )

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


def enrichr_result(genes, meta='', gmt=''):
	import cookielib, poster, urllib2, json

	global baseurl
	baseurl = 'amp.pharm.mssm.edu'

	"""return the enrichment results for a specific gene-set library on Enrichr"""
	cj = cookielib.CookieJar()
	opener = poster.streaminghttp.register_openers()
	opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
	genesStr = '\n'.join(genes)

	params = {'list':genesStr,'description':meta}
	datagen, headers = poster.encode.multipart_encode(params)
	url = "http://" + baseurl + "/Enrichr/enrich"
	request = urllib2.Request(url, datagen, headers)
	urllib2.urlopen(request)

	x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
	response = x.read()
	response_dict = json.loads(response)
	return response_dict[gmt]