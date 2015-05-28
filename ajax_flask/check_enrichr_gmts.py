def main():
	import cookielib, poster, urllib2, json

	# make a get request to get the gmt names and meta data from Enrichr
	x = urllib2.urlopen('http://amp.pharm.mssm.edu/Enrichr/geneSetLibrary?mode=meta')
	response = x.read()
	gmt_data = json.loads(response)

	# local version 
	# gmt_data = json_scripts.load_to_dict('enrichr_gmts.json')

	# generate list of gmts 
	gmt_names = []

	# get library names 
	for inst_gmt in gmt_data['libraries']:

		# only include active gmts 
		if inst_gmt['isActive'] == True:

			gmt_names.append(inst_gmt['libraryName'])

	return gmt_names

# run main
main()