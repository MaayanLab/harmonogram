gene_dataset_counts_20150609.txt is a matrix with gene symbols labeling the rows and datasets labeling the columns.
the values in the matrix report the number of associations each gene has with attributes in the dataset.
this is equivalent to the number of times the gene appears in the gmt file for the dataset.

the raw counts are not well scaled across datasets for visualization on a heatmap (see powerpoint file for heatmaps).
i tried a few different transformations to get better scaling of the data: frequencies, cumulative probabilities, log2counts, mean normalized counts, and 95th percentile normalized counts.
i think it is best to display the cumulative probabilities or the thresholded counts.
the thresholded counts file simply indicates which genes appear in which datasets.
the cumulative probabilities file indicates how many associations a gene has in a dataset relative to other genes appearing in the dataset.  genes with many associations have values close to 1, while genes with few associations have values close to 0.

the json files contain a list of dictionaries.
each dictionary corresponds to a row in the matrix (including the header row).
each dictionary has the format {'label':rowlabel, 'entries':rowvalues}
in the first row, the rowvalues are the column labels.

i included a python script that parses the matrix files to create the json files, so you can modify that script to get the json files formatted however you like.