# this will load Andrew's data 
def main():

	# # load andrew data - there are 32,153 genes
	# load_andrew_data()

	# genrate d3 json 
	generate_d3_json()

def add_grant_num_to_clust():
	import json_scripts
	import numpy as np 
	import scipy

	print('\n-----------------\nadding grant numbers\n-----------------\n')

	# load json of Andrew data
	data_json = json_scripts.load_to_dict('andrew_data/cumul_probs.json')

	print( '\nthere are ' + str(len(data_json['nodes']['row'])) + ' genes in total' )
	print( 'there are ' + str(len(data_json['nodes']['col'])) + ' resources in total\n' )

	data_mat = np.asarray(data_json['data_mat'])

	print('data_mat shape')
	print(data_mat.shape)

	print('\ngoing to add grants per gene as a column into the harmonogram\n')

	# make an array of zeros that will be added to the matrix as a new column 
	num_rows = len(data_json['nodes']['row'])
	extra_col = scipy.zeros([ num_rows, 1 ])
	# #!! temporarily switching to ones from zeros
	# extra_col = scipy.ones([ num_rows, 1 ])

	print('extra col shape')
	print(extra_col.shape)
	print(extra_col)

	# add the column using hstack
	data_mat = np.hstack((data_mat, extra_col))

	print('data_mat shape after adding in extra column')
	print(data_mat.shape)

	# does not need to be done here 
	######################
	# # add extra resource name 
	# data_json['nodes']['col'].append('Grants_Per_Gene')

	print( 'there are ' + str(len(data_json['nodes']['col'])) + ' resources in total after adding grants per gene\n' )
	# print(data_json['nodes']['col'])

 	# add grants data to data_mat
 	###############################
	# load grants_per_gene data
	grants_gene = json_scripts.load_to_dict('andrew_data/grants_per_gene.json')

	# make list of genes that were not found
	genes_not_found = []
	genes_found = []

	# loop through genes and add grant information into data_mat 
	for inst_gene in grants_gene:

		# get the index if the gene is in rows 
		if inst_gene in data_json['nodes']['row']:

			# get the index of inst_gene
			inst_index = data_json['nodes']['row'].index(inst_gene)

			# print(inst_index)

			# keep track of found genes 
			genes_found.append(inst_gene)

			# save CumulProbWeightSum to the matrix 
			inst_grants = grants_gene[inst_gene]['CumulProbWeightSum']

			# save the number of grants to the last column  
			# data_mat[inst_index,-1] = inst_grants
			## put in fake data
			data_mat[inst_index,82] = 1 #inst_grants

		else:
			# keep track of not found genes 
			genes_not_found.append(inst_gene)

	# print(len(genes_found))
	# print(len(genes_not_found))
	# print(data_mat.shape)


	print('\n-------------\nchecking data_mat\n----------------\n')
	print(len(data_mat[:,-1]))
	print(data_mat[inst_index,82])
	print(data_mat[2,82])

	# convert data_mat to list
	data_mat = data_mat.tolist()

	# add back to json 
	data_json['data_mat'] = data_mat

	# save to json 
	json_scripts.save_to_json(data_json, 'andrew_data/cumul_probs.json', 'no_indent')

