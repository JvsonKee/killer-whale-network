import database as db
import network_script as ns
from flask import Flask, jsonify
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error"}), 500


@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({"error": "Bad request"}), 400


# gets all pods
@app.route("/pods", methods=["GET"])
def get_pods():
    pods = fetch_process(db.fetch_pods)

    if not pods:
        return jsonify({"error": "No pods founds"}), 404

    pod_list = [{"pod_id": pod[0], "name": pod[1]} for pod in pods]

    return jsonify(pod_list)


# gets all whales
@app.route("/whales", methods=["GET"])
def get_whales():
    whales = fetch_process(db.fetch_whales)
    return jsonify_whales(whales)


# get individual whale
@app.route("/whales/<whale_id>", methods=["GET"])
def get_whale(whale_id):
    whale = fetch_process(db.fetch_whale, whale_id)

    if not whale:
        return jsonify({"error": f"No whale found with id: {whale_id}"}), 404

    whale = {
        "whale_id": whale[0],
        "name": whale[1],
        "gender": whale[2].strip(),
        "birth_year": whale[3],
        "death_year": whale[4],
        "mother_id": whale[5],
        "father_id": whale[6],
        "pod_id": whale[7],
    }
    return jsonify(whale)


# gets all living whales
@app.route("/whales/living", methods=["GET"])
def get_living_whales():
    whales = fetch_process(db.fetch_whales_by_status, True)
    return jsonify_whales(whales)


# gets all deceased whales
@app.route("/whales/deceased", methods=["GET"])
def get_deceased_whales():
    whales = fetch_process(db.fetch_whales_by_status, False)
    return jsonify_whales(whales)


# gets whales from a certain pod
@app.route("/whales/pod/<pod_id>", methods=["GET"])
def get_whales_from_pod(pod_id):
    whales = fetch_process(db.fetch_whales_from_pod, pod_id.upper())
    return jsonify_whales(whales)


