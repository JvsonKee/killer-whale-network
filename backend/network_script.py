import pandas as pd

whale_df = pd.read_csv('./data/srkw.csv')

def jsonify_whales():
    nodes = whale_df.rename(columns={'whale_id': 'id'})
    json_data = nodes.to_json(orient='records')

    return json_data


def jsonify_edge_list():
    edges = create_edge_list()
    json_data = edges.to_json(orient='records')

    return json_data


def create_edge_list():
    edges = []

    for _, row in whale_df.iterrows():
        if pd.notnull(row['mother_id']):
            edges.append((row['mother_id'], row['whale_id'],))

        if pd.notnull(row['father_id']):
            edges.append((row['father_id'], row['whale_id'],))

    return pd.DataFrame(list(edges), columns=['source', 'target'])