def load_grants_per_gene():
	import json_scripts

	# open text file
	filename = 'andrew_data/grantspergene_weighted_standardized.txt'
	f = open(filename,'r')
	lines = f.readlines()
	f.close()

	# grab the column names 
	col_names = lines[0].strip().split('\t')

	# initialize dictionary 
	grant_gene = {}

	# loop through the lines
	for i in range(len(lines)):

		# grab the data for each gene 
		if i > 0:

			# get inst_line 
			inst_line = lines[i].strip().split('\t')

			# get gene name 
			inst_name = inst_line[0]

			# initialize dictionary for gene
			grant_gene[inst_name] = {}

			# save information on gene 
			for j in range(len(col_names)):
				# skip first element 
				if j > 0:

					# save column name as dictionary key
					grant_gene[inst_name][col_names[j]] = float(inst_line[j])

			# print(grant_gene[inst_name])

	# print(grant_gene['SELL'])

	# save to json 
	json_scripts.save_to_json(grant_gene, 'andrew_data/grants_per_gene.json', 'indent')

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

	# #!! temporarily set data_mat to zeros
	# data_mat = scipy.zeros([ len(nodes['row']), len(nodes['col']) ])

	print(nodes['col'])
	print(data_mat.shape)

	print('calculating clustering orders')

	# gene and resource classes 
	################################# 
	# gene class 
	gc = json_scripts.load_to_dict('gene_classes_harminogram.json')
	# resource class 
	rc = json_scripts.load_to_dict('resource_classes_harminogram.json')

	# loop through classes
	for inst_class in gc:

		print(inst_class + '\n')

		# initialize class matrix 
		# class_mat is the subset of data_mat that only has genes of one class, e.g. kinases
		class_mat = np.array([])

		# initialize class_nodes for export 
		class_nodes = {}
		class_nodes['col'] = nodes['col']
		class_nodes['row'] = []

		# loop through the rows and check if they are in the class
		for i in range(len(nodes['row'])):

			# get the index 
			inst_gs = nodes['row'][i]

			# check if in class list 
			if inst_gs in gc[inst_class]:

				# print(inst_gs)

				# append gene symbol name to row 
				class_nodes['row'].append(inst_gs)

				# initialize class_mat if necesary 
				if len(class_mat) == 0:
					class_mat = data_mat[i,:]
				else:

					# fill in class_mat
					class_mat = np.vstack( (class_mat, data_mat[i,:] ))  


		# # actual clustering 
		# ########################
		# # cluster the matrix, return clust_order
		# clust_order = d3_clustergram.cluster_row_and_column( class_nodes, class_mat, 'cosine' )

		#!! performing mock clusteringl

		# mock clustering
		############################
		print('mock clustering')
		clust_order = {}
		# mock cluster 
		clust_order['clust'] = {}
		clust_order['clust']['row'] = range(len(class_nodes['row']))
		clust_order['clust']['col'] = range(len(class_nodes['col']))
		# mock rank 
		clust_order['rank'] = {}
		clust_order['rank']['row'] = range(len(class_nodes['row']))
		clust_order['rank']['col'] = range(len(class_nodes['col']))

		print('generating d3 json')

		# generate d3_clust json: return json 
		d3_json = d3_clustergram.d3_clust_single_value(class_nodes, clust_order, class_mat )

		# add extra information (data_group) to d3_json - add resource class to d3_json['col_nodes']
		###############################################################################################
		# loop through col_nodes
		for inst_col in d3_json['col_nodes']:

			# get the inst_res
			inst_res = inst_col['name']

			# add the resource-class - data_group
			inst_col['data_group'] = rc[ inst_res ]['data_group'].replace(' ','_')

		print('saving to disk')

		# save visualization json 
		json_scripts.save_to_json(d3_json,'static/networks/'+inst_class+'_cumul_probs.json','no_indent')

def load_resource_real_names():
	import json_scripts
	print('loading resource real names')

	# open text file
	filename = 'andrew_data/resource_mapping_names.txt'
	f = open(filename,'r')
	lines = f.readlines()
	f.close()

	# make a dictionar of real resource names 
	rn = {}

	# loop through the lines
	for inst_line in lines:

		# clean the line
		inst_line = inst_line.strip().split('\t')

		# if there is a real name, keep the resource 
		if len(inst_line) == 2:
			
			# add the resource and real name to dict - no spaces 
			rn[inst_line[0]] = inst_line[1].replace(' ','_')

	# save dictionary to json 
	json_scripts.save_to_json(rn,'resource_real_names.json','indent')

def load_resource_classes():
	import json_scripts
	print('loading resource classes')

	# open text file 
	filename = 'andrew_data/resource_classes.txt'
	f = open(filename,'r')
	lines = f.readlines()
	f.close()

	# add the information into a dictionary 
	rc = {}

	# loop through the lines
	for i in range(len(lines)):

		# get a list of line components 
		inst_line = lines[i].split('\t')

		# get key names from first row 
		if i != 0:

			# I need dataset name, not resource name 
			################

			# get resource name - no spaces 
			inst_name = inst_line[1].replace(' ','_')

			# initialize dictionary 
			rc[inst_name] = {}

			# # dataset name
			# rc[inst_name]['dataset_name'] = inst_line[1]

			# description 
			rc[inst_name]['description'] = inst_line[2]

			# data type 
			rc[inst_name]['data_type'] = inst_line[3]

			# data group
			rc[inst_name]['data_group'] = inst_line[4]

			# association
			rc[inst_name]['association'] = inst_line[5]

			# attribute type
			rc[inst_name]['attribute_type'] = inst_line[6]

			# attribute group 
			rc[inst_name]['attribute_group'] = inst_line[7]

	# save resource classes 
	json_scripts.save_to_json(rc,'resource_classes_harminogram.json','indent')


