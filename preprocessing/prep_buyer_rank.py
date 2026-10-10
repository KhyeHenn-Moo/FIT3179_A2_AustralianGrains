import pandas as pd

TOP_N = 10   # keep buyers ranked 1-10 in a period (Malaysia is always kept)

# 1) load FAO export quantities (tonnes) for the four grains
fao = pd.read_csv("../raw_data/FAOSTAT_data.csv", encoding="utf-8-sig")
fao = fao[fao["Element"] == "Export quantity"]
fao = fao.rename(columns={"Partner Countries": "partner", "Item": "crop",
                          "Value": "tonnes", "Year": "year"})
fao = fao[["partner", "crop", "year", "tonnes"]]

# 2) add an "All Grains" crop = wheat + barley + oats + sorghum for each buyer and year
total = fao.groupby(["partner", "year"], as_index=False)["tonnes"].sum()
total["crop"] = "All Grains"
fao = pd.concat([fao, total], ignore_index=True)

# 3) drop 1992-1995 (FAO's trade matrix is incomplete: total exports fall to 0.1-2.8 Mt vs about 15 Mt a year either side), then group the remaining years into periods to avoid noisy single years
fao = fao[~fao["year"].between(1992, 1995)]
def period(y):
    if y <= 1991:
        return "1986-91"
    start = 1996 + ((y - 1996) // 5) * 5
    return f"{start}-{str(start + 4)[2:]}" if start < 2021 else "2021-24"
fao["period"] = fao["year"].apply(period)
n_years = fao.groupby("period")["year"].nunique().to_dict()   # years in each period (6, 5 or 4)

# 4) total tonnes per buyer, crop and period, then rank buyers within each crop and period
agg = fao.groupby(["crop", "period", "partner"], as_index=False)["tonnes"].sum()
agg["avg_annual_t"] = (agg["tonnes"] / agg["period"].map(n_years)).round(0)
agg["rank"] = agg.groupby(["crop", "period"])["tonnes"].rank(ascending=False, method="first").astype(int)

# 5) keep the top TOP_N buyers plus Malaysia, add flags and a short label
agg["is_malaysia"] = agg["partner"].eq("Malaysia")
out = agg[(agg["rank"] <= TOP_N) | agg["is_malaysia"]].copy()
short = {"China, mainland": "China", "Republic of Korea": "South Korea",
         "China, Taiwan Province of": "Taiwan", "Viet Nam": "Vietnam",
         "Netherlands (Kingdom of the)": "Netherlands",
         "United Kingdom of Great Britain and Northern Ireland": "UK",
         "United States of America": "USA", "Iran (Islamic Republic of)": "Iran",
         "Russian Federation": "Russia"}
out["label"] = out["partner"].replace(short)
out = out.sort_values(["crop", "period", "rank"])
out[["crop", "period", "partner", "label", "tonnes", "avg_annual_t", "rank", "is_malaysia"]].to_csv(
    "../data/buyer_rank.csv", index=False)

# 6) checks to compare with my output
print(out.groupby("crop").size())
print("Malaysia rank by crop and period:")
print(out[out.is_malaysia].pivot(index="period", columns="crop", values="rank"))
print("Top 3 in All Grains:")
print(out[(out.crop == "All Grains") & (out["rank"] <= 3)][["period", "rank", "label", "avg_annual_t"]].to_string(index=False))