# this will load Andrew's data 
def main():

	import json_scripts

	# load Andrew's data 
	matrix = json_scripts.load_to_dict('andrew_data/gene_dataset_cumulprobs_20150609.json')

	print(type(matrix))
	print(len(matrix))
	print(matrix[1]['label'])
	print(matrix[1]['entries'])

# run main
main()