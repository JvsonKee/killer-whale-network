import pandas as pd

whale_df = pd.read_csv('./data/srkw.csv')

edges = []

for _, row in whale_df.iterrows():
    if pd.notnull(row['mother_id']):
        edges.append((row['mother_id'], row['whale_id'],))

    if pd.notnull(row['father_id']):
        edges.append((row['father_id'], row['whale_id'],))

edges_df = pd.DataFrame(list(edges), columns=['Source', 'Target'])

edges_df.to_csv('./data/edge_list.csv', index=False)

whale_df = whale_df.rename(columns={'whale_id': 'Id', 'name': 'Label'})

whale_df.to_csv('./data/srkw_g.csv', index=False)
