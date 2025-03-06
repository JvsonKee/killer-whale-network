import database as db
import network_script as ns
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# gets all pods
@app.route('/pods', methods=['GET'])
def get_pods():
    pods = fetch_process(db.fetch_pods)

    if not pods:
        return jsonify({"error": "No pods founds"}), 404

    pod_list = [{
        'pod_id': pod[0],
        'name': pod[1]
    } for pod in pods]

    return jsonify(pod_list)


# gets all whales
@app.route('/whales', methods=['GET'])
def get_whales():
    whales = fetch_process(db.fetch_whales)
    return jsonify_whales(whales)


# get individual whale
@app.route('/whales/<whale_id>', methods=['GET'])
def get_whale(whale_id):
    whale = fetch_process(db.fetch_whale, whale_id)

    if not whale:
        return jsonify({"error": f"No whale found with id: {whale_id}"}), 404
    
    whale = {
        'whale_id': whale[0],
        'name': whale[1],
        'gender': whale[2].strip(),
        'birth_year': whale[3],
        'death_year': whale[4],
        'mother_id': whale[5],
        'father_id': whale[6],
        'pod_id': whale[7],
    }
    return jsonify(whale)


# gets all living whales
@app.route('/whales/living', methods=['GET'])
def get_living_whales():
    whales = fetch_process(db.fetch_living)
    return jsonify_whales(whales)


# gets all deceased whales
@app.route('/whales/deceased', methods=['GET'])
def get_deceased_whales():
    whales = fetch_process(db.fetch_deceased)
    return jsonify_whales(whales)


# gets whales from a certain pod
@app.route('/whales/pod/<pod_id>', methods=['GET'])
def get_whales_from_pod(pod_id):
    whales = fetch_process(db.fetch_whales_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all living whales from a pod
@app.route('/whales/living/pod/<pod_id>', methods=['GET'])
def get_living_from_pod(pod_id):
    whales = fetch_process(db.fetch_living_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all deceased whales from a pod
@app.route('/whales/deceased/pod/<pod_id>', methods=['GET'])
def get_deceased_from_pod(pod_id):
    whales = fetch_process(db.fetch_deceased_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all parents
@app.route('/whales/parents', methods=['GET'])
def get_parents():
    whales = fetch_process(db.fetch_parents)
    return jsonify_whales(whales)


@app.route('/whales/mothers', methods=['GET'])
def get_mother():
    mothers = fetch_process(db.fetch_mothers)
    return jsonify_whales(mothers)


# gets all children of parent
@app.route('/whales/<parent_id>/children', methods=['GET'])
def get_children(parent_id):
    whales = fetch_process(db.fetch_children, parent_id)
    return jsonify_whales(whales)

# get all whale nodes
@app.route('/network-nodes', methods=['GET'])
def get_network_nodes():
    nodes = ns.jsonify_whales()
    return nodes

# get all edges
@app.route('/network-edges', methods=['GET'])
def get_network_edges():
    edges = ns.jsonify_edge_list()
    return edges


# helper function to streamline fetch process
def fetch_process(func, arg=None):
    conn = db.connect()
    cur = conn.cursor()

    result = func(cur) if arg is None else func(cur, arg)

    db.close(conn, cur)

    if not result:
        return None

    return result


# helper function to jsonify whale array
def jsonify_whales(response):

    if response is None:
        return jsonify({"error": "No items found."}), 404

    whale_list = [{
        'whale_id': whale[0],
        'name': whale[1],
        'gender': whale[2].strip(),
        'birth_year': whale[3],
        'death_year': whale[4],
        'mother_id': whale[5],
        'father_id': whale[6],
        'pod_id': whale[7],
    } for whale in response]

    return jsonify(whale_list)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
