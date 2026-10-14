# Australian Grains

**Where Australia grows its grain, and where it sends it.**

A single-page, scrollable data visualisation dashboard on wheat, barley, oats and sorghum, built with Vega-Lite and Vega.

- **Live dashboard:** `<To Be Added>`
- **Repository:** https://github.com/KhyeHenn-Moo/FIT3179_A2_AustralianGrains
- **Author:** Moo Khye Henn
- **Date:** 15 October 2026
- **Context:** FIT3179 Data Visualisation, Assignment 2, Monash University Malaysia

## About the dashboard

Australia is one of the world's largest grain exporters, yet its harvests swing sharply with the weather and most of what it grows leaves the country. The dashboard follows four grains (wheat, barley, oats and sorghum) in four steps: where they are grown, how unpredictable the harvests are, which countries buy them, and how Australia compares with the rest of the world. Malaysia, a regular buyer, is picked out in the charts where it appears.

Sections 1, 3 and 4 each have one crop selector (Section 1 also has a year selector) that stays at the top of the screen and changes every chart, and the short insight text beside it, in that section.

## Charts

The Vega-Lite and Vega specification for every chart is in the `js/` folder, formatted for reading.

| Section | Chart | Idiom | Specification |
|---|---|---|---|
| 01 Where It Grows | 1. Grain production density by Statistical Area Level 2 | Classified choropleth map | `chart1_grain_map.vg.json` |
| | 2. Grain production by state | Proportional symbol map | `chart2_state_symbols.vg.json` |
| 02 Boom and Bust | 3. Crop share of each state's grain production | Heatmap table | `chart3_crop_share.vg.json` |
| | 4. Australian grain harvests, 1961 to 2024 | Small multiples (area and line charts) | `chart4_production_history.vg.json` |
| | 5. Year-to-year change in yield | Box plot | `chart5_yield_boxplot.vg.json` |
| | 6. Change in each state's production | Diverging bar chart, small multiples | `chart6_state_change.vg.json` |
| 03 Where It Goes | 7. Where Australian grain was exported in 2024 | Flow map | `chart7_flow_map.vg.json` |
| | 8. Australia's biggest grain buyers, ranked by period | Bump chart | `chart8_bump_chart.vg.json` |
| | 9a. Exports by continent | Bar chart | `chart9a_continent_bar.vg.json` |
| | 9b. Who buys Australian grain in Asia | Treemap (plain Vega) | `chart9b_asia_treemap.vg.json` |
| 04 Australia in the World | 10. Grain yield by country, 2024 | Classified choropleth map | `chart10_world_yield.vg.json` |
| | 11. How the leading producers changed, 2004 to 2024 | Slope chart (log scale) | `chart11_slope_chart.vg.json` |

## Data sources

