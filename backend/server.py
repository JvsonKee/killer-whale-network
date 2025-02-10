import database as db
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# route to get all pods
@app.route('/pods', methods=['GET'])
def get_pods():
    conn = db.connect()
    cur = conn.cursor()

    pods = db.fetch_pods(cur)

    db.close(conn, cur)

    pod_list = [{
        'pod_id': pod[0],
        'name': pod[1]
    } for pod in pods]

    return jsonify(pod_list)


# route to get all the whales
@app.route('/whales', methods=['GET'])
def get_whales():
    conn = db.connect()
    cur = conn.cursor()

    whales = db.fetch_whales(cur)

    db.close(conn, cur)

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
    app.run(debug=True)