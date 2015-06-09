# make the requests to enrichr using requests 
def main():

	# input genes
	input_genes = ["CD2BP2", "SLBP", "FOXK2", "STMN2", "SMAD4", "EIF6", "SF1", "CTNND2", "DBN1", "IQGAP2", "P2RX6", "ANKRD6", "C9ORF40", "ARHGEF7", "GOLGA2", "PPME1", "FAM129A", "YES1", "GLI4", "1600027N09RIK", "PTS", "PATL1", "ORAI1", "SPATS2L", "DCX", "HK2", "CSPG4", "AMBRA1", "SENP3", "THOP1", "DSG2", "PER1", "ACLY", "NR1H4", "PTPN7", "BRD2", "TAX1BP1", "RGS14", "SLC40A1", "CNN3", "PLSCR1", "PIP5K1B", "GRB14", "CTR9", "ARHGAP15", "TOM1L2", "ZNF148", "TBC1D12", "BAIAP2", "TOP2A"]

	# run request function 
	enr, userListId = make_request(input_genes, '', 'ChEA' )

	print(enr[0])
	print(userListId)

def make_request( input_genes, meta='', gmt='' ):

  # get metadata 
	import requests
	import json

	# stringify list 
	input_genes = '\n'.join(input_genes)

	# define post url 
	post_url = 'http://amp.pharm.mssm.edu/Enrichr/addList'

	# define parameters 
	params = {'list':input_genes, 'description':''}

	# make request: post the gene list
	post_response = requests.post( post_url, files=params)

	# load json 
	inst_dict = json.loads( post_response.text )
	userListId = str(inst_dict['userListId'])

	# define the get url 
	get_url = 'http://amp.pharm.mssm.edu/Enrichr/enrich'

	# get parameters 
	params = {'backgroundType':gmt,'userListId':userListId}

	# make the get request to get the enrichr results 
	get_response = requests.get( get_url, params=params )

	# load as dictionary 
	resp_json = json.loads( get_response.text )

	# get the key 
	only_key = resp_json.keys()[0]

	enr = resp_json[only_key]

	# return enrichment json and userListId
	return enr, userListId

# run main
main()