import json
import pandas as pd

YEAR = 2024
MIN_AREA_HA = 1000   # ignore yields calculated from tiny harvested areas (very noisy)

# 1) load FAO production data for one year; put Production and Area harvested side by side
fao = pd.read_csv("../raw_data/FAOSTAT_production.csv", encoding="utf-8-sig")
fao = fao[fao["Year"] == YEAR]
wide = fao.pivot_table(index=["Area Code (M49)", "Area", "Item"], columns="Element",
                       values="Value", aggfunc="first").reset_index()
wide = wide.rename(columns={"Area": "country", "Item": "crop", "Production": "production_t",
                            "Area harvested": "area_ha"})
wide["m49"] = wide["Area Code (M49)"].astype(str).str.zfill(3)

# 2) drop the "China" total (it already contains mainland China, Taiwan, etc.) to avoid double counting
wide = wide[wide["country"] != "China"]

# 3) keep rows with both values, then calculate yield = production / area harvested
wide = wide.dropna(subset=["production_t", "area_ha"])
n_before = len(wide)
wide = wide[wide["area_ha"] >= MIN_AREA_HA].copy()
print(f"Dropped {n_before - len(wide)} rows with under {MIN_AREA_HA} ha harvested")
wide["yield_t_ha"] = (wide["production_t"] / wide["area_ha"]).round(3)

# 4) match each FAO country (M49 code) to the world map's country code (ADM0_A3)
topo = json.load(open("../js/ne_110m_countries.topojson", encoding="utf-8"))
props = [g["properties"] for g in topo["objects"]["ne_110m_admin_0_countries"]["geometries"]]
code = {str(p["ISO_N3"]).zfill(3): p["ADM0_A3"] for p in props if str(p["ISO_N3"]) not in ("-99", "")}
code["578"] = "NOR"   # Norway has no numeric code in the Natural Earth file
wide["adm0_a3"] = wide["m49"].map(code)
missing = wide[wide["adm0_a3"].isna()]
print("Countries not on the 110m map (dropped):", sorted(missing["country"].unique()))
wide = wide.dropna(subset=["adm0_a3"])

# 5) save the table and print checks 
wide["year"] = YEAR
out = wide[["adm0_a3", "country", "crop", "year", "production_t", "area_ha", "yield_t_ha"]]
out = out.sort_values(["crop", "yield_t_ha"], ascending=[True, False])
out.to_csv("../data/world_yield.csv", index=False)
print(out.groupby("crop").agg(countries=("country", "count"), min_yield=("yield_t_ha", "min"),
                              median_yield=("yield_t_ha", "median"), max_yield=("yield_t_ha", "max")))
print(out[out["country"] == "Australia"].to_string(index=False))