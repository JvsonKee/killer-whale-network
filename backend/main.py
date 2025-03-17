import database as db

conn = db.connect()
cur = conn.cursor()

whales = db.fetch_whales(cur)
mothers = db.fetch_mothers(cur)
# pairs = db.fetch_parent_pairs(cur)


def parseParents(whale):
    mother = db.fetch_whale(cur, whale[5])
    father = db.fetch_whale(cur, whale[6])

    if mother is None and father is None:
        return

    if mother is not None:
        parseParents(mother)
        print("|")
        print("V")
        print(f"{mother[0]} {mother[1]}")

    if father is not None:
        parseParents(father)
        print("|")
        print("V")
        print(f"{father[0]} {father[1]}")


def parseChildren(whale_id, depth):
    children = db.fetch_children(cur, whale_id)

    if len(children) == 0:
        return

    for child in children:
        print(f"{"   " * depth} {child[0]} {child[1]} {child[4]}")
        parseChildren(child[0], depth + 1)


def parseMatriline():
    for mother in mothers:
        print(mother[0], mother[1], mother[4])
        parseChildren(mother[0], 0)
        print()


def parseFamily():
    for whale in whales:
        print(whale[0], whale[1], whale[4])
        parseChildren(whale[0], 0)
        print()


for whale in whales:
    parseParents(whale)
    print("|")
    print("V")
    print(whale[0])
    print()


# for whale in whales:
#     depth = 0

#     ancestors = db.fetch_ancestors(cur, whale[0])

#     for ancestor in reversed(ancestors):
#         mother = ancestor[1]
#         father = ancestor[2]
#         child = ancestor[0]

#         if father is None and mother is not None:
#             print(f'{"  " * depth} {mother}:m --> {child}')
#         elif father is not None and mother is None:
#             print(f'{"  " * depth} {father}:f --> {child}')
#         else:
#             print(f'{"  " * depth} {mother}:m -- {father}:f --> {child}')

#         depth +=  1

#     print()
#     print(f'{"  " * depth}{whale[0]} {whale[1]}')
#     print()

#     decendants = db.fetch_decendants(cur, whale[0])

#     for descendant in decendants:
#         mother = descendant[1]
#         father = descendant[2]
#         child = descendant[0]

#         if father is None and mother is not None:
#             print(f'{"  " * depth} {mother}:m --> {child}')
#         elif father is not None and mother is None:
#             print(f'{"  " * depth} {father}:f --> {child}')
#         else:
#             print(f'{"  " * depth} {mother}:m -- {father}:f --> {child}')

#         depth += 1

#     print()

# parseFamily()
# parseMatriline()

cur.close()
conn.close()
