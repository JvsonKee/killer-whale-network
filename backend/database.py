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
    cur.execute("SELECT * FROM whale;")
    return cur.fetchall()

def fetch_whale(cur, whale_id):
    query = "SELECT * FROM whale WHERE whale_id = %s;"
    cur.execute(query, (whale_id,))
    return cur.fetchone()


def fetch_pods(cur):
    cur.execute("SELECT * FROM pod;")
    return cur.fetchall()

def fetch_whales_from_pod(cur, pod_id):
    query = "SELECT * FROM whale WHERE pod_id = %s;"
    cur.execute(query, (pod_id,))
    return cur.fetchall()

def fetch_living(cur):
    cur.execute("SELECT * FROM whale WHERE death_year IS NULL;")
    return cur.fetchall()

def fetch_deceased(cur):
    cur.execute("SELECT * FROM whale WHERE death_year IS NOT NULL;")
    return cur.fetchall()

def fetch_living_from_pod(cur, pod_id):
    query = """
                SELECT * 
                FROM whale 
                WHERE death_year IS NULL AND pod_id = %s;
            """
    
    cur.execute(query, (pod_id,))
    return cur.fetchall()

def fetch_deceased_from_pod(cur, pod_id):
    query = """
                SELECT * 
                FROM whale 
                WHERE death_year IS NOT NULL AND pod_id = %s;
            """
    
    cur.execute(query, (pod_id,))
    return cur.fetchall()

def fetch_children(cur, parent_id):
    query = """
                SELECT *
                FROM whale 
                WHERE %s IN (mother_id, father_id);
            """
    
    cur.execute(query, (parent_id,))
    return cur.fetchall()