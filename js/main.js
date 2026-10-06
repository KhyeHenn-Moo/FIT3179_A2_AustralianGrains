var vg_1 = "js/chart1_grain_map.vg.json";
var vg_2 = "js/chart2_state_symbols.vg.json";

vegaEmbed("#grain_map", vg_1, {actions: false}).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_symbols", vg_2, {actions: false}).then(function(result) {
}).catch(console.error);