| Source | Dataset | Raw file (`raw_data/`) | Used for |
|---|---|---|---|
| Australian Bureau of Statistics (ABS) | [Australian Agriculture: Broadacre Crops](https://dataexplorer.abs.gov.au/vis?pg=0&snb=1&df[ds]=INDUSTRY_TO): area, levied production and local value of levied crop, by Statistical Area Level 2 and state, 2022-23 to 2024-25 | `ABS_data.csv` | Charts 1, 2, 3, 6 |
| Food and Agriculture Organization of the United Nations (FAOSTAT) | [Trade: detailed trade matrix](https://www.fao.org/faostat/en/#data/TM): Australian export quantity by destination country | `FAOSTAT_data.csv` | Charts 7, 8, 9a, 9b |
| FAOSTAT | [Crops and livestock products](https://www.fao.org/faostat/en/#data/QCL): area harvested, production and yield, by country | `FAOSTAT_production.csv` | Charts 10, 11 |
| FAOSTAT | [Crops and livestock products](https://www.fao.org/faostat/en/#data/QCL): the same measures for Australia only, 1961 to 2024 | `FAOSTAT_australia_history.csv` | Charts 4, 5 |

Notes on the data:

- ABS figures are **levied production**: the tonnes recorded through grain levy payments, which is not always the same as the total harvest.
- ABS only reports small Statistical Area Level 2 areas where production was recorded. Grey areas on chart 1 mean no record, not zero.
- Trade flows (charts 7, 9a, 9b) are for 2024 and leave out flows under 1,000 tonnes. Buyer rankings (chart 8) use periods from 1986-91 to 2021-24; the 1992-95 trade records are incomplete, so those years are left out.
- Chart 7 lines run from the middle of Australia to each buyer's capital city, so they show size, not shipping routes.

### Map files

| File (`js/`) | What it is | Source |
|---|---|---|
| `sa2_2021.topojson` | Statistical Area Level 2 boundaries, 2021 (chart 1) | [ABS digital boundary files](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs/edition-3-july-2021-june-2026/access-and-downloads/digital-boundary-files), converted to TopoJSON and simplified with [Mapshaper](https://mapshaper.org) |
| `states_2021.geojson` | State outlines, dissolved from the Statistical Area Level 2 boundaries (chart 2) | Made by `preprocessing/prep_state_grain.py` |
| `ne_110m_countries.topojson` | World country boundaries (charts 7 and 10), also used to look up each buyer's continent and sub-region | [Natural Earth, via the FIT3179 Vega-Lite examples](https://github.com/FIT3179/Vega-Lite/blob/main/2_symbol_map/js/ne_110m_admin_0_countries.topojson) (saved here under a shorter name) |
| `ne_50m_populated_places_simple.geojson` | Capital city coordinates for the flow map destinations (chart 7) | [Natural Earth vector data](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_populated_places_simple.geojson) |
| `oceans.topojson` | Ocean layer for the world maps (charts 7 and 10) | [FIT3179 Vega-Lite examples](https://github.com/FIT3179/Vega-Lite/blob/main/7_others/oceans.topojson) |
| `WorldMapWithGraticules.topojson` | Graticule lines for the world maps (charts 7 and 10) | [FIT3179 Vega-Lite examples](https://github.com/FIT3179/Vega-Lite/blob/main/2_symbol_map/js/WorldMapWithGraticules.topojson) |

## Data preparation

The raw files are too large and too detailed to load in the browser, so Python scripts in `preprocessing/` reduce them to the small CSV files in `data/` that the charts read. Every chart reads only the cleaned files in `data/`, never the raw files.

| Script | Reads | Writes | What it does |
|---|---|---|---|
| `prep_grain_sa2.py` | `ABS_data.csv`, `sa2_2021.topojson` | `grain_sa2.csv` | Keeps levied production by Statistical Area Level 2 for the four crops and three years, and divides tonnes by the area's size to get tonnes per square kilometre |
| `prep_state_grain.py` | `ABS_data.csv`, `sa2_2021.topojson` | `state_grain.csv`, `states_2021.geojson` | Keeps the state-level production rows, and calculates each state's centre point for the symbol map |
| `prep_crop_share.py` | `state_grain.csv` | `state_crop_share.csv` | Calculates each crop's share of a state's four-grain total |
| `prep_state_change.py` | `state_grain.csv` | `state_change.csv` | Calculates the change in each state's total between years |
| `prep_production_history.py` | `FAOSTAT_australia_history.csv` | `production_history.csv` | Combines production, area and yield for Australia, 1961 to 2024 |
| `prep_yield_change.py` | `production_history.csv` | `yield_change.csv` | Calculates the yearly percentage change in yield |
| `prep_flows.py` | `FAOSTAT_data.csv`, `ne_110m_countries.topojson`, `ne_50m_populated_places_simple.geojson` | `flows.csv` | Keeps 2024 export flows of 1,000 tonnes or more and matches each buyer to its capital city |
| `prep_buyer_rank.py` | `FAOSTAT_data.csv` | `buyer_rank.csv` | Ranks buyers by average annual tonnes in each period |
| `prep_exports_continent.py` | `FAOSTAT_data.csv`, `ne_110m_countries.topojson` | `exports_continent.csv` | Adds up 2024 exports by the continent of the buyer |
| `prep_exports_asia.py` | `FAOSTAT_data.csv`, `ne_110m_countries.topojson` | `exports_asia.csv` | Groups 2024 exports to Asia by United Nations sub-region and country |
| `prep_world_yield.py` | `FAOSTAT_production.csv`, `ne_110m_countries.topojson` | `world_yield.csv` | Calculates 2024 yield by country and drops countries with under 1,000 hectares harvested |
| `prep_slope_production.py` | `FAOSTAT_production.csv` | `production_slope.csv` | Finds each crop's ten largest producers in 2024 and compares them with 2004 |

### Running the scripts again

Requires Python 3 with `pandas`, `geopandas` and `shapely`:

```
pip install pandas geopandas shapely
cd preprocessing
python prep_state_grain.py
python prep_crop_share.py
python prep_state_change.py
python prep_production_history.py
python prep_yield_change.py
```

The other scripts have no dependency on each other and can be run in any order. `prep_crop_share.py` and `prep_state_change.py` need `state_grain.csv` first, and `prep_yield_change.py` needs `production_history.csv` first.

## Large raw files

The `raw_data/` folder holds the original downloads. They are kept so the cleaning can be repeated, but the dashboard does not load them.

| File | Size |
|---|---|
| `ABS_data.csv` | 1.3 MB |
| `FAOSTAT_data.csv` | 1.4 MB |
| `FAOSTAT_production.csv` | 4.6 MB |
| `FAOSTAT_australia_history.csv` | 110 KB |

What the page downloads is the 12 cleaned CSV files in `data/` (about 0.25 MB in total) and the map files in `js/`. The largest map file is `sa2_2021.topojson` at 2.8 MB.

## Repository structure

```
.
├── index.html                 the dashboard page
├── css/
│   └── style.css              page layout, typography and colours
├── js/
│   ├── main.js                loads the charts, controls and insight texts
│   ├── chart1_grain_map.vg.json … chart11_slope_chart.vg.json
│   └── *.topojson / *.geojson map files
├── data/                      cleaned CSV files read by the charts
├── preprocessing/             Python scripts that make the files in data/
└── raw_data/                  original ABS and FAOSTAT downloads
```

## Built with

- [Vega 5.20.2](https://vega.github.io/vega/), [Vega-Lite 5.1.0](https://vega.github.io/vega-lite/) and [Vega-Embed 6.17.0](https://github.com/vega/vega-embed), loaded from a CDN
- Plain HTML, CSS and JavaScript (no framework)
- Python with pandas, geopandas and shapely for data preparation
- Mapshaper for converting and simplifying the boundary file
