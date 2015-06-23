# this will load Andrew's data 
def main():
	# # load andrew data 
	# load_andrew_data()

	# genrate d3 json 
	generate_d3_json()

def generate_d3_json():
	import json_scripts
	import d3_clustergram
	import scipy
	import numpy as np 

	print('loading json in generate_d3_json')
	# load saved json of andrew data 
	data_json = json_scripts.load_to_dict('andrew_data/cumul_probs.json')

	# get nodes and data_mat 
	nodes = data_json['nodes']
	data_mat = np.asarray(data_json['data_mat'])

	print('calculating clustering orders')

	# visualize one class at a time 
	################################# 
	gc = json_scripts.load_to_dict('gene_classes_harminogram.json')
	# class_mat = scipy.zeros([len(gc['KIN']),len(nodes['col'])])
	class_mat = np.array([])

	print(len(class_mat))

	# initialize class_nodes for export 
	class_nodes = {}
	class_nodes['col'] = nodes['col']
	class_nodes['row'] = []

	# loop through the rows and check if they are kinases
	for i in range(len(nodes['row'])):

		# get the index 
		inst_gs = nodes['row'][i]

		# check if in gc['KIN']
		if inst_gs in gc['KIN']:

			print(inst_gs)

			# append kinase name to row 
			class_nodes['row'].append(inst_gs)

			# initialize class_mat if necesary 
			if len(class_mat) == 0:
				class_mat = data_mat[i,:]
			else:

				# fill in class_mat
				class_mat = np.vstack( (class_mat, data_mat[i,:] ))  

	# check
	print(class_mat.shape)


	# actual clustering 
	########################
	# cluster the matrix, return clust_order
	clust_order = d3_clustergram.cluster_row_and_column( class_nodes, class_mat, 'euclidean' )

	# # mock clustering
	# ############################
	# print('mock clustering')
	# clust_order = {}
	# # mock cluster 
	# clust_order['clust'] = {}
	# clust_order['clust']['row'] = range(len(class_nodes['row']))
	# clust_order['clust']['col'] = range(len(class_nodes['col']))
	# # mock rank 
	# clust_order['rank'] = {}
	# clust_order['rank']['row'] = range(len(class_nodes['row']))
	# clust_order['rank']['col'] = range(len(class_nodes['col']))

	print('generating d3 json')

	# generate d3_clust json: return json 
	d3_json = d3_clustergram.d3_clust_single_value(class_nodes, clust_order, class_mat )

	print('saving to disk')

	# save visualization json 
	json_scripts.save_to_json(d3_json,'static/networks/network_cumul_probs.json','no_indent')


# load andrew json and convert to scipy array 
def load_andrew_data():
	import json_scripts 
	import scipy
	import numpy as np 

	# load Andrew's data 
	matrix = json_scripts.load_to_dict('andrew_data/gene_dataset_cumulprobs_20150609.json')

	# Andrew data format 
	######################
	# matrix is a list of dictionaries 
	# each element of the list has a dictionary with two keys: label and entries
	# the first element of the list describes the columns of the matrix - label: n.a., entries: resources 
	# the rest of the rows have gene names and the value of the gene in each resource  
	# I will convert Andrew's data into 
	# nodes and data_mat 

	# save row and column data to nodes 
	nodes = {}
	nodes['row'] = []
	nodes['col'] = []

	num_rows = len(matrix)

	# initialize data matrix 
	data_mat = scipy.zeros([ num_rows, len(matrix[0]['entries']) ])

	# print(type(matrix))
	# print(len(matrix))
	# print('\n')

	# loop through the list 
	for i in range(num_rows):

		# get the inst row of the matrix 
		inst_row = matrix[i]

		# grab the gene name 
		inst_name = inst_row['label']

		# grab the list of entries 
		inst_entries = inst_row['entries'] 

		# gather the resource names 
		if i == 0:

			# gather resource (columns) 
			nodes['col'] = inst_row['entries']

		# skip the first line - it has column information
		if i > 0:

			# save to nodes['row']
			nodes['row'].append(inst_name)

			# save values to matrix 
			for j in range(len(inst_entries)):

				# fill in the matrix with the entries from row i 
				data_mat[i,j] = inst_entries[j]

	print('converting to list')

	# save json of the numpy ready data 
	#
	# convert numpy array to list 
	data_mat = data_mat.tolist()

	# make one dictionary 
	inst_dict = {}
	inst_dict['nodes'] = nodes
	inst_dict['data_mat'] = data_mat 

	print('save to json')

	# save to json 
	json_scripts.save_to_json(inst_dict,'andrew_data/cumul_probs.json','no_indent')
	
	
# make clustergram
def make_enrichment_clustergram(enr, dist_type):
	import d3_clustergram

	# make a dictionary of enr_terms and colors 
	terms_colors = {}
	for inst_enr in enr:
		terms_colors[inst_enr['name']] = inst_enr['color']

	# print(terms_colors)

	# convert enr to nodes, data_mat 
	nodes, data_mat = d3_clustergram.convert_enr_to_nodes_mat( enr )

	# cluster rows and columns 
	clust_order = d3_clustergram.cluster_row_and_column( nodes, data_mat, dist_type, enr )

	# generate d3_clust json 
	d3_json = d3_clustergram.d3_clust_single_value( nodes, clust_order, data_mat, terms_colors )

	return d3_json

# run main
main()