import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    'dbname': os.getenv("DB_NAME"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'host': os.getenv("DB_HOST"),
    'port': os.getenv("DB_PORT")
}

def connect():
   return psycopg2.connect(**DB_CONFIG)


def close(conn, cur):
    cur.close()
    conn.close()


def reset_db(cur):
    # drop tables
    cur.execute("DROP TABLE IF EXISTS whale;")
    cur.execute("DROP TABLE IF EXISTS pod;")

    # create pod table
    cur.execute("""CREATE TABLE IF NOT EXISTS pod (
                    pod_id CHAR(1) PRIMARY KEY,
                    name VARCHAR(100)
                );
            """)

    # create whale table
    cur.execute("""CREATE TABLE IF NOT EXISTS whale (
                    whale_id VARCHAR(10) PRIMARY KEY,
                    name VARCHAR(100),
                    gender CHAR(10),
                    birth_year INT,
                    death_year INT NULL,
                    mother_id VARCHAR(10),
                    father_id VARCHAR(10),
                    pod_id CHAR(1),
                    FOREIGN KEY (mother_id) REFERENCES whale(whale_id),
                    FOREIGN KEY (father_id) REFERENCES whale(whale_id),
                    FOREIGN KEY (pod_id) REFERENCES pod(pod_id)
                );
            """)


def insert_pod(cur, pod):
    query = """
                INSERT INTO pod (pod_id, name) VALUES (%s, %s) ON CONFLICT (pod_id) DO NOTHING;
            """

    cur.execute(query, pod)


def insert_whale(cur, whale):
    query = """
                INSERT INTO whale (whale_id, name, gender, birth_year, death_year, mother_id, father_id, pod_id) VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (whale_id) DO NOTHING;
            """

    cur.execute(query, whale)


def update_whale(cur, whale):
    query = """ 
            UPDATE whale 
            SET gender = %s, birth_year = %s, death_year = %s, mother_id = %s, father_id = %s
            WHERE whale_id = %s;
        """

    cur.execute(query, whale)


def fetch_whales(cur):
    cur.execute("SELECT * FROM whale ORDER BY birth_year ASC;")
    return cur.fetchall()


def fetch_whale(cur, whale_id):
    query = "SELECT * FROM whale WHERE whale_id = %s;"
    cur.execute(query, (whale_id,))
    return cur.fetchone()


def fetch_whales_by_status(cur, is_alive):
    status_condition = "IS NULL" if is_alive else "IS NOT NULL"

    query = f"""
                SELECT * FROM whale WHERE death_year {status_condition};
            """
    cur.execute(query)
    return cur.fetchall()


def fetch_pods(cur):
    cur.execute("SELECT * FROM pod;")
    return cur.fetchall()


def fetch_whales_from_pod(cur, pod_id):
    query = "SELECT * FROM whale WHERE pod_id = %s ORDER BY birth_year ASC"
    cur.execute(query, (pod_id,))
    return cur.fetchall()


def fetch_pod_by_status(cur, data):
    status_condition = "IS NULL" if data['status'] else "IS NOT NULL"

    query = f"""
                SELECT * FROM whale WHERE pod_id = %s and death_year {status_condition};
            """

    cur.execute(query, data['pod_id'])
    return cur.fetchall()


def fetch_pod_pair_all(cur, data):
    query = """
                SELECT * 
                FROM whale
                WHERE pod_id IN (%s, %s);
            """
    cur.execute(query, (data['f_pod_id'], data['s_pod_id']))
    return cur.fetchall()


def fetch_pod_pair_by_status(cur, data):
    status_condition = "IS NULL" if data['status'] else "IS NOT NULL"

    query = f"""
                SELECT * 
                FROM whale
                WHERE pod_id IN (%s, %s)
                    AND death_year {status_condition};
            """
    cur.execute(query, (data['f_pod_id'], data['s_pod_id']))
    return cur.fetchall()


def fetch_mothers(cur):
    query =  """
                SELECT *
                FROM whale 
                WHERE whale_id IN (
                    SELECT DISTINCT mother_id 
                    FROM whale 
                    WHERE mother_id IS NOT NULL
                );
            """
    cur.execute(query)
    return cur.fetchall()


def fetch_all_parents(cur):
    query = """
                SELECT * 
                FROM whale w
                WHERE EXISTS (
                    SELECT 1 
                    FROM whale 
                    WHERE mother_id = w.whale_id OR father_id = w.whale_id
                );
            """

    cur.execute(query)
    return cur.fetchall()


def fetch_ancestors(cur, whale_id):
    query = """
                WITH RECURSIVE Ancestors AS (
                    SELECT whale_id, mother_id, father_id
                    FROM whale 
                    WHERE whale_id = %s

                    UNION ALL

                    SELECT w.whale_id, w.mother_id, w.father_id
                    FROM whale w
                    INNER JOIN Ancestors a ON w.whale_id = a.mother_id OR w.whale_id = a.father_id
                )
                SELECT * FROM Ancestors;
            """
    cur.execute(query, (whale_id,))
    return cur.fetchall()


