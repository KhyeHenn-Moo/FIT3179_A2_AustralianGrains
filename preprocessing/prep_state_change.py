import os
import pandas as pd

EXCLUDE = ['Australian Capital Territory', 'Northern Territory']   # same exclusion as chart 3
PAIRS = [('2022-23', '2023-24'), ('2023-24', '2024-25'), ('2022-23', '2024-25')]

# 1) 4-grain total (wheat + barley + oats + sorghum) per state and year
d = pd.read_csv('../data/state_grain.csv')
d = d[~d.state.isin(EXCLUDE)]
tot = d.groupby(['state', 'year']).tonnes.sum().unstack()

# 2) change between each pair of years
rows = []
for a, b in PAIRS:
    t = pd.DataFrame({'state': tot.index, 'from_year': a, 'to_year': b,
                      'from_tonnes': tot[a].values, 'to_tonnes': tot[b].values})
    rows.append(t)
out = pd.concat(rows, ignore_index=True)
out['change_tonnes'] = out.to_tonnes - out.from_tonnes
out['change_pct'] = (out.change_tonnes / out.from_tonnes * 100).round(1)
out['period'] = out.from_year + ' to ' + out.to_year
out.to_csv('../data/state_change.csv', index=False)

# 3) checks
assert out[['from_tonnes', 'to_tonnes']].notna().all().all(), 'A state is missing a year'
print('rows:', len(out), '(expect 6 states x 3 comparisons = 18)')
if os.path.exists('../data/state_crop_share.csv'):
    s = pd.read_csv('../data/state_crop_share.csv').drop_duplicates(['state', 'year'])
    m = out.merge(s, left_on=['state', 'from_year'], right_on=['state', 'year'])
    print('matches chart 3 state totals:', bool((m.from_tonnes == m.state_total).all()))
for p in out.period.unique():
    print()
    print(p)
    q = out[out.period == p].sort_values('change_tonnes')
    print(q[['state', 'from_tonnes', 'to_tonnes', 'change_tonnes', 'change_pct']].to_string(index=False))