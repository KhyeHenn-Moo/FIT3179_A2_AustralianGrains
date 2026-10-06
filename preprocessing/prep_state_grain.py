import geopandas as gpd
import pandas as pd
from shapely import make_valid

# 1) read SA2 boundaries (TopoJSON) and fix geometries broken by simplification
sa2 = gpd.read_file('js/sa2_2021.topojson').set_crs(4326)
sa2['geometry'] = sa2.geometry.apply(make_valid)
sa2 = sa2[sa2.STE_NAME21 != 'Other Territories']

# 2) state centroids: dissolve SA2s into states, then take the centroid in an equal-area projection (GDA94 / Australian Albers, EPSG:3577)
states = sa2.dissolve(by='STE_NAME21', as_index=False)[['STE_NAME21', 'geometry']]
cent = gpd.GeoSeries(states.to_crs(3577).geometry.centroid, crs=3577).to_crs(4326)
states['lon'] = cent.x.round(3)
states['lat'] = cent.y.round(3)

# 3) save state outlines (base layer for the map) and the centroid table
states.geometry = states.geometry.simplify(0.01)
states[['STE_NAME21', 'geometry']].to_file('js/states_2021.geojson', driver='GeoJSON')
centroids = states[['STE_NAME21', 'lon', 'lat']].rename(columns={'STE_NAME21': 'state'})

# 4) ABS state-level production rows (REGION codes 1-8), four crops
a = pd.read_csv('raw_data/ABS_data.csv')
a['REGION'] = a.REGION.astype(str)
crops = {'BroadWheat_Prod_Levy': 'Wheat', 'BroadBarley_Prod_Levy': 'Barley',
         'BroadOats_Prod_Levy': 'Oats', 'BroadSorghum_Prod_Levy': 'Sorghum'}
s = a[(a.REGION.str.len() == 1) & (a.DATAITEM.isin(crops))].copy()
s['crop'] = s.DATAITEM.map(crops)
y = s.TIME_PERIOD.str[:4].astype(int)
s['year'] = y.astype(str) + '-' + (y + 1).astype(str).str[2:]
s = s.rename(columns={'Region': 'state', 'OBS_VALUE': 'tonnes'})[['state', 'crop', 'year', 'tonnes']]

# 5) join centroids (every state must find its coordinates)
out = s.merge(centroids, on='state', how='left')
assert out.lon.notna().all(), 'A state name did not match between ABS and the TopoJSON'
out.to_csv('data/state_grain.csv', index=False)

# 6) quick checks
print(centroids.to_string(index=False))
print('rows:', len(out))
w = out[(out.crop == 'Wheat') & (out.year == '2024-25')]
print('wheat 2024-25 total tonnes:', int(w.tonnes.sum()))