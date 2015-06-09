# d3_clustergram.py has functions that will generate a d3 clustergram 

def d3_clust_single_value(nodes, clust_order, mat, terms_colors):
	import json
	import d3_clustergram

	# initialize dict
	d3_json = d3_clustergram.ini_d3_json()

	# append row dicts to array 
	for i in range(len(nodes['row'])):
		inst_dict = {}
		inst_dict['name'] = nodes['row'][i]
		inst_dict['clust'] = clust_order['clust']['row'].index(i)
		inst_dict['rank'] = clust_order['rank']['row'][i]
		inst_dict['nl_pval'] = clust_order['nl_pval']['row'][i]

		# append to row_nodes 
		d3_json['row_nodes'].append(inst_dict)

	# append col dicts to array 
	for i in range(len(nodes['col'])):
		inst_dict = {}
		inst_dict['name'] = nodes['col'][i]
		inst_dict['clust'] = clust_order['clust']['col'].index(i)
		inst_dict['rank'] = clust_order['rank']['col'][i]
		inst_dict['pval'] = clust_order['pval']['col'][i]
		inst_dict['nl_pval'] = clust_order['nl_pval']['col'][i]
		inst_dict['pval_bh'] = clust_order['pval_bh']['col'][i]
		inst_dict['color'] = terms_colors[nodes['col'][i]]

		# print(nodes['col'][i])

		# add to d3_json 
		d3_json['col_nodes'].append(inst_dict)

	# get max and min col and row value for scaling 
	# the row nl_pval is just the sum of enriched terms the gene appears in 
	max_row_value = max(clust_order['nl_pval']['row'])
	max_col_value = max(clust_order['nl_pval']['col'])

	# links - generate edge list 
	for i in range(len(nodes['row'])):
		for j in range(len(nodes['col'])):

			# initialize dict 
			inst_dict = {}
			# set source and target 
			inst_dict['source'] = i
			inst_dict['target'] = j

			# calculate the inst_value, a combination of col and row attributes
			# scale value by largest 
			row_value = clust_order['nl_pval']['row'][i] / max_row_value
			col_value = clust_order['nl_pval']['col'][j] / max_col_value

			# take the mean of the two values times the binary mat[i,j]
			inst_value = ( row_value + col_value )/ 2 * mat[i,j] 

			# save the inst_dict['value']
			inst_dict['value'] = inst_value 

			# # need to look up the color
			# print(nodes['col'][j])

			# add the color 
			inst_dict['color'] = terms_colors[nodes['col'][j]]

			# append to links 
			d3_json['links'].append( inst_dict )

	return d3_json

