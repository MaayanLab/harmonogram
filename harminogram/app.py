
from flask import Flask
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
import json
import sys
import logging
from logging.handlers import RotatingFileHandler
import os
from flask import send_from_directory

# # change routing of logs when running docker 
# logging.basicConfig(stream=sys.stderr) 



# app = Flask(__name__)
app = Flask(__name__, static_url_path='')

ENTRY_POINT = '/enrichrgram'

# switch for local and docker development 
# docker_vs_local
##########################################

# for local development 
SERVER_ROOT = os.path.dirname(os.getcwd()) + '/enrichrgram/enrichrgram' ## original 

# # for docker development
# SERVER_ROOT = '/app/enrichrgram'


@app.route(ENTRY_POINT + '/<path:path>') ## original 
# @crossdomain(origin='*')
def send_static(path):

  # print('path and SERVER_ROOT')
  # print(path)
  # print(SERVER_ROOT)
  
  return send_from_directory(SERVER_ROOT, path)


@app.route("/enrichrgram/")
def index():
  print('Rendering index template')
  return render_template("index.html")

# post request
@app.route('/enrichrgram/', methods=['GET','POST'])
def python_function():
  import flask 
  import make_enr_clust
  import json 
  import json_scripts 
  import sys
  import cookielib, poster, urllib2, json

  error = None 

  # get gmt_colors
  gmt_colors = json.loads(request.form['gmt_colors'])

  # get the number of enriched terms 
  num_terms = int(request.form['num_terms'])

  # get the genes from the request 
  inst_genes = request.form['genes'].strip().split('\n')

  # convert to uppercase 
  inst_genes = [x.upper().strip() for x in inst_genes]

  # obtain unique genes 
  inst_genes = list(set(inst_genes))

  # calc enrichment and cluster 
  network = make_enr_clust.main(gmt_colors, inst_genes, num_terms, 'jaccard')

  # jsonify a list of dicts 
  return flask.jsonify( network )


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
 