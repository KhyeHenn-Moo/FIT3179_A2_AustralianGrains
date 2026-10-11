import json
import pandas as pd

YEAR = 2024

# 1) load the FAO trade matrix: Australian export quantity (tonnes) in YEAR, one row per grain and buyer
fao = pd.read_csv("../raw_data/FAOSTAT_data.csv", encoding="utf-8-sig")
fao = fao[(fao["Element"] == "Export quantity") & (fao["Year"] == YEAR)].copy()
fao["m49"] = fao["Partner Country Code (M49)"].astype(str).str.replace("'", "").astype(int)
fao = fao.rename(columns={"Item": "crop", "Value": "tonnes"})

# 2) look up each buyer's continent in the Natural Earth countries file (matched on the ISO numeric code)
topo = json.load(open("../js/ne_110m_countries.topojson", encoding="utf-8"))
geoms = topo["objects"]["ne_110m_admin_0_countries"]["geometries"]
continent_of = {int(g["properties"]["ISO_N3"]): g["properties"]["CONTINENT"]
                for g in geoms if str(g["properties"]["ISO_N3"]).lstrip("-").isdigit()}

# 3) fix the buyers the file cannot match: France, Norway, Taiwan and South Sudan have an ISO code of -99 in
# Natural Earth, and some small territories are missing from the 110m file altogether
manual = {250: "Europe", 578: "Europe", 158: "Asia", 728: "Africa", 688: "Europe",                   # -99 codes
          702: "Asia", 48: "Asia", 344: "Asia", 446: "Asia",                                          # Singapore, Bahrain, Hong Kong, Macao
          480: "Africa", 296: "Oceania", 520: "Oceania", 882: "Oceania"}                              # Mauritius, Kiribati, Nauru, Samoa
fao["continent"] = fao["m49"].map(lambda c: manual.get(c, continent_of.get(c)))
missing = fao[fao["continent"].isna()]
print("Buyers with no continent (should be empty):", missing["Partner Countries"].unique().tolist())

# 4) add an "All Grains" total next to the four individual grains
all_grains = fao.assign(crop="All Grains")
fao = pd.concat([fao, all_grains], ignore_index=True)

# 5) total the tonnes for each grain and continent, and work out each continent's share of that grain's exports
out = fao.groupby(["crop", "continent"], as_index=False).agg(tonnes=("tonnes", "sum"), n_buyers=("m49", "nunique"))
out["tonnes_kt"] = (out["tonnes"] / 1000).round(1)
out["share_pct"] = (out["tonnes"] / out.groupby("crop")["tonnes"].transform("sum") * 100).round(1)
out = out.sort_values(["crop", "tonnes"], ascending=[True, False])

# 6) save and print checks
out[["crop", "continent", "tonnes", "tonnes_kt", "share_pct", "n_buyers"]].to_csv("../data/exports_continent.csv", index=False)
print(out[["crop", "continent", "tonnes_kt", "share_pct", "n_buyers"]].to_string(index=False))