def fetch_parent_pairs(cur):
    query = """
                SELECT mother_id, father_id
                FROM whale 
                WHERE mother_id IS NOT NULL and father_id IS NOT NULL;
            """

    cur.execute(query)
    return cur.fetchall()


def fetch_children(cur, parent_id):
    query = """
                SELECT *
                FROM whale 
                WHERE %s IN (mother_id, father_id);
            """

    cur.execute(query, (parent_id,))
    return cur.fetchall()


def fetch_decendants(cur, whale_id):
    query = """
                WITH RECURSIVE Descendants AS (
                    SELECT whale_id, mother_id, father_id 
                    FROM whale
                    WHERE whale_id = %s

                    UNION ALL

                    SELECT w.whale_id, w.mother_id, w.father_id
                    FROM whale w
                    INNER JOIN Descendants d ON w.mother_id = d.whale_id OR w.father_id = d.whale_id
                )
                SELECT * FROM Descendants;
            """
    cur.execute(query, (whale_id,))
    return cur.fetchall()


def fetch_all_edges(cur):
    query = """
                SELECT mother_id AS source, whale_id AS target
                FROM whale 
                WHERE mother_id IS NOT NULL

                UNION ALL

                SELECT father_id AS source, whale_id AS target
                FROM whale
                WHERE father_id IS NOT NULL;
            """

    cur.execute(query)
    return cur.fetchall()

def fetch_edges_by_status(cur, is_alive):
    status_condition = "IS NULL" if is_alive else "IS NOT NULL"

    query = f"""
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.death_year {status_condition}
                  AND mother.death_year {status_condition}

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.death_year {status_condition}
                  AND father.death_year {status_condition};
            """

    cur.execute(query)
    return cur.fetchall()

def fetch_living_edges(cur):
    query = """
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.death_year IS NULL
                  AND mother.death_year IS NULL

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.death_year IS NULL
                  AND father.death_year IS NULL;
            """

    cur.execute(query)
    return cur.fetchall()

def fetch_deceased_edges(cur):
    query = """
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.death_year IS NOT NULL
                  AND mother.death_year IS NOT NULL

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.death_year IS NOT NULL
                  AND father.death_year IS NOT NULL;
            """

    cur.execute(query)
    return cur.fetchall()

def fetch_pod_edges(cur, pod_id):
    query = """
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.pod_id = %s AND mother.pod_id = %s

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.pod_id = %s AND father.pod_id = %s;
            """

    cur.execute(query, (pod_id, pod_id, pod_id, pod_id))
    return cur.fetchall()

def fetch_pod_edges_by_status(cur, data):
    status_condition = "IS NULL" if data['status'] else "IS NOT NULL"
    query = f"""
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.pod_id = %s
                    AND mother.pod_id = %s
                    AND mother.death_year {status_condition}
                    AND m.death_year {status_condition}

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.pod_id = %s
                    AND father.pod_id = %s
                    AND father.death_year {status_condition}
                    AND f.death_year {status_condition};
            """

    pod_id = data['pod_id']
    cur.execute(query, (pod_id, pod_id, pod_id, pod_id))
    return cur.fetchall()

def fetch_deceased_pod_edges(cur, pod_id):
    query = """
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.pod_id = %s
                    AND mother.pod_id = %s
                    AND mother.death_year IS NOT NULL
                    AND m.death_year IS NOT NULL

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.pod_id = %s
                    AND father.pod_id = %s
                    AND father.death_year IS NOT NULL
                    AND f.death_year IS NOT NULL;
            """
    cur.execute(query, (pod_id, pod_id, pod_id, pod_id))
    return cur.fetchall()

def fetch_pod_pair_edges_by_status(cur, data):
    status_condition = "IS NULL" if data['status'] else "IS NOT NULL"

    query = f"""
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.pod_id IN (%s, %s)
                  AND mother.pod_id IN (%s, %s)
                  AND m.death_year {status_condition}
                  AND mother.death_year {status_condition}

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.pod_id IN (%s, %s)
                  AND father.pod_id IN (%s, %s)
                  AND f.death_year {status_condition}
                  AND father.death_year {status_condition};
            """
    f_pod = data['f_pod_id']
    s_pod = data['s_pod_id']

    cur.execute(query, (f_pod, s_pod, f_pod, s_pod, f_pod, s_pod, f_pod, s_pod))
    return cur.fetchall()

def fetch_pod_pair_edges_all(cur, data):
    query = """
                SELECT m.mother_id AS source, m.whale_id AS target
                FROM whale m
                JOIN whale mother ON m.mother_id = mother.whale_id
                WHERE m.pod_id IN (%s, %s)
                  AND mother.pod_id IN (%s, %s)

                UNION ALL

                SELECT f.father_id AS source, f.whale_id AS target
                FROM whale f
                JOIN whale father ON f.father_id = father.whale_id
                WHERE f.pod_id IN (%s, %s)
                  AND father.pod_id IN (%s, %s);
            """
    f_pod = data['f_pod_id']
    s_pod = data['s_pod_id']

    cur.execute(query, (f_pod, s_pod, f_pod, s_pod, f_pod, s_pod, f_pod, s_pod))
    return cur.fetchall()