# cluster rows and columns 
def cluster_row_and_column( nodes, data_mat, dist_type, enr ):
	import find_dict_in_list
	import scipy
	import scipy.cluster.hierarchy as hier
	import numpy as np 
	from operator import itemgetter

	num_row = len(nodes['row'])
	num_col = len(nodes['col'])


	# # check pvalues 
	# for inst_term in nodes['col']:
	# 	# find dict in list 
	# 	inst_dict = find_dict_in_list.main( enr, 'name', inst_term ) 

	# Generate Row and Column Distance Matrices 
	############################################
	# initialize distance matrices 
	row_dm = scipy.zeros([num_row, num_row])
	col_dm = scipy.zeros([num_col, num_col])

	# print('making distance matrices')

	# define the minimum number of intersecting measurements
	min_num_intersect = 1

	# row dist_mat
	for i in range(num_row):
		for j in range(num_row):
			# calculate the distance between the rows in data_mat
			inst_dist = calc_dist_vectors( data_mat[i,:], data_mat[j,:], dist_type, min_num_intersect )
			# save the distance in the row distance matrix 
			row_dm[i,j] = inst_dist 

	# col dist_mat 
	for i in range(num_col):
		for j in range(num_col):
			# calculate the distance betweeen the columns in data_mat
			inst_dist = calc_dist_vectors( data_mat[:,i], data_mat[:,j], dist_type, min_num_intersect )
			# save the distance in the col distance matrix 
			col_dm[i,j] = inst_dist 

	# initialize index
	clust_order = {}
	clust_order['clust'] = {}
	clust_order['rank'] = {}
	clust_order['pval'] = {}
	clust_order['pval_bh'] = {}
	clust_order['nl_pval'] = {}

	# Cluster Rows
	###############
	cluster_method = 'centroid'
	# calculate linkage 
	Y = hier.linkage( row_dm, method=cluster_method)
	# getting error at dendrogram 
	Z = hier.dendrogram( Y, no_plot=True  )
	# get ordering
	clust_order['clust']['row'] = Z['leaves']

	# Cluster Columns 
	##################
	# calculate linkage 
	# print('clustering columns')
	Y = hier.linkage( col_dm, method=cluster_method)
	Z = hier.dendrogram( Y, no_plot=True )
	# get ordering
	clust_order['clust']['col'] = Z['leaves']

	# rank terms by pval
	#####################
	# since the enriched terms are already ordered by their pval
	# I will just reverse their order so that the terms with the 
	# lowest pvalues appear at the left 
	tmp_col_order = []
	# initialize the nl_pval data
	clust_order['nl_pval']['row'] = []
	clust_order['nl_pval']['col'] = []

	clust_order['pval']['col'] = []
	clust_order['pval_bh']['col'] = []
	clust_order['pval_bh']['row'] = []

	# add nl_pval
	for i in range(len(nodes['col'])):
		# get the ordering in reverse
		tmp_col_order.append( len(nodes['col']) - i )
		# get enrichment dict 
		inst_dict = find_dict_in_list.main( enr, 'name', nodes['col'][i])
		# gather pval 
		clust_order['pval']['col'].append( inst_dict['pval'] )
		# gather pval_bh 
		# clust_order['pval_bh']['col'].append( inst_dict['pval_bh'] )
		# use combined score instead 
		# 
		clust_order['pval_bh']['col'].append( inst_dict['combined_score'] )

		# # gather nl_pval 
		# clust_order['nl_pval']['col'].append( -np.log2(inst_dict['pval_bh']) )

		# use combined score instead 
		# the combined score can be negative if the zscore is positive 
		if inst_dict['combined_score'] < 0:
			clust_order['nl_pval']['col'].append( 0 )
		else: 
			clust_order['nl_pval']['col'].append( inst_dict['combined_score'] )

	# print( clust_order['nl_pval']['col'] )

	# save rank order 
	clust_order['rank']['col'] = tmp_col_order

	# rank genes by number 
	#######################
	# loop through genes 
	sum_term = []
	for i in range(len(nodes['row'])):
		
		# initialize dict 
		inst_dict = {}

		# get the name of the gene 
		inst_dict['name'] = nodes['row'][i] 

		# sum the number of terms that the gene is found in 
		inst_dict['num_term'] = np.sum(data_mat[i,:]) 

		# save the number of terms associated with each gene
		# data_mat is a binary matrix with 1 for gene in term and 0 for gene not in term  
		# take the dot product of the nl_pvalues and the binary matrix to get a weighted score for 
		# each row. The more highly enriched terms a gene is in the darker the tile 
		clust_order['nl_pval']['row'].append( np.dot( data_mat[i,:], clust_order['nl_pval']['col'] ) )

		# add this to the list of dicts
		sum_term.append(inst_dict)

	sum_term = sorted(sum_term, key=itemgetter('num_term'), reverse=False)
	
	# get list of sorted genes 
	tmp_sort_genes = []
	for inst_dict in sum_term:
		tmp_sort_genes.append(inst_dict['name']) 

	# get the sorted index 
	sort_index = []
	for inst_gene in nodes['row']:
		sort_index.append( tmp_sort_genes.index(inst_gene) )

	# save the sorted indexes 
	clust_order['rank']['row'] = sort_index


	return clust_order

# calculate the distance between two vectors if they share at least n overlapping points 
def calc_dist_vectors( i_vect, j_vect, dist_type, min_num_intersect ):

	import numpy
	import math
	import scipy

	# convert numpy arrays to lists 
	i_vect = i_vect.tolist()
	j_vect = j_vect.tolist()

	# find the non-zero indicies of i_vect and j_vect 
	meas_i = numpy.nonzero(i_vect)[0]
	meas_j = numpy.nonzero(j_vect)[0]

	# !! this is not a good way of doing this 
	meas_int = numpy.intersect1d(meas_i, meas_j) 

	# print(meas_int)

	# if there is any overlap 
	if len(meas_int) >= min_num_intersect:

		# grab subset of array using indices 
		data_i = [ i_vect[i] for i in meas_int]
		data_j = [ j_vect[i] for i in meas_int]

		# convert lists to arrays
		data_i = numpy.asarray(data_i)
		data_j = numpy.asarray(data_j)

		# calculate the distance between the rows in data_mat
		# scale down the length by the number of comparisons
		if dist_type == 'euclidean':
			inst_dist = numpy.linalg.norm( data_i - data_j )/ len(meas_int) 
		elif dist_type == 'cosine':
			inst_dist = scipy.spatial.distance.cosine(data_i, data_j)
		elif dist_type == 'jaccard':
			# get intersection and union 
			inst_intersection = list(set(meas_i).intersection(meas_j))
			inst_union = list( set(meas_i).union(meas_j) )
			# calculate jaccard distance 
			inst_dist = 1 - float(len(inst_intersection))/len(inst_union)

	# if there are no overlapping measurements, then set inst_dist to 100 
	else:
		inst_dist = 10000 

	# return the distance between two vectors 
	return inst_dist

