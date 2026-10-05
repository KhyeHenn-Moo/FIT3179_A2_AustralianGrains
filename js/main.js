var vg_1 = "js/chart1_grain_map.vg.json";

vegaEmbed("#grain_map", vg_1, {actions: false}).then(function(result) {
    // Access the Vega view instance as result.view
}).catch(console.error);
