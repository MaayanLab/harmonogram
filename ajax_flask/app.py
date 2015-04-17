from flask import Flask
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
# from pymongo import Connection
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

# try to make post request to make_project_json
################################################
# this can be changed to clustergram_flask
@app.route('/', methods=['GET','POST'])
def python_function():
    import flask 
    import make_enr_clust
    import json 
    import json_scripts 
    import sys

    error = None 

    # print('within flask request function')

    # get the genes from the request 
    inst_genes = request.form['genes'].split('\n')

    # convert to uppercase 
    inst_genes = [x.upper().strip() for x in inst_genes]

    # obtain unique genes 
    inst_genes = list(set(inst_genes))
    # calculate enrichment 
    num_terms = 30
    # print(inst_genes)


    network = make_enr_clust.main(inst_genes, num_terms, 'jaccard')

    # print(network)

    # jsonify a dict     
    ########################
    # # jsonify a list of dicts 
    # return flask.jsonify( items = network )
    return flask.jsonify( network )

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)

 
# APPLICATION_ROOT = '/spam'

# if __name__ == '__main__':
#     # Relevant documents:
#     # http://werkzeug.pocoo.org/docs/middlewares/
#     # http://flask.pocoo.org/docs/patterns/appdispatch/
#     from werkzeug.serving import run_simple
#     from werkzeug.wsgi import DispatcherMiddleware
#     app.config['DEBUG'] = True
#     # Load a dummy app at the root URL to give 404 errors.
#     # Serve app at APPLICATION_ROOT for localhost development.
#     application = DispatcherMiddleware(Flask('dummy_app'), {
#         app.config['APPLICATION_ROOT']: app,
#     })
#     run_simple('localhost', 5000, application, use_reloader=True)