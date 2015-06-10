# this will load Andrew's data 
def main():

	# load andrew data 
	load_andrew_data()

	# cluster the matrix, return clust_order
	

	# generate d3_clust json: return json 




def load_andrew_data():
	import json_scripts 
	import d3_clustergram 
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

	# initialize data matrix 
	data_mat = scipy.zeros([ 10, len(matrix[0]['entries']) ])

	# print(type(matrix))
	# print(len(matrix))
	# print('\n')

	# loop through the list 
	for i in range(10):

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