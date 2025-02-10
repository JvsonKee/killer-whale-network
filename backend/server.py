import database as db
from flask import Flask, jsonify
from flask_cors import CORS
from psycopg2.extras import DictCursor


app = Flask(__name__)
CORS(app)

# route to get all the whales
@app.route('/whales', methods=['GET'])
def get_whales():
    conn = db.connect()
    cur = conn.cursor(cursor_factory=DictCursor)

    whales = db.fetch_whales(cur)

    db.close(conn, cur)

    whale_list = [{
        'whale_id': whale[0],
        'name': whale[1],
        'gender': whale[2],
        'birth_year': whale[3],
        'death_year': whale[4],
        'father_id': whale[5],
        'pod_id': whale[6]
    } for whale in whales]

    return jsonify(whale_list)


if __name__ == '__main__':
    app.run(debug=True)