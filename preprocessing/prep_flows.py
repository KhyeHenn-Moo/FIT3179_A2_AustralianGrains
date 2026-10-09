import json
import pandas as pd

YEAR = 2024
MIN_TONNES = 1000          # drop tiny flows so the map stays readable
ORIGIN = (134.0, -25.0)    # one neutral origin near the middle of Australia (exports leave from many ports)

# 1) load FAO export quantities for 2024 and keep only flows of at least MIN_TONNES
fao = pd.read_csv("../raw_data/FAOSTAT_data.csv", encoding="utf-8-sig")
fao = fao[(fao["Element"] == "Export quantity") & (fao["Year"] == YEAR)]
fao = fao.rename(columns={"Partner Countries": "partner", "Item": "crop",
                          "Value": "tonnes", "Partner Country Code (M49)": "m49"})
fao["m49"] = fao["m49"].astype(str).str.zfill(3)
fao = fao[fao["tonnes"] >= MIN_TONNES][["m49", "partner", "crop", "tonnes"]]

# 2) match each FAO partner (M49 code) to a Natural Earth country, via its ISO numeric code
topo = json.load(open("../js/ne_110m_countries.topojson", encoding="utf-8"))
props = [g["properties"] for g in topo["objects"]["ne_110m_admin_0_countries"]["geometries"]]
n3 = {}
for p in props:
    if str(p["ISO_N3"]) not in ("-99", ""):
        n3[str(p["ISO_N3"]).zfill(3)] = p["ISO_A2"]
n3.update({"250": "FR", "578": "NO", "158": "TW", "728": "SS", "688": "RS"})  # -99 in Natural Earth

# 3) find each country's capital city (lon/lat) to use as the flow's end point
places = json.load(open("../js/ne_50m_populated_places_simple.geojson", encoding="utf-8"))
cap_by_a2 = {}
for f in places["features"]:
    p = f["properties"]
    if p["adm0cap"] == 1:
        cap_by_a2.setdefault(p["iso_a2"], (p["longitude"], p["latitude"], p["name"]))
# city-states / territories with no 'country' polygon in the 110m file
manual = {"702": ("SG", 103.8539, 1.2950, "Singapore"), "048": ("BH", 50.5831, 26.2361, "Manama"),
          "480": ("MU", 57.5000, -20.1666, "Port Louis"), "344": ("HK", 114.1831, 22.3069, "Hong Kong")}

# 4) look up coordinates for every partner (manual entries cover the 4 city-states/territories)
rows = []
for m49 in fao["m49"].unique():
    if m49 in manual:
        a2, lon, lat, city = manual[m49]
    else:
        a2 = n3.get(m49)
        if a2 is None or a2 not in cap_by_a2:
            rows.append((m49, None, None, None)); continue
        lon, lat, city = cap_by_a2[a2]
    rows.append((m49, lon, lat, city))
loc = pd.DataFrame(rows, columns=["m49", "dest_lon", "dest_lat", "dest_city"])

# 5) attach coordinates to the flows and report any partner that could not be matched
df = fao.merge(loc, on="m49", how="left")
missing = df[df.dest_lon.isna()]
print("Partners with no coordinates (dropped):")
print(missing.groupby("partner").tonnes.sum().sort_values(ascending=False))
df = df.dropna(subset=["dest_lon"]).copy()
# 6) add the Australian origin point, Malaysia flag and rank within each crop
df["origin_lon"], df["origin_lat"] = ORIGIN
df["is_malaysia"] = df["partner"].eq("Malaysia")
df["year"] = YEAR
df = df.sort_values(["crop", "tonnes"], ascending=[True, False])
df["rank_in_crop"] = df.groupby("crop")["tonnes"].rank(ascending=False, method="first").astype(int)
# 7) order columns, save, and print checks to compare against my numbers
df = df[["year","crop","partner","dest_city","tonnes","rank_in_crop","is_malaysia",
         "origin_lon","origin_lat","dest_lon","dest_lat"]]
df.to_csv("../data/flows.csv", index=False)
print(df.groupby("crop").agg(flows=("partner","count"), tonnes=("tonnes","sum")))
print(df.groupby("crop").head(3).to_string(index=False))