# get whales from a pod pairing
@app.route("/whales/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_pod_pair_all(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper()}
    whales = fetch_process(db.fetch_pod_pair_all, args)
    return jsonify_whales(whales)


# get alive whales from a pod pairing
@app.route("/whales/living/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_pod_pair_alive(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper(), "status": True}
    whales = fetch_process(db.fetch_pod_pair_by_status, args)
    return jsonify_whales(whales)


# get deceased whales from a pod pairing
@app.route("/whales/deceased/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_pod_pair_deceased(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper(), "status": False}
    whales = fetch_process(db.fetch_pod_pair_by_status, args)
    return jsonify_whales(whales)


# gets all living whales from a pod
@app.route("/whales/living/pod/<pod_id>", methods=["GET"])
def get_living_from_pod(pod_id):
    args = {"pod_id": pod_id.upper(), "status": True}
    whales = fetch_process(db.fetch_pod_by_status, args)
    return jsonify_whales(whales)


# gets all deceased whales from a pod
@app.route("/whales/deceased/pod/<pod_id>", methods=["GET"])
def get_deceased_from_pod(pod_id):
    args = {"pod_id": pod_id.upper(), "status": False}
    whales = fetch_process(db.fetch_pod_by_status, args)
    return jsonify_whales(whales)


# gets family members of a given whale
@app.route("/whales/family/<whale_id>", methods=["GET"])
def get_family_of(whale_id):
    whales = fetch_process(db.fetch_family_of, whale_id)
    return jsonify_whales_tree(whales)


# gets direct family member of a specific whale
@app.route("/whales/<whale_id>/family", methods=["GET"])
def get_direct_family_of(whale_id):
    whales = fetch_process(db.fetch_direct_family_of, whale_id)
    return jsonify_whales(whales)


# gets all parents
@app.route("/whales/parents", methods=["GET"])
def get_parents():
    whales = fetch_process(db.fetch_parents)
    return jsonify_whales(whales)


@app.route("/whales/mothers", methods=["GET"])
def get_mother():
    mothers = fetch_process(db.fetch_mothers)
    return jsonify_whales(mothers)


# gets all children of parent
@app.route("/whales/<parent_id>/children", methods=["GET"])
def get_children(parent_id):
    whales = fetch_process(db.fetch_children, parent_id)
    return jsonify_whales(whales)


# get all whale nodes
@app.route("/network-nodes", methods=["GET"])
def get_network_nodes():
    nodes = ns.jsonify_whales()
    return nodes


# get all edges
@app.route("/network/edges", methods=["GET"])
def get_network_edges():
    edges = fetch_process(db.fetch_all_edges)
    return jsonify_edges(edges)


# get all living edges
@app.route("/network/edges/living", methods=["GET"])
def get_network_living_edges():
    edges = fetch_process(db.fetch_edges_by_status, True)
    return jsonify_edges(edges)


# get all deceased edges
@app.route("/network/edges/deceased", methods=["GET"])
def get_network_deceased_edges():
    edges = fetch_process(db.fetch_edges_by_status, False)
    return jsonify_edges(edges)


# fetch edges for specific pod
@app.route("/network/edges/pod/<pod_id>", methods=["GET"])
def get_network_pod_edges(pod_id):
    edges = fetch_process(db.fetch_pod_edges, pod_id.upper())
    return jsonify_edges(edges)


# fetch living pod edges
@app.route("/network/edges/living/pod/<pod_id>", methods=["GET"])
def get_network_living_pod_edges(pod_id):
    args = {"pod_id": pod_id.upper(), "status": True}
    edges = fetch_process(db.fetch_pod_edges_by_status, args)
    return jsonify_edges(edges)


# fetch deceased pod edges
@app.route("/network/edges/deceased/pod/<pod_id>", methods=["GET"])
def get_network_deceased_pod_edges(pod_id):
    args = {"pod_id": pod_id.upper(), "status": False}
    edges = fetch_process(db.fetch_pod_edges_by_status, args)
    return jsonify_edges(edges)


# fetch all edges for a pod pairing
@app.route("/network/edges/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_pod_pair_edges(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper()}
    edges = fetch_process(db.fetch_pod_pair_edges_all, args)
    return jsonify_edges(edges)


# fetch edges for living pod pairing
@app.route("/network/edges/living/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_living_pod_pair_edges(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper(), "status": True}
    edges = fetch_process(db.fetch_pod_pair_edges_by_status, args)
    return jsonify_edges(edges)


# fetch edges for deceased pod pairing
@app.route("/network/edges/deceased/pod/<f_pod_id>/<s_pod_id>", methods=["GET"])
def get_deceased_pod_pair_edges(f_pod_id, s_pod_id):
    args = {"f_pod_id": f_pod_id.upper(), "s_pod_id": s_pod_id.upper(), "status": False}
    edges = fetch_process(db.fetch_pod_pair_edges_by_status, args)
    return jsonify_edges(edges)


# fetch edges for the family of a given whale
@app.route("/whales/<whale_id>/family-edges", methods=["GET"])
def get_family_edges(whale_id):
    edges = fetch_process(db.fetch_family_edges, whale_id)
    return jsonify_edges(edges)


# helper function to streamline fetch process
def fetch_process(func, arg=None):
    try:
        conn = db.connect()
        cur = conn.cursor()

        result = func(cur) if arg is None else func(cur, arg)

        if not result:
            return None

    except Exception as e:
        traceback.print_exc()
        raise e

    finally:
        db.release_connection(conn, cur)

        return result


# helper function to jsonify whale array
def jsonify_whales(response):
    if response is None:
        return jsonify({"error": "No items found."}), 404

    whale_list = [
        {
            "whale_id": whale[0],
            "name": whale[1],
            "gender": whale[2].strip(),
            "birth_year": whale[3],
            "death_year": whale[4],
            "mother_id": whale[5],
            "father_id": whale[6],
            "pod_id": whale[7],
        }
        for whale in response
    ]

    return jsonify(whale_list)


# helper function to jsonify whale array in tree form
def jsonify_whales_tree(response):
    if response is None:
        return jsonify({"error": "No items found."}), 404

    whale_list = [
        {
            "whale_id": whale[0],
            "name": whale[1],
            "gender": whale[2].strip(),
            "death_year": whale[3],
            "pod_id": whale[4],
            "parent": whale[5],
        }
        for whale in response
    ]

    return jsonify(whale_list)


# helper function to jsonify edges array
def jsonify_edges(response):
    if response is None:
        return jsonify({"error": "No items found."}), 404

    edge_list = [{"source": edges[0], "target": edges[1]} for edges in response]

    return jsonify(edge_list)


def handle_exception(e):
    traceback.print_exc()

    return jsonify({"error": "Something went wrong", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
