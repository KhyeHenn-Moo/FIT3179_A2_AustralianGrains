import json
import pandas as pd

YEAR = 2024
MIN_TONNES = 1000    # drop tiny buyers so every tile is big enough to see (same floor as the flow map)

# 1) load the FAO trade matrix: Australian export quantity (tonnes) in YEAR, one row per grain and buyer
fao = pd.read_csv("../raw_data/FAOSTAT_data.csv", encoding="utf-8-sig")
fao = fao[(fao["Element"] == "Export quantity") & (fao["Year"] == YEAR)].copy()
fao["m49"] = fao["Partner Country Code (M49)"].astype(str).str.replace("'", "").astype(int)
fao = fao.rename(columns={"Item": "crop", "Value": "tonnes", "Partner Countries": "partner"})

# 2) look up each buyer's continent and sub-region in the Natural Earth countries file (matched on the ISO numeric code)
topo = json.load(open("../js/ne_110m_countries.topojson", encoding="utf-8"))
geoms = topo["objects"]["ne_110m_admin_0_countries"]["geometries"]
place = {int(g["properties"]["ISO_N3"]): (g["properties"]["CONTINENT"], g["properties"]["SUBREGION"])
         for g in geoms if str(g["properties"]["ISO_N3"]).lstrip("-").isdigit()}

# 3) fix the buyers the file cannot match (Taiwan has an ISO code of -99; the others are missing from the 110m file)
manual = {158: ("Asia", "Eastern Asia"),            # Taiwan
          344: ("Asia", "Eastern Asia"),            # Hong Kong
          446: ("Asia", "Eastern Asia"),            # Macao
          702: ("Asia", "South-Eastern Asia"),      # Singapore
          48:  ("Asia", "Western Asia")}            # Bahrain
fao["continent"] = fao["m49"].map(lambda c: manual.get(c, place.get(c, (None, None)))[0])
fao["subregion"] = fao["m49"].map(lambda c: manual.get(c, place.get(c, (None, None)))[1])

# 4) keep Asian buyers only, add an "All Grains" total, and drop buyers below the tonnage floor
asia = fao[fao["continent"] == "Asia"]
asia = pd.concat([asia, asia.assign(crop="All Grains")], ignore_index=True)
asia = asia.groupby(["crop", "subregion", "m49", "partner"], as_index=False)["tonnes"].sum()
asia = asia[asia["tonnes"] >= MIN_TONNES]

# 5) short names for the tiles, a Malaysia flag, and each country's share of its grain's Asian total
short = {"China, mainland": "China", "China, Taiwan Province of": "Taiwan", "China, Hong Kong SAR": "Hong Kong",
         "China, Macao SAR": "Macao", "Republic of Korea": "South Korea", "Viet Nam": "Vietnam", "Türkiye": "Turkey",
         "Iran (Islamic Republic of)": "Iran", "Lao People's Democratic Republic": "Laos",
         "Democratic People's Republic of Korea": "North Korea", "Brunei Darussalam": "Brunei"}
asia["country"] = asia["partner"].replace(short)
asia["is_malaysia"] = asia["country"].eq("Malaysia")
asia["tonnes"] = asia["tonnes"].round(0)
asia["share_of_asia_pct"] = (asia["tonnes"] / asia.groupby("crop")["tonnes"].transform("sum") * 100).round(1)

# 6) save and print checks
asia = asia.sort_values(["crop", "subregion", "tonnes"], ascending=[True, True, False])
asia[["crop", "subregion", "country", "tonnes", "share_of_asia_pct", "is_malaysia"]].to_csv("../data/exports_asia.csv", index=False)
print(asia.groupby("crop").agg(countries=("country", "size"), subregions=("subregion", "nunique"), tonnes=("tonnes", "sum")))
print("\nSub-region totals (tonnes):")
print(asia.groupby(["crop", "subregion"])["tonnes"].sum().to_string())
print("\nMalaysia:")
print(asia[asia["is_malaysia"]][["crop", "subregion", "tonnes", "share_of_asia_pct"]].to_string(index=False))