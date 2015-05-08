
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

    error = None 

    # get the genes from the request 
    inst_genes = request.form['genes'].split('\n')

    # get the number of enriched terms 
    num_terms = int(request.form['num_terms'])

    # convert to uppercase 
    inst_genes = [x.upper().strip() for x in inst_genes]

    # obtain unique genes 
    inst_genes = list(set(inst_genes))

    # get the gmt name
    inst_gmt = request.form['gmt_name']

    network = make_enr_clust.main(inst_gmt, inst_genes, num_terms, 'jaccard')

    # jsonify a list of dicts 
    return flask.jsonify( network )

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
 