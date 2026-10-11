import pandas as pd

LOW_SINCE = 1990   # the "low" marker is each crop's lowest production since this year

# 1) load the FAOSTAT file (Australia only; area in ha, production in t, yield in kg/ha)
fao = pd.read_csv("../raw_data/FAOSTAT_australia_history.csv", encoding="utf-8-sig")
fao = fao.rename(columns={"Item": "crop", "Year": "year"})

# 2) one row per crop and year, with production, area harvested and yield side by side
wide = fao.pivot_table(index=["crop", "year"], columns="Element", values="Value", aggfunc="first").reset_index()

# 3) convert to friendlier units: million tonnes, million hectares and tonnes per hectare
wide["production_mt"] = (wide["Production"] / 1e6).round(3)
wide["area_mha"] = (wide["Area harvested"] / 1e6).round(3)
wide["yield_t_ha"] = (wide["Yield"] / 1000).round(3)

# 4) mark two points per crop for annotation: the record high, and the lowest year since LOW_SINCE
wide["note"] = ""
for crop, g in wide.groupby("crop"):
    wide.loc[g["production_mt"].idxmax(), "note"] = "Record high"
    wide.loc[g[g["year"] >= LOW_SINCE]["production_mt"].idxmin(), "note"] = f"Low since {LOW_SINCE}"

# 5) save and print checks
wide = wide.sort_values(["crop", "year"])
wide[["crop", "year", "production_mt", "area_mha", "yield_t_ha", "note"]].to_csv("../data/production_history.csv", index=False)
print(wide.groupby("crop").agg(years=("year", "size"), first=("year", "min"), last=("year", "max"),
                               max_mt=("production_mt", "max"), min_mt=("production_mt", "min")))
print("\nMarked years:")
print(wide[wide["note"] != ""][["crop", "year", "production_mt", "note"]].to_string(index=False))