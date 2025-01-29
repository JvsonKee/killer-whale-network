import psycopg2

DB_CONFIG = {
    'dbname': 'killer-whale-db',
    'user': 'postgres',
    'password': 'koda',
    'host': 'localhost',
    'port': '5432'
}

def connect():
    return psycopg2.connect(**DB_CONFIG)

conn = connect()
print('Connected to the database')
cur =  conn.cursor()

cur.execute("""CREATE TABLE IF NOT EXISTS whale (
    whale_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    gender CHAR(1),
    birth_year INT,
    death_year INT NULL
);
""")

cur.execute("""CREATE TABLE IF NOT EXISTS parent_of (
    relationship_id SERIAL PRIMARY KEY,
    parent_id VARCHAR(10) REFERENCES whale(whale_id) ON DELETE CASCADE,
    child_id VARCHAR(10) REFERENCES whale(whale_id) ON DELETE CASCADE,
    UNIQUE (parent_id, child_id)
);
""")

def insert_whale(whale):
    conn = connect()
    cur = conn.cursor()

    query = """
        INSERT INTO whale (whale_id, name, gender, birth_year, death_year) VALUES
        (%s, %s, %s, %s, %s) ON CONFLICT (whale_id) DO NOTHING;
    """

    cur.execute(query, whale)
    conn.commit()
    cur.close()
    conn.close()

conn.commit()
cur.close()
conn.close()