var vg_1 = "js/chart1_grain_map.vg.json";
var vg_2 = "js/chart2_state_symbols.vg.json";
var vg_3 = "js/chart3_crop_share.vg.json";
var vg_4 = "js/chart4_production_history.vg.json";
var vg_5 = "js/chart5_yield_boxplot.vg.json";
var vg_6 = "js/chart6_state_change.vg.json";
var vg_7 = "js/chart7_flow_map.vg.json";
var vg_8 = "js/chart8_bump_chart.vg.json";
var vg_9a = "js/chart9a_continent_bar.vg.json";
var vg_9b = "js/chart9b_asia_treemap.vg.json";
var vg_10 = "js/chart10_world_yield.vg.json";
var vg_11 = "js/chart11_slope_chart.vg.json";

// font type for every chart: Helvetica, with Arial as the fallback on computers that do not have it
var FONT = "Helvetica, Arial, sans-serif";

// for Vega-Lite charts: "font" covers titles, subtitles, axes, legends and text labels
var vlOptions = {actions: false, config: {font: FONT}};

// for chart 9b (plain Vega chart), which has no single "font" setting
var vegaOptions = {
    actions: false,
    config: {
        text: {font: FONT},
        title: {font: FONT, subtitleFont: FONT},
        axis: {labelFont: FONT, titleFont: FONT},
        legend: {labelFont: FONT, titleFont: FONT}
    }
};

vegaEmbed("#grain_map", vg_1, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_symbols", vg_2, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#crop_share", vg_3, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#production_history", vg_4, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#yield_boxplot", vg_5, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_change", vg_6, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#flow_map", vg_7, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#bump_chart", vg_8, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#continent_bar", vg_9a, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#asia_treemap", vg_9b, vegaOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#world_yield", vg_10, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#slope_chart", vg_11, vlOptions).then(function(result) {
}).catch(console.error);