def main():
	''' 
	This will calculate the harmonogram clustergrams 
	from the latest matrix from Andrew.
	''' 

	# # load data, filter protein type, and cluster 
	# load_hgram_data_to_json()

	# make protein type clustergrams 
	make_prot_type_hgrams()	

def load_hgram_data_to_json():
	from d3_clustergram_class import Network
	from copy import deepcopy

	# generate object to hold all data 
	hgram = deepcopy(Network())

	# get instance of Network  
	hgram = Network()
	print(hgram.__doc__)
	print('\n\tload matrix clustergram')	

	# use hgram method to load Andrew data 	
	hgram.load_hgram('hgram_data_latest/gene_dataset_cumulprobs_20150814.txt')

	# export dictionary and save to file 
	hgram_data_json = hgram.write_json_to_file('dat', 'hgram_data_latest/hgram_latest.json')

def make_prot_type_hgrams():
	from d3_clustergram_class import Network
	from copy import deepcopy
	import numpy as np

	# generate jgram object 
	hgram = deepcopy(Network())

	# load data from json 
	#####################################################
	# load self.dat from json: first load json, then load to dat 
	hgram = deepcopy(Network())
	# load dat json from file to network - this will be done frequently so I made a module 
	hgram.load_data_file_to_net('hgram_data_latest/hgram_latest.json')


	# gene classes 
	gc = hgram.load_json_to_dict('gene_classes_harmonogram.json')

	# make a dictionary to hold all classes
	all_net = {}

	# initialize networks for each protein type 
	for inst_gc in gc:
		# initialize a new network 
		all_net[inst_gc] = deepcopy(Network())

		# set the columns - the same for all networks 
		all_net[inst_gc].dat['nodes']['col'] = hgram.dat['nodes']['col']

		# transfer node information 
		all_net[inst_gc].dat['node_info']['col'] = hgram.dat['node_info']['col']

		# not necessary since its already there as info 
		# # transfer 'res_group' information to 'info'
		# all_net[inst_gc].dat['node_info']['col']['info'] = all_net[inst_gc].dat['node_info']['col']['res_group']


	# transfer data from hgram to gene classes 
	#############################################
	for i in range(len(hgram.dat['nodes']['row'])):

		# get inst_gene 
		inst_gene = hgram.dat['nodes']['row'][i]

		# check if the gene fall into any class 
		for inst_gc in gc:
			if inst_gene in gc[inst_gc]:
				# add inst_gene and current row data to gene class network 
				all_net[inst_gc].dat['nodes']['row'].append(inst_gene)

				# add mat 
				# initialize matrix 
				if type( all_net[inst_gc].dat['mat'] ) is list:
					all_net[inst_gc].dat['mat'] = hgram.dat['mat'][i,:]
				# append to matrix 
				else:
					all_net[inst_gc].dat['mat'] = np.vstack( ( all_net[inst_gc].dat['mat'], hgram.dat['mat'][i,:] ) )


	# add mat_info to each of the gene classes 
	######################################################
	for inst_gc in gc:

		# get the col index of the grants
		grants_col_index = all_net[inst_gc].dat['nodes']['col'].index('NIH Reporter Grants Linked to NCBI Genes Through Publications')

		mat_info = {}
		for i in range(len(all_net[inst_gc].dat['nodes']['row'])):
			for j in range(len(all_net[inst_gc].dat['nodes']['col'])):

				# tmp make all info 1 
				mat_info[(i,j)] = 0

				# if j is the grants column, change info to 1 
				if j == grants_col_index:
					mat_info[(i,j)] = 1	

			# transfer to .dat 
			all_net[inst_gc].dat['mat_info'] = mat_info

	# generate clustergrams for all protein types 
	###############################################
	for inst_gc in all_net:

		print('\n\nclustering\t' + inst_gc)
		print(all_net[inst_gc].dat['mat'].shape)

		# # filter the matrix 
		# all_net[inst_gc].filter_network_thresh(cutoff=0.3, min_num_meet=10)

		# cluster 
		#############
		# only compare vectors with at least min_num_comp common data points
		# with absolute values above cutoff_comp 
		cutoff_comp = 0.05
		min_num_comp = 3
		all_net[inst_gc].cluster_row_and_col('cos', cutoff_comp, min_num_comp, dendro=False)

		# export data visualization to file 
		######################################
		all_net[inst_gc].write_json_to_file('viz', 'static/networks/'+inst_gc+'_cumul_probs.json')	

main()