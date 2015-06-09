# make the requests to enrichr using requests 
def main():

	# run request function 
	make_request()


	# make_urllib2_request()



def make_urllib2_request():
	import cookielib, poster, urllib2, json
	import time

	global baseurl
	baseurl = 'amp.pharm.mssm.edu'
	# baseurl = 'matthews-mbp:8080'

	"""return the enrichment results for a specific gene-set library on Enrichr"""
	cj = cookielib.CookieJar()
	opener = poster.streaminghttp.register_openers()
	opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))



	# input genes
	input_genes = ["CD2BP2", "SLBP", "FOXK2", "STMN2", "SMAD4", "EIF6", "SF1", "CTNND2", "DBN1", "IQGAP2", "P2RX6", "ANKRD6", "C9ORF40", "ARHGEF7", "GOLGA2", "PPME1", "FAM129A", "YES1", "GLI4", "1600027N09RIK", "PTS", "PATL1", "ORAI1", "SPATS2L", "DCX", "HK2", "CSPG4", "AMBRA1", "SENP3", "THOP1", "DSG2", "PER1", "ACLY", "NR1H4", "PTPN7", "BRD2", "TAX1BP1", "RGS14", "SLC40A1", "CNN3", "PLSCR1", "PIP5K1B", "GRB14", "CTR9", "ARHGAP15", "TOM1L2", "ZNF148", "TBC1D12", "BAIAP2", "TOP2A"]




	genesStr = '\n'.join(input_genes)

	params = {'list':genesStr,'description':'','inputMethod':'enrichr_cluster'}
	datagen, headers = poster.encode.multipart_encode(params)
	url = "http://" + baseurl + "/Enrichr/enrich"
	request = urllib2.Request(url, datagen, headers)

	# wait for request 
	resp = urllib2.urlopen(request)
	
	print(resp)

	# # print(resp.read())
	# time.sleep(2)

	# alternate wait for response
	# try:
	# 	resp = urllib2.urlopen(request)
	# 	print(resp.read())
	# except IOError as e:
	# 	pass

	##################

	# x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
	# response = x.read()
	# response_dict = json.loads(response)
	# return response_dict[gmt]	


def make_request():

  # get metadata 
	import requests
	import json

	# input genes
	input_genes = ["CD2BP2", "SLBP", "FOXK2", "STMN2", "SMAD4", "EIF6", "SF1", "CTNND2", "DBN1", "IQGAP2", "P2RX6", "ANKRD6", "C9ORF40", "ARHGEF7", "GOLGA2", "PPME1", "FAM129A", "YES1", "GLI4", "1600027N09RIK", "PTS", "PATL1", "ORAI1", "SPATS2L", "DCX", "HK2", "CSPG4", "AMBRA1", "SENP3", "THOP1", "DSG2", "PER1", "ACLY", "NR1H4", "PTPN7", "BRD2", "TAX1BP1", "RGS14", "SLC40A1", "CNN3", "PLSCR1", "PIP5K1B", "GRB14", "CTR9", "ARHGAP15", "TOM1L2", "ZNF148", "TBC1D12", "BAIAP2", "TOP2A"]

	# stringify list 
	input_genes = '\n'.join(input_genes)

	# define url 
	baseurl = 'amp.pharm.mssm.edu'
	url = "http://" + baseurl + "/Enrichr/enrich"

	# define parameters 
	params = {'list':input_genes , 'description':''}

	# print('url ' + url)
	# print('params' + str(params))

	# make request: post the gene list
	enr = requests.post(url, files=params)

	print( enr )

	



	# # save json to dict 
	# meta_data = get_sig.json()

# run main
main()