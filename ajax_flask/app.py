
from flask import Flask
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
import json
import sys
import logging
from logging.handlers import RotatingFileHandler

# # change routing of logs when running docker 
# logging.basicConfig(stream=sys.stderr) 

app = Flask(__name__)

@app.route("/")
def index():
    print('Rendering index template')
    return render_template("index.html")

# post request
@app.route('/', methods=['GET','POST'])
def python_function():
    import flask 
    import make_enr_clust
    import json 
    import json_scripts 
    import sys
    import cookielib, poster, urllib2, json

    error = None 

    # # make a post request to enrichr 
    # # 
    # global baseurl
    # baseurl = 'amp.pharm.mssm.edu'

    # # genes_string = request.form['genes']
    # # print(genes_string)
    # genes_string = 'DCX\nEIF6'
    # meta = ''

    # # make post request
    # params = {'list':genes_string,'description':meta}
    # datagen, headers = poster.encode.multipart_encode(params)
    # url = "http://" + baseurl + "/Enrichr/enrich"
    # request = urllib2.Request(url, datagen, headers)
    # urllib2.urlopen(request)

    # # x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
    # # response = x.read()
    # # response_dict = json.loads(response)
    # # print(response_dict)
    # # return response_dict[gmt]


    # get the genes from the request 
    inst_genes = request.form['genes'].split('\n')

    enrichr_result(inst_genes, '', 'GO_Biological_Process')

    # get the number of enriched terms 
    num_terms = int(request.form['num_terms'])

    # convert to uppercase 
    inst_genes = [x.upper().strip() for x in inst_genes]

    # obtain unique genes 
    inst_genes = list(set(inst_genes))

    # get the gmt name
    gmt_name = request.form['gmt_name']

    network = make_enr_clust.main(gmt_name, inst_genes, num_terms, 'jaccard')

    # jsonify a list of dicts 
    return flask.jsonify( network )



def enrichr_result(genes, meta='', gmt=''):
    import cookielib, poster, urllib2, json

    global baseurl
    baseurl = 'amp.pharm.mssm.edu'

    """return the enrichment results for a specific gene-set library on Enrichr"""
    cj = cookielib.CookieJar()
    opener = poster.streaminghttp.register_openers()
    opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
    genesStr = '\n'.join(genes)

    params = {'list':genesStr,'description':meta}
    datagen, headers = poster.encode.multipart_encode(params)
    url = "http://" + baseurl + "/Enrichr/enrich"
    request = urllib2.Request(url, datagen, headers)
    urllib2.urlopen(request)

    x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
    response = x.read()
    response_dict = json.loads(response)
    print(response_dict.keys())
    return response_dict[gmt]




if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
 