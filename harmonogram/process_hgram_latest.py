def main():
	''' 
	This will calculate the harmonogram clustergrams 
	from the latest matrix from Andrew.
	''' 

	# load data, filter protein type, and cluster 
	proc_hgram_data()

def proc_hgram_data():
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




	# all_dat.load_tsv_to_net('')
		
	# # load network from tsv file 
	# ##############################
	# net.load_tsv_to_net('example_tsv_network.txt')

	# # cluster 
	# #############
	# # only compare vectors with at least min_num_comp common data points
	# # with absolute values above cutoff_comp 
	# cutoff_comp = 0
	# min_num_comp = 2
	# net.cluster_row_and_col('cos', cutoff_comp, min_num_comp)

	# # export data visualization to file 
	# ######################################
	# net.write_json_to_file('viz', 'example_network.json','indent')	

main()