# load andrew json and convert to scipy array 
def load_andrew_data():
	import json_scripts 
	import scipy
	import numpy as np 

	# load resource classes
	load_resource_classes()

	# load resource mapping names 
	load_resource_real_names()

	# load Andrew's data 
	matrix = json_scripts.load_to_dict('andrew_data/gene_dataset_cumulprobs_20150609.json')

 	# add grants data to data_mat
 	###############################
	# load grants_per_gene data
	grants_gene = json_scripts.load_to_dict('andrew_data/grants_per_gene.json')

	# only keep the resources with real names 
	rn = json_scripts.load_to_dict('resource_real_names.json')

	# Andrew data format 
	######################
	# matrix is a list of dictionaries 
	# each element of the list has a dictionary with two keys: label and entries
	# the first element of the list describes the columns of the matrix - label: n.a., entries: resources 
	# the rest of the rows have gene names and the value of the gene in each resource  
	# I will convert Andrew's data into 
	# nodes and data_mat 
	print('\nstarting to process data')

	# save row and column data to nodes 
	nodes = {}
	# initialize a list of genes 
	nodes['row'] = []
	# get the good resources - get the real names 
	nodes['col'] = rn.values()

	# save the column index of grants per gene 
	col_index_grant = nodes['col'].index('Grants_Per_Gene')

	# print('\nlength of nodes col')
	# print(len(nodes['col']))
	# print('\n')

	# get the number of rows in the matrix
	# make the matrix smaller by one row 
	# num_rows = len(matrix) 
	num_rows = len(matrix) - 1

	# print('\nmatrix:')
	# print(matrix[0]['label'])
	# print(matrix[1]['label'])
	# print(matrix[2]['label'])
	# print('...')
	# print(matrix[-2]['label'])
	# print(matrix[-1]['label'])
	# print('\n')

	# print('there are '+str(num_rows)+' genes in the original data from Andrew')

	# initialize data matrix
	# rows - genes
	# cols - good resources 
	data_mat = scipy.zeros([ num_rows, len(rn.keys()) ])

	print('\n---------------\nadding original data to matrix\n----------------')

	# loop through the list 
	# add one to account for the full length of the matrix
	for i in range(num_rows+1):

		# get the inst row of the matrix 
		inst_row = matrix[i]

		# grab the gene name 
		inst_name = inst_row['label']

		# grab the list of entries - the actual numerical data 
		inst_entries = inst_row['entries'] 

		# gather the resource names 
		if i == 0:

			# gather all resource (columns) 
			all_res = inst_row['entries']

		# skip the first line - it has column information
		if i > 0:

			# save to nodes['row']
			nodes['row'].append(inst_name)

			# only add data from good resources
			######################################

			# save values to matrix 
			for j in range(len(inst_entries)):

				# only add data from good resources 
				if all_res[j] in rn:

					# get the inst 
					inst_data_point = inst_entries[j]

					# get the resource index in the list of good resources - nodes['col']
					# translate the long name (with underscores) to the real name 
					inst_index = nodes['col'].index( rn[all_res[j]] )

					# fill in the matrix with the entries from row i 

					# shift the index back one to compensate for first row
					matrix_index = i-1
					# shift the index to account for first row of colun labels
					data_mat[matrix_index,inst_index] = inst_data_point

	print('\n---------------\nadding grants to matrix\n----------------')

	# add grants per gene to matrix
	##################################
	for inst_gene in grants_gene:

		# get the index of the gene if it is in the original rows 
		if inst_gene in nodes['row']:

			# get the index of inst_gene
			inst_index = nodes['row'].index(inst_gene)

			# get the number of grants
			inst_grants = grants_gene[inst_gene]['CumulProbWeightSum']

			# save the number of grants to the appropriate column
			data_mat[inst_index,col_index_grant] = inst_grants

	# print('i '+str(i))
	# print('\n')			
	# print('shape of data_mat after filling in ')
	# print(data_mat.shape)
	# print('\n')			
	# print('length of nodes row')
	# print(len(nodes['row']))
	# print('nodes')
	# print(nodes['row'][0])
	# print(nodes['row'][-1])
	# print('\n')

	# save json of the numpy-ready data 
	#
	# convert numpy array to list 
	data_mat = data_mat.tolist()

	# make one dictionary 
	inst_dict = {}
	inst_dict['nodes'] = nodes
	inst_dict['data_mat'] = data_mat 

	# save to json 
	json_scripts.save_to_json(inst_dict,'andrew_data/cumul_probs.json','no_indent')

	# # add grant number to clustergram 
	# add_grant_num_to_clust()

# run main
main()