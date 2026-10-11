import pandas as pd

# 1) load the yearly yields (tonnes per hectare) for each crop
hist = pd.read_csv("../data/production_history.csv").sort_values(["crop", "year"])

# 2) work out the % change in yield from the previous year (the first year, 1961, has no previous year)
hist["prev_yield_t_ha"] = hist.groupby("crop")["yield_t_ha"].shift(1)
hist["change_pct"] = ((hist["yield_t_ha"] / hist["prev_yield_t_ha"] - 1) * 100).round(1)
chg = hist.dropna(subset=["change_pct"]).copy()
chg["year"] = chg["year"].astype(int)

# 3) pick the three points to label on the chart: the 2002 drought crash and 2003 rebound in wheat, and barley's 2003 rebound
picks = [("Wheat", 2002), ("Wheat", 2003), ("Barley", 2003)]
chg["label"] = ""
for crop, year in picks:
    idx = chg[(chg["crop"] == crop) & (chg["year"] == year)].index[0]
    pct = chg.loc[idx, "change_pct"]
    rounded = int(abs(pct) + 0.5) * (1 if pct >= 0 else -1)   # round halves away from zero (120.5 -> 121)
    chg.loc[idx, "label"] = f"{crop} {year}: {rounded:+d}%"

# 4) save and print checks
chg[["crop", "year", "yield_t_ha", "prev_yield_t_ha", "change_pct", "label"]].to_csv("../data/yield_change.csv", index=False)
print(chg.groupby("crop")["change_pct"].agg(changes="size", median="median", q1=lambda s: s.quantile(.25),
                                            q3=lambda s: s.quantile(.75), worst="min", best="max").round(1))
print("\nLabelled points:")
print(chg[chg["label"] != ""][["crop", "year", "change_pct", "label"]].to_string(index=False))