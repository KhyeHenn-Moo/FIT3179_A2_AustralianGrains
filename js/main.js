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

// chart title and subtitle: one size and colour for every chart, so the hierarchy is the same everywhere
var TITLE_STYLE = {fontSize: 22, color: "#2b2418", subtitleFontSize: 14, subtitleColor: "#5c5444", subtitlePadding: 6};

// for Vega-Lite charts: "font" covers titles, subtitles, axes, legends and text labels
// background "transparent" lets the light page colour show through behind every chart
var vlOptions = {actions: false, config: {font: FONT, background: "transparent", title: TITLE_STYLE}};

// for chart 9b (plain Vega chart), which has no single "font" setting
var vegaOptions = {
    actions: false,
    config: {
        background: "transparent",
        text: {font: FONT},
        title: {font: FONT, subtitleFont: FONT, fontSize: TITLE_STYLE.fontSize, color: TITLE_STYLE.color, subtitleFontSize: TITLE_STYLE.subtitleFontSize, subtitleColor: TITLE_STYLE.subtitleColor, subtitlePadding: TITLE_STYLE.subtitlePadding},
        axis: {labelFont: FONT, titleFont: FONT},
        legend: {labelFont: FONT, titleFont: FONT}
    }
};



// section 1 (charts 1 and 2) shares one crop control and one year control, which are in index.html
var section1Views = [];

function applySection1Controls() {
    var crop = document.getElementById("crop_select_1").value;
    var year = document.querySelector('input[name="year_1"]:checked').value;
    section1Views.forEach(function(view) {
        view.signal("crop", crop).signal("year", year).run();
    });
}

Promise.all([
    vegaEmbed("#grain_map", vg_1, vlOptions),
    vegaEmbed("#state_symbols", vg_2, vlOptions)
]).then(function(results) {
    section1Views = results.map(function(result) { return result.view; });
    document.getElementById("crop_select_1").addEventListener("change", applySection1Controls);
    document.querySelectorAll('input[name="year_1"]').forEach(function(radio) {
        radio.addEventListener("change", applySection1Controls);
    });
    applySection1Controls();  // also covers a browser that restores the old control value on reload
}).catch(console.error);


// section 2 (charts 3, 4, 5, 6)
vegaEmbed("#crop_share", vg_3, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#production_history", vg_4, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#yield_boxplot", vg_5, vlOptions).then(function(result) {
}).catch(console.error);
vegaEmbed("#state_change", vg_6, vlOptions).then(function(result) {
}).catch(console.error);


// section 3 (charts 7, 8, 9a and 9b) shares one crop control, which is in index.html
var section3Views = [];

function applySection3Controls() {
    var crop = document.getElementById("crop_select_3").value;
    section3Views.forEach(function(view) {
        view.signal("crop", crop).run();
    });
}

Promise.all([
    vegaEmbed("#flow_map", vg_7, vlOptions),
    vegaEmbed("#bump_chart", vg_8, vlOptions),
    vegaEmbed("#continent_bar", vg_9a, vlOptions),
    vegaEmbed("#asia_treemap", vg_9b, vegaOptions)
]).then(function(results) {
    section3Views = results.map(function(result) { return result.view; });
    document.getElementById("crop_select_3").addEventListener("change", applySection3Controls);
    applySection3Controls();   // also covers a browser that restores the old control value on reload
}).catch(console.error);


// section 4 (charts 10 and 11) shares one crop control, which is in index.html
var section4Views = [];

function applySection4Controls() {
    var crop = document.getElementById("crop_select_4").value;
    section4Views.forEach(function(view) {
        view.signal("crop", crop).run();
    });
}

Promise.all([
    vegaEmbed("#world_yield", vg_10, vlOptions),
    vegaEmbed("#slope_chart", vg_11, vlOptions)
]).then(function(results) {
    section4Views = results.map(function(result) { return result.view; });
    document.getElementById("crop_select_4").addEventListener("change", applySection4Controls);
    applySection4Controls();   // also covers a browser that restores the old control value on reload
}).catch(console.error);