# initialize d3 json 
def ini_d3_json():

	# initialize dict
	d3_json = {}
	# row_nodes
	d3_json['row_nodes'] = []
	# col_nodes
	d3_json['col_nodes'] = []
	# set links
	d3_json['links'] = []


	return d3_json

# generate data mat from node lists and ccle dict
def generate_data_mat_array( nodes, primary_data, row_name, col_name, data_name ):
	import scipy

	# initialize data_mat 
	data_mat = scipy.zeros([ len(nodes['row']), len(nodes['col']) ])

	# loop through rows
	for i in range(len(nodes['row'])):
		# loop through cols
		for j in range(len(nodes['col'])):

			# get inst_row and inst_col
			inst_row = nodes['row'][i]
			inst_col = nodes['col'][j]

			# find gene and cl index in zscored data 
			index_x = primary_data[row_name].index(inst_row)
			index_y = primary_data[col_name].index(inst_col)

			# map primary data to data_mat
			data_mat[i,j] = primary_data[data_name][ index_x, index_y ]

	return data_mat 

# convert enrichment results from dict format to array format 
def convert_enr_dict_to_array(enr, pval_cutoff):
	import scipy
	import find_dict_in_list
	import numpy as np

	# enr - data structure 
		# cell lines 
			# up_genes, dn_genes
				# name, pval, pval_bon, pva_bh, int_genes 

	# the columns are the cell lines 
	all_col = sorted(enr.keys())

	# the rows are the enriched terms 
	all_row = []

	# gather all genes with significantly enriched pval_bh 
	#######################################################
	updn = ['up_genes','dn_genes']
	# loop through cell lines 
	for inst_cl in enr:
		# loop through up/dn genes 
		for inst_updn in updn:

			# get inst_enr: the enrichment results from a cell line in either up/dn
			inst_enr = enr[inst_cl][inst_updn]

			# loop through enriched terms 
			for i in range(len(inst_enr)):

				# # append name if pval is significant 
				# if inst_enr[i]['pval_bh'] <= pval_cutoff:

				# append name to all terms 
				all_row.append(inst_enr[i]['name'])

	# get unique terms, sort them
	all_row = sorted(list(set(all_row)))

	# save row and column data to nodes 
	nodes = {}
	nodes['row'] = all_row
	nodes['col'] = all_col

	# gather data into matrix 
	#############################
	# initialize data_mat
	data_mat = {}
	data_mat['merge'] = scipy.zeros([ len(all_row), len(all_col) ])
	data_mat['up']    = scipy.zeros([ len(all_row), len(all_col) ])
	data_mat['dn']    = scipy.zeros([ len(all_row), len(all_col) ])	

	# loop through the rows (genes)
	for i in range(len(all_row)):
		
		# get inst row: gene 
		inst_gene = all_row[i]

		# loop through the columns (cell lines)
		for j in range(len(all_col)):

			# get inst col: cell line 
			inst_cl = all_col[j]

			# initialize pval_nl negative log up/dn
			pval_nl = {}

			# get enrichment from up/dn genes
			for inst_updn in updn:

				# initialize pval_nl[inst_updn] = np.nan
				pval_nl[inst_updn] = np.nan

				# gather the current set of enrichment results
				# from the cell line 
				inst_enr = enr[inst_cl][inst_updn]

				# check if gene is in list of enriched results 
				if any(d['name'] == inst_gene for d in inst_enr):

					# get the dict from the list
					inst_dict = find_dict_in_list.main( inst_enr, 'name', inst_gene)
					
					# only include significant pvalues
					if inst_dict['pval_bh'] <= 0.05:

						# retrieve the negative log pval_
						pval_nl[inst_updn] = -np.log2( inst_dict['pval_bh'] )

					else:
						# set nan pval
						pval_nl[inst_updn] = np.nan

			# set value for data_mat 
			###########################
			# now that the enrichment results have been gathered
			# for up/dn genes save the results 

			# there is both up and down enrichment 
			if np.isnan(pval_nl['up_genes']) == False and np.isnan(pval_nl['dn_genes']) == False:
				
				# set value of data_mat['merge'] as the mean of up/dn enrichment 
				data_mat['merge'][i,j] = np.mean([ pval_nl['up_genes'], -pval_nl['dn_genes'] ])

				# set values of up/dn
				data_mat['up'][i,j] =  pval_nl['up_genes']
				data_mat['dn'][i,j] = -pval_nl['dn_genes']

			# there is only up enrichment 
			elif np.isnan(pval_nl['up_genes']) == False:
				# set value of data_mat as up enrichment 
				data_mat['merge'][i,j] = pval_nl['up_genes'] 
				data_mat['up'   ][i,j] = pval_nl['up_genes']

			# there is only dn enrichment
			elif np.isnan(pval_nl['dn_genes']) == False:
				# set value of data_mat as the mean of up/dn enrichment 
				data_mat['merge'][i,j] = -pval_nl['dn_genes']
				data_mat['dn'   ][i,j] = -pval_nl['dn_genes']


	# return nodes, and data_mat 
	return nodes, data_mat

