import pandas as pd

EXCLUDE = ['Australian Capital Territory', 'Northern Territory']   # too little grain 
CROPS = ['Wheat', 'Barley', 'Oats', 'Sorghum']

# 1) load the cleaned state-level production table
d = pd.read_csv('../data/state_grain.csv')

# 2) show what is being excluded, so the chart note can quote real numbers
ex = d[d.state.isin(EXCLUDE)]
print('Excluded states (records):')
print(ex[['state', 'crop', 'year', 'tonnes']].to_string(index=False))

d = d[~d.state.isin(EXCLUDE)]

# 3) state total per year = sum of the four recorded crops
d['state_total'] = d.groupby(['state', 'year']).tonnes.transform('sum')
d['share_pct'] = (d.tonnes / d.state_total * 100).round(2)

# 4) fill in missing state x crop x year combinations so the heatmap can draw them as grey "no record" cells (they are NOT zero)
full = pd.MultiIndex.from_product(
    [sorted(d.state.unique()), CROPS, sorted(d.year.unique())],
    names=['state', 'crop', 'year']).to_frame(index=False)
out = full.merge(d[['state', 'crop', 'year', 'tonnes', 'share_pct']],
                 on=['state', 'crop', 'year'], how='left')
out['recorded'] = out.tonnes.notna()
tot = d.drop_duplicates(['state', 'year'])[['state', 'year', 'state_total']]
out = out.merge(tot, on=['state', 'year'], how='left')
out.to_csv('../data/state_crop_share.csv', index=False)

# 5) checks
print()
print('rows:', len(out), '(expect 6 states x 4 crops x 3 years = 72)')
print('recorded cells:', int(out.recorded.sum()), '| no-record cells:', int((~out.recorded).sum()))
chk = out[out.recorded].groupby(['state', 'year']).share_pct.sum().round(1)
print('every state-year shares sum to 100:', bool((chk.sub(100).abs() < 0.1).all()))
print()
print(out[out.year == '2024-25'].pivot(index='state', columns='crop', values='share_pct')[CROPS].round(1).to_string())