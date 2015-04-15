from flask import Flask
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
# from pymongo import Connection
import json
import sys
import logging

# change routing of logs when running docker 
logging.basicConfig(stream=sys.stderr)  

app = Flask(__name__)

@app.route("/")
def index():
    
    return render_template("index.html")

# try to make post request to make_project_json
################################################
# /home/nick/anaconda/bin/python
@app.route('/', methods=['GET','POST'])
def python_function():
    import flask 
    import make_enr_clust
    import json 
    import json_scripts 
    import sys

    error = None 

    # get the genes from the request 
    inst_genes = request.form['genes'].split('\n')

    # convert to uppercase 
    inst_genes = [x.upper().strip() for x in inst_genes]

    # obtain unique genes 
    inst_genes = list(set(inst_genes))
    # calculate enrichment 
    num_terms = 30
    network = make_enr_clust.main(inst_genes, num_terms, 'jaccard')

    # jsonify a dict     
    ########################
    # # jsonify a list of dicts 
    # return flask.jsonify( items = network )
    return flask.jsonify( network )

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=False)