# convert enr array into gene rows and term columns 
def convert_enr_to_nodes_mat(enr):
	import scipy
	import find_dict_in_list
	import numpy as np

	# enr - data structure 
		# name, pval, pval_bon, pva_bh, int_genes 

	# gather all enriched terms 
	all_col = []
	for i in range(len(enr)):
		all_col.append(enr[i]['name'])

	# the rows are the input genes 
	all_row = []

	# gather terms significantly enriched terms 
	############################################# 
	# loop through the enriched terms 
	for i in range(len(enr)):

		# load inst_enr dict from the list of dicts, enr
		inst_enr = enr[i]

		# extend genes to all_row
		all_row.extend( inst_enr['int_genes'] )

	# get unique terms, sort them
	all_row = sorted(list(set(all_row)))

	# print( 'there are ' + str(len(all_row)) + ' input genes ')

	# save row and column data to nodes 
	nodes = {}
	nodes['row'] = all_row
	nodes['col'] = all_col

	# gather data into matrix 
	#############################
	# initialize data_mat
	data_mat = scipy.zeros([ len(all_row), len(all_col) ])

	# loop through the enriched terms (columns) and fill in data_mat 
	for inst_col in all_col:

		# get col index
		j = all_col.index(inst_col)

		# get the enrichment dict 
		inst_enr = find_dict_in_list.main( enr, 'name', inst_col )

		# grab the intersecting genes 
		inst_gene_list = inst_enr['int_genes']

		# loop through the intersecting genes 
		for inst_gene in inst_gene_list:

			# get the row index 
			i = all_row.index(inst_gene)

			# fill in 1 for the position i,j in data_mat 
			data_mat[i,j] = 1 

	# return nodes, and data_mat 
	return nodes, data_mat

# combine enrichment and expression data 
def combine_enr_exp(nodes, data_mat):
	import scipy
	import numpy as np


	# exp
	#	nodes: col, row 
	# data_mat: array

	# enr
	#	nodes: col, row 
	# data_mat: up, dn, merge

	# keep intersecting rows (genes)
	row_intersect = list(set(nodes['exp']['row']).intersection(nodes['enr']['row']))

	# make new_nodes 
	new_nodes = {}
	new_nodes['row'] = row_intersect
	new_nodes['col'] = nodes['exp']['col']

	# collect data_mats from exp and enr 
	tmp_mat = {}
	tmp_mat['exp']       = data_mat['exp']
	tmp_mat['enr_up']    = data_mat['enr']['up']
	tmp_mat['enr_dn']    = data_mat['enr']['dn']
	tmp_mat['enr_merge'] = data_mat['enr']['merge']
	
	# initialize array 
	new_mat = {}
	for inst_mat in tmp_mat:
		new_mat[inst_mat] = scipy.zeros([ 1, len(nodes['exp']['col']) ])

	# collect the data from the different data mats 
	for inst_mat in tmp_mat:
		# loop through the intersecting rows 
		for inst_row_name in row_intersect:

			# get index 
			if inst_mat == 'exp':
				index_x = nodes['exp']['row'].index(inst_row_name)
			else: 
				index_x = nodes['enr']['row'].index(inst_row_name)

			# get row and col indexes 
			inst_row_data = tmp_mat[inst_mat][index_x,:]

			# fill in row data
			if new_mat[inst_mat].shape[0] == 1:
				new_mat[inst_mat] = inst_row_data
			else:
				new_mat[inst_mat] = np.vstack([ new_mat[inst_mat], inst_row_data])

	return new_nodes, new_mat

		