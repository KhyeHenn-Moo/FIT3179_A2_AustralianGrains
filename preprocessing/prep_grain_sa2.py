# Run from the project root:  python cleaning/prep_grain_sa2.py
import json
import pandas as pd

# 1. Load ABS data; keep SA2 rows only (9-digit codes drop state and AUS aggregates)
a = pd.read_csv('../raw_data/ABS_data.csv')
a['REGION'] = a.REGION.astype(str)
crops = {'BroadWheat_Prod_Levy': 'Wheat', 'BroadBarley_Prod_Levy': 'Barley',
         'BroadOats_Prod_Levy': 'Oats', 'BroadSorghum_Prod_Levy': 'Sorghum'}
g = a[(a.REGION.str.len() == 9) & (a.DATAITEM.isin(crops))].copy()
g['crop'] = g.DATAITEM.map(crops)
y = g.TIME_PERIOD.str[:4].astype(int)
g['year'] = y.astype(str) + '-' + (y + 1).astype(str).str[2:]
g = g.rename(columns={'REGION': 'SA2_CODE21', 'Region': 'SA2_NAME21', 'OBS_VALUE': 'tonnes'})
g = g[['SA2_CODE21', 'SA2_NAME21', 'crop', 'year', 'tonnes']]

# 2. Get SA2 land area (km2) from the TopoJSON properties
topo = json.load(open('../js/sa2_2021.topojson'))
geoms = list(topo['objects'].values())[0]['geometries']
area = pd.DataFrame([{'SA2_CODE21': x['properties']['SA2_CODE21'],
                      'km2': x['properties']['AREASQKM21']} for x in geoms])

# 3. Join and standardise: tonnes per km2 of SA2 area
out = g.merge(area, on='SA2_CODE21', how='left')
assert out.km2.notna().all(), 'Some SA2 codes have no area in the TopoJSON'
assert (out.km2 > 0).all(), 'Zero or negative area found'
out['tonnes_per_km2'] = (out.tonnes / out.km2).round(4)

out.to_csv('../data/grain_sa2.csv', index=False)

# 4. Quick checks
print('rows:', len(out))
w = out[(out.crop == 'Wheat') & (out.year == '2024-25')]
print('wheat 2024-25 SA2s:', len(w), '| total tonnes:', int(w.tonnes.sum()))
print(w.nlargest(3, 'tonnes_per_km2')[['SA2_NAME21', 'tonnes', 'km2', 'tonnes_per_km2']])