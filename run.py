from flask import Flask, jsonify, request
from werkzeug import SharedDataMiddleware
import os
 
PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
 
app = Flask(__name__,
            static_folder=os.path.join(PROJECT_ROOT, 'public'),
            static_url_path='/public')

experimentdata = {}

def merge(master, update):
    if not master:
        return update
    for name, value in update.items():
        if name in master:
            if type(update[name])=="list":
                for i in range(0, len(update[name])):
                    update_node = update[name][i]
                    if type(update_node)=="dict":
                        master_node = [item for item in master[name] if item.id==update_node.id]
                        if master_node:
                            master_node = merge(master_node[0], update_node)
                        else:
                            master[name].append(update_node)
                    else:
                        master[name].append(update_node)
            if type(update[name])=="dict":
                master[name] = merge(master[name], update[name])
            else:
                master[name] = update[name]
        else:
            master[name] = update[name]
    return master

@app.route("/api/experimentdatahandlers", methods=["GET"])
def experiment_data_get_coll():
    return jsonify(experimentdata.values())

@app.route("/api/experimentdatahandlers/<id>", methods=["GET"])
def experiment_data_get(id=None):
    if id:
        return jsonify(experimentdata[id])
    else:
        abort(400)

@app.route("/api/experimentdatahandlers", methods=["PUT", "POST"])
def experiment_data_put_coll():
    data = request.get_json()
    data["id"] = str(len(experimentdata))
    experimentdata[data["id"]] = data
    return jsonify(data)

@app.route("/api/experimentdatahandlers/<id>", methods=["PUT", "POST"])
def experiment_data_put_item(id=None):
    if id:
        experimentdata[id] = request.get_json()
        return jsonify(experimentdata[id])
    else:
        abort(400)

@app.route("/api/experimentdatahandlers/<id>", methods=["PATCH"])
def experiment_data_patch(id=None):
    if id:
        diff = request.get_json()
        try:
            experimentdata[id] = merge(experimentdata[id], diff)
        except Exception as e:
            import pdb; pdb.set_trace()
        return jsonify(experimentdata[id])
    else:
        abort(400)

app.wsgi_app = SharedDataMiddleware(app.wsgi_app, 
    {'/': os.path.join(os.path.dirname(__file__), 'public') })

if __name__ == "__main__":
    app.debug = True
    app.run()