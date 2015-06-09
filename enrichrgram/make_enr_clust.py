def main( gmt_colors, inst_genes, num_terms, dist_type):

	print('in main function of make_enr_clust')
  
	# get list of gmts
	gmt_names = gmt_colors.keys()

	print('\ngmt colors '+ gmt_names[0] + '\n')

	# get results from enrichr 
	# 
	response_dict = enrichr_result(inst_genes, '', gmt_names[0])

	# p-value, adjusted pvalue, z-score, combined score, genes 
	# 1: Term 
	# 2: P-value
	# 3: Z-score
	# 4: Combined Score
	# 5: Genes
	# 6: pval_bh

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
		# adjusted pval
		inst_dict['pval_bh'] = inst_enr[6]

		# append dict
		enr.append(inst_dict)

	# reduce the number of enriched terms if necessary
	if len(enr) < num_terms:
		num_terms = len(enr)

	# make clustergram 
	d3_json = make_enrichment_clustergram(enr, num_terms, dist_type)

	return d3_json

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
	import time

	global baseurl
	baseurl = 'amp.pharm.mssm.edu'
	# baseurl = 'matthews-mbp:8080'

	"""return the enrichment results for a specific gene-set library on Enrichr"""
	cj = cookielib.CookieJar()
	opener = poster.streaminghttp.register_openers()
	opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
	genesStr = '\n'.join(genes)

	params = {'list':genesStr,'description':meta,'inputMethod':'enrichr_cluster'}
	datagen, headers = poster.encode.multipart_encode(params)
	url = "http://" + baseurl + "/Enrichr/enrich"
	request = urllib2.Request(url, datagen, headers)

	# wait for request 
	resp = urllib2.urlopen(request)
	
	# # print(resp.read())
	# time.sleep(2)

	# alternate wait for response
	# try:
	# 	resp = urllib2.urlopen(request)
	# 	print(resp.read())
	# except IOError as e:
	# 	pass

	x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
	response = x.read()
	response_dict = json.loads(response)
	return response_dict[gmt]