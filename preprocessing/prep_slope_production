import pandas as pd

START, END = 2004, 2024
TOP_N = 10   # top producers per crop, ranked by END-year production (Australia is always kept)

# 1) load FAO production (tonnes) for the two years and drop the "China" total (it contains mainland China + Taiwan)
fao = pd.read_csv("../raw_data/FAOSTAT_production.csv", encoding="utf-8-sig")
fao = fao[(fao["Element"] == "Production") & fao["Year"].isin([START, END]) & (fao["Area"] != "China")]
fao = fao.rename(columns={"Area": "country", "Item": "crop", "Year": "year", "Value": "tonnes"})
fao = fao[["country", "crop", "year", "tonnes"]]

# 1b) Sudan split in 2011: the 2004 figures are for "Sudan (former)", which includes South Sudan.
# To compare like with like, 2024 Sudan + South Sudan are added together under one name.
fao["country"] = fao["country"].replace({"Sudan (former)": "Sudan (incl. South Sudan)",
                                         "Sudan": "Sudan (incl. South Sudan)",
                                         "South Sudan": "Sudan (incl. South Sudan)"})
fao = fao.groupby(["country", "crop", "year"], as_index=False)["tonnes"].sum()

# 2_ put the two years side by side; keep only countries with production in both years
wide = fao.pivot_table(index=["crop", "country"], columns="year", values="tonnes", aggfunc="first").reset_index()
wide = wide.dropna(subset=[START, END])
wide = wide[(wide[START] > 0) & (wide[END] > 0)]

# 3) rank countries within each crop by END-year production and keep the top TOP_N plus Australia
wide["rank_end"] = wide.groupby("crop")[END].rank(ascending=False, method="first").astype(int)
keep = wide[(wide["rank_end"] <= TOP_N) | (wide["country"] == "Australia")].copy()

# 4) calculate the change, add short labels and an Australia flag
keep["change_pct"] = ((keep[END] - keep[START]) / keep[START] * 100).round(1)
short = {"China, mainland": "China", "Russian Federation": "Russia", "United States of America": "USA",
         "United Kingdom of Great Britain and Northern Ireland": "UK", "Türkiye": "Turkey",
         "Iran (Islamic Republic of)": "Iran", "Netherlands (Kingdom of the)": "Netherlands",
         "Republic of Korea": "South Korea", "Bolivia (Plurinational State of)": "Bolivia"}
keep["label"] = keep["country"].replace(short)
keep["is_australia"] = keep["country"].eq("Australia")

# 5) seshape to one row per country, crop and year (what Vega-Lite wants), save and print checks
long = keep.melt(id_vars=["crop", "country", "label", "rank_end", "change_pct", "is_australia"],
                 value_vars=[START, END], var_name="year", value_name="tonnes")
long["production_mt"] = (long["tonnes"] / 1e6).round(3)
long = long.sort_values(["crop", "rank_end", "year"])

# 5b) label positions: countries with similar production would have overlapping labels, so each label gets a
# nudged height (label_y, in million tonnes) with a minimum gap between neighbours. The dots and lines keep
# the true values. PLOT_H and GAP_PX must match the chart height and font size in the Vega-Lite file.
import numpy as np
PLOT_H, GAP_PX = 560, 14
long["label_y"] = long["production_mt"]
for (crop, year), g in long.groupby(["crop", "year"]):
    ly = np.log10(g["production_mt"].values)
    span = ly.max() - ly.min()
    gap = GAP_PX / PLOT_H * span
    order = np.argsort(ly)
    pos = ly[order].copy()
    for _ in range(500):   # push overlapping neighbours apart until all gaps are respected
        moved = False
        for i in range(1, len(pos)):
            d = pos[i] - pos[i - 1]
            if d < gap - 1e-9:
                shift = (gap - d) / 2
                pos[i] += shift
                pos[i - 1] -= shift
                moved = True
        if not moved:
            break
    new = np.empty_like(pos)
    new[order] = pos
    long.loc[g.index, "label_y"] = (10 ** new).round(3)

long[["crop", "country", "label", "year", "tonnes", "production_mt", "label_y", "rank_end", "change_pct", "is_australia"]].to_csv(
    "../data/production_slope.csv", index=False)
print(long.groupby("crop")["country"].nunique())
for crop, g in long[long["year"] == END].groupby("crop"):
    print(f"\n{crop} {END}: top producers (Mt) and change since {START}")
    print(g[["rank_end", "label", "production_mt", "change_pct"]].to_string(index=False))