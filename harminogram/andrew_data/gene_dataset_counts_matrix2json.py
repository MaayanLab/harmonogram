import json

# this script parses tab-delimited matrix files into json
# the first row contains the column labels
# the second and third rows are junk
# the first column contains the row labels
# the second and third columns are junk

def main(filenames):

	for filename in filenames:

		rows = []

		with open(filename + '.txt', 'r') as f:

			line = f.readline()

			entries = line.rstrip().split('\t')

			rows.append({'label':'header', 'entries':entries[3:]})

			line = f.readline()
			line = f.readline()

			for line in f:

				entries = line.rstrip().split('\t')

				rows.append({'label':entries[0], 'entries':entries[3:]})

		with open(filename + '.json', 'w') as f:

			json.dump(rows, f, indent = 2)

main(['gene_dataset_counts_20150609', 'gene_dataset_cumulprobs_20150609', 'gene_dataset_threshcounts_20150609', 'gene_dataset_frequencies_20150609', 'gene_dataset_meannormcounts_20150609', 'gene_dataset_95pctilenormcounts_20150609', 'gene_dataset_log2counts_20150609'])


