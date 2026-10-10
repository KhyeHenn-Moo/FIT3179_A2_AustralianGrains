var vg_1 = "js/chart1_grain_map.vg.json";
var vg_2 = "js/chart2_state_symbols.vg.json";
var vg_3 = "js/chart3_crop_share.vg.json";
var vg_6 = "js/chart6_state_change.vg.json";
var vg_7 = "js/chart7_flow_map.vg.json";


vegaEmbed("#grain_map", vg_1, {actions: false}).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_symbols", vg_2, {actions: false}).then(function(result) {
}).catch(console.error);
vegaEmbed("#crop_share", vg_3, {actions: false}).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_change", vg_6, {actions: false}).then(function(result) {
}).catch(console.error);
vegaEmbed("#flow_map", vg_7, {actions: false}).then(function(result) {
}).catch(console.error);