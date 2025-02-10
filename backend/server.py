import database as db
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# gets all pods
@app.route('/pods', methods=['GET'])
def get_pods():
    pods = fetch_process(db.fetch_pods)

    pod_list = [{
        'pod_id': pod[0],
        'name': pod[1]
    } for pod in pods]

    return jsonify(pod_list)


# gets whales from a certain pod
@app.route('/whales/<pod_id>', methods={'GET'})
def get_whales_from_pod(pod_id):
    whales = fetch_process(db.fetch_whales_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all whales
@app.route('/whales', methods=['GET'])
def get_whales():
    whales = fetch_process(db.fetch_whales)
    return jsonify_whales(whales)


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


# gets all living whales from a pod
@app.route('/whales/living/<pod_id>', methods=['GET'])
def get_living_from_pod(pod_id):
    whales = fetch_process(db.fetch_living_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all deceased whales from a pod
@app.route('/whales/deceased/<pod_id>', methods=['GET'])
def get_deceased_from_pod(pod_id):
    whales = fetch_process(db.fetch_deceased_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# gets all children of parent
@app.route('/<parent_id>/children', methods=['GET'])
def get_children(parent_id):
    whales = fetch_process(db.fetch_children, parent_id)
    return jsonify_whales(whales)



# helper function to streamline fetch process
def fetch_process(func, arg=None):
    conn = db.connect()
    cur = conn.cursor()

    items = func(cur) if arg is None else func(cur, arg)

    db.close(conn, cur)

    return items


# helper function to jsonify whale array
def jsonify_whales(whales):
    whale_list = [{
        'whale_id': whale[0],
        'name': whale[1],
        'gender': whale[2].strip(),
        'birth_year': whale[3],
        'death_year': whale[4],
        'mother_id': whale[5],
        'father_id': whale[6],
        'pod_id': whale[7],
    } for whale in whales]

    return jsonify(whale_list)


if __name__ == '__main__':
    app.run(debug=True, port=5001)