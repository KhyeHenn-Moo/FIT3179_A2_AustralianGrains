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



// insight paragraphs: one short text beside every chart. Sections 1, 3 and 4 swap the text with the crop (and year) selectors
var INSIGHTS = {
    "S1": {
        "grain_map": {
            "Wheat|2022-23": "Half of the 2022-23 wheat came from only 20 of 246 areas. Morawa in Western Australia led with 2.1 million tonnes. The dark patches are narrow belts, not whole states, so a harvest of 41.2 million tonnes still rests on a few districts.",
            "Wheat|2023-24": "The harvest fell to 28.0 million tonnes and the leader changed. Esperance Surrounds in Western Australia topped the list with 1.0 million tonnes, only 3.6% of the total. It took 23 areas to reach half, so production was less concentrated than the year before.",
            "Wheat|2024-25": "Moree Surrounds in New South Wales became the top area with 2.1 million tonnes, just ahead of Morawa in Western Australia. Half of the 34.8 million tonnes came from 18 areas. The leading district moved from west to east, so no single region is a safe source.",
            "Barley|2022-23": "Kulin in Western Australia grew 1.4 million tonnes of barley, 10.3% of the national 13.5 million tonnes. Half of the crop came from 16 of 215 areas. When one area supplies a tenth of the crop, one local bad season can move the national total.",
            "Barley|2023-24": "Kulin still led but fell to 1.1 million tonnes while the national crop dropped to 11.0 million tonnes. Buloke in Victoria rose to second place. Half of the barley again came from 16 areas, so the ranking of leaders can change within one year.",
            "Barley|2024-25": "Kulin set a three-year high of 1.6 million tonnes, 11.7% of the 13.7 million tonne national crop. Moree Surrounds in New South Wales entered second place. Half of the crop now comes from 13 areas, the most concentrated of the three years.",
            "Oats|2022-23": "Oats are far more concentrated than other grains. Half of the 1.0 million tonnes came from only 5 of 163 areas. Kulin and Wagin (both in Western Australia) together grew 0.34 million tonnes, so the oat supply depends on one corner of the country.",
            "Oats|2023-24": "The oat crop shrank to 0.74 million tonnes, the smallest of the three years. Wagin overtook Kulin as the leading area with 0.15 million tonnes. Four areas gave half of the crop, so one poor season in the Western Australian wheatbelt moves the national total.",
            "Oats|2024-25": "Oats recovered to 1.15 million tonnes, the highest of the three years. Wagin led with 0.23 million tonnes and Kulin followed with 0.20 million tonnes. Just four areas again produced half of the crop, which shows how narrow the oat supply base is.",
            "Sorghum|2022-23": "Sorghum grows in a different place from the other grains. Wambo in Queensland led with 0.31 million tonnes, and 6 of 66 areas produced half of the 2.3 million tonne crop. Its supply sits in the north-east, so its harvest risk differs from wheat.",
            "Sorghum|2023-24": "The sorghum crop rose to 2.4 million tonnes while wheat and barley fell. Moree Surrounds in New South Wales moved to first with 0.29 million tonnes. Six areas again made half of the crop, so sorghum offered a steadier harvest than the winter grains.",
            "Sorghum|2024-25": "Sorghum reached 2.6 million tonnes, its highest of the three years. Wambo returned to first place with 0.36 million tonnes. Six areas still produced half of the crop, and the number of areas growing it rose from 66 to 79, a wider base than two years earlier."
        },
        "state_symbols": {
            "Wheat|2022-23": "Western Australia produced 14.7 million tonnes, 36% of the 41.2 million tonne wheat crop. New South Wales followed with 11.2 million tonnes. Together the two states grew 63% of the wheat, so these two states decide the national harvest.",
            "Wheat|2023-24": "Western Australia fell to 8.5 million tonnes, level with New South Wales at 8.4 million tonnes. Each state grew 30% of the 28.0 million tonne crop. The drop of 6.2 million tonnes in Western Australia explains almost half of the national fall of 13.1 million tonnes.",
            "Wheat|2024-25": "New South Wales grew 13.1 million tonnes, 38% of the 34.8 million tonne crop, and passed Western Australia at 12.4 million tonnes. South Australia fell to 2.9 million tonnes. The leading state changes between years, so no single state is a reliable source.",
            "Barley|2022-23": "Western Australia grew 5.7 million tonnes of barley, 42% of the 13.5 million tonne crop. South Australia was second with 2.8 million tonnes. One state supplies two fifths of the barley, so western conditions shape the national total.",
            "Barley|2023-24": "Western Australia dropped from 5.7 to 4.2 million tonnes. Victoria was the only large state to gain, rising to 2.6 million tonnes and 24% of the crop. The national crop still fell to 11.0 million tonnes, so one gaining state could not offset the losses.",
            "Barley|2024-25": "Western Australia recovered to 6.5 million tonnes, 47% of the 13.7 million tonne crop. New South Wales rose to 3.2 million tonnes. South Australia fell to 1.0 million tonnes from 2.8 million two years earlier, so almost half of the barley now comes from one state.",
            "Oats|2022-23": "Western Australia produced 0.75 million tonnes, 78% of the 0.96 million tonne oat crop. Victoria and New South Wales each grew about 0.1 million tonnes. Oats are the most concentrated grain by state, so a Western Australian shortfall is a national shortfall.",
            "Oats|2023-24": "Western Australian oats fell by 0.2 million tonnes to 0.54 million tonnes, while Victoria and New South Wales stayed near 0.09 and 0.08 million tonnes. The west accounted for nearly all of the national loss of 0.22 million tonnes. One state again set the national oat harvest.",
            "Oats|2024-25": "Western Australia produced 0.90 million tonnes of oats, the highest of the three years and 78% of the 1.15 million tonne crop. New South Wales rose to 0.13 million tonnes, ahead of Victoria. The national oat harvest still moves with one state.",
            "Sorghum|2022-23": "Queensland grew 1.56 million tonnes of sorghum, 67% of the 2.3 million tonne crop, and New South Wales grew almost all of the rest. Sorghum is a two-state crop in the east, the reverse of barley and oats, which sit mainly in the west.",
            "Sorghum|2023-24": "Queensland grew 1.59 million tonnes and New South Wales 0.84 million tonnes, from a national crop of 2.4 million tonnes. Both states grew more than the year before, while the winter grains fell. Sorghum sits in the east, away from the western belt.",
            "Sorghum|2024-25": "Queensland produced 1.65 million tonnes and New South Wales 0.94 million tonnes, a rise in both states for a second year. New South Wales supplied 36% of the 2.6 million tonne crop, up from 33% two years earlier."
        }
    },
    "S3": {
        "flow_map": {
            "All Grains": "Australia sent 28.6 million tonnes of grain overseas in 2024. China took 10.4 million tonnes, more than a third. China, Indonesia and the Philippines together took 57%. Malaysia ranked eighth with 0.79 million tonnes, a thin line on a crowded map.",
            "Wheat": "Wheat goes to a wider set of buyers: 38 destinations took 19.7 million tonnes. Indonesia led with 3.5 million tonnes, ahead of China at 3.2 million tonnes. Malaysia ranked eighth with 0.78 million tonnes, so it is a mid-sized customer in a market with no dominant buyer.",
            "Barley": "Barley exports depend on China, which took 4.8 million tonnes of the 6.4 million tonne total, or 75%. Japan was a distant second with 0.67 million tonnes. Malaysia took only 2,016 tonnes, the smallest of 17 destinations, so barley is not a Malaysian market.",
            "Oats": "Oat exports are small at 0.32 million tonnes, and China took 0.26 million tonnes of that. Malaysia ranked third with 12,284 tonnes. It is a minor buyer in tonnes, but oats are one of the few grains where Malaysia reaches the top three.",
            "Sorghum": "China took 2.1 million tonnes of the 2.2 million tonne sorghum exports, 93%. Japan was second with 0.07 million tonnes. No line reaches Malaysia, because its sorghum purchases are under 1,000 tonnes. One buyer decides almost this whole trade."
        },
        "bump_chart": {
            "All Grains": "China rose from second place in 1986-91 to first in 2016. Indonesia led in four periods from 1996 to 2015. Malaysia stayed between sixth and tenth place, and was tenth in 2021-24 although its average rose to 1.04 million tonnes a year. Its rank slips even as its tonnage grows.",
            "Wheat": "Indonesia was the top wheat buyer in five periods, until China overtook it in 2021-24. Malaysia peaked at fifth place in 2006-10 and has since slipped to ninth, although its average rose to 1.01 million tonnes a year. Malaysia holds its volume while rivals grow faster.",
            "Barley": "Saudi Arabia and China trade the top spot. China's yearly average fell from 2.6 to 1.9 million tonnes in 2021-24, because its 80.5% duties on Australian barley (May 2020 to August 2023) effectively blocked exports until they were lifted. Malaysia is not in the top ten in any period, it was eighteenth in 2016-20 and twenty-sixth in 2021-24.",
            "Oats": "Malaysia climbed to fifth place in both 2016-20 and 2021-24, and its yearly average rose from 191 tonnes in 2011-15 to 22,639 tonnes. China has ranked first since 2016, while Japan, first for five periods, fell to sixth. Oats is where Malaysia has moved up most.",
            "Sorghum": "Japan led sorghum buying until 2005, and China has led since 2011-15. Malaysia peaked at twelfth place in 2016-20 with 103 tonnes a year, then fell back to sixteenth in 2021-24 at 18 tonnes a year. Sorghum is a grain that Malaysia hardly buys from Australia."
        },
        "continent_bar": {
            "All Grains": "Asia took 26.2 million tonnes of Australian grain in 2024, 91.5% of all exports, spread over 25 buyers. Oceania took 4.0% and Africa 3.0%. Australia's grain trade is an Asian trade, so Malaysia sits in the market that matters most.",
            "Wheat": "Asia bought 17.7 million tonnes of wheat, 90.0% of exports, from 23 buyers. Oceania took 5.8% and Africa 4.0%. Wheat is slightly less Asian than the other grains, because Africa and Oceania buy more of it.",
            "Barley": "Asia took 6.0 million tonnes of barley, 93.1%, from 16 buyers. North America and South America each took 2.5%. Outside Asia the barley trade is tiny, so Asian demand (mostly Chinese) sets the barley market.",
            "Oats": "All 324 thousand tonnes of oat exports went to Asia, from 19 buyers, and other continents took only a few tonnes. Oats are the most Asian grain in the data, so Malaysia competes only with other Asian buyers for the oat supply.",
            "Sorghum": "Asia took 98.7% of sorghum, 2.2 million tonnes, from only 7 buyers. Africa took 29.6 thousand tonnes (1.3%). With so few buyers, sorghum is the thinnest market of the four grains, and it depends heavily on a few customers."
        },
        "asia_treemap": {
            "All Grains": "Eastern Asia took 52.9% of Asian purchases and South-Eastern Asia 35.1%. China alone bought 39.6%. Malaysia's 0.79 million tonnes is 3.0%, the eighth largest Asian buyer, so it is a modest tile beside China.",
            "Wheat": "South-Eastern Asia is the largest wheat region, taking 50.2% of Asian purchases, ahead of Eastern Asia at 33.2%. Indonesia leads with 19.5% and Malaysia holds 4.4% in eighth place. Wheat is where Malaysia's neighbours compete with it most.",
            "Barley": "Eastern Asia took 92.8% of Asian barley, and China alone took 80.5%. South-Eastern Asia took only 4.5%, and Malaysia's 2,016 tonnes is a sliver. Barley is a story of China and Japan, not of South-Eastern Asia.",
            "Oats": "China took 79.9% of Asian oats and India 9.3%. Malaysia is third with 12,284 tonnes (3.8%), ahead of the United Arab Emirates. Oats are small in total, so a modest order gives Malaysia a high rank.",
            "Sorghum": "China bought 93.9% of Asia's sorghum, and Japan and Taiwan took 3.3% and 2.1%. Malaysia does not appear, because its purchases fall below 1,000 tonnes. At this scale, Malaysia's sorghum is not drawn from Australia."
        }
    },
    "S4": {
        "world_yield": {
            "Wheat": "Australia's wheat yield was 2.6 tonnes per hectare in 2024, ranking 72nd of 109 countries and below the median of 3.2. New Zealand reached 10.0. Australia is a large wheat producer through its vast area, not through output per hectare.",
            "Barley": "Australia's barley yield was 2.9 tonnes per hectare, ranking 51st of 91 countries and just below the median of 3.1. New Zealand led with 7.7 and Germany reached 6.4. Australia is a top-two barley producer with a middle-ranking yield, so its output comes from area.",
            "Oats": "Australia's oat yield was 1.8 tonnes per hectare, ranking 45th of 62 countries and below the median of 2.3. Ireland led with 7.6. Of the four grains, oats show the largest gap between Australia and the median country.",
            "Sorghum": "Sorghum is Australia's strongest yield result: 3.2 tonnes per hectare, 18th of 89 countries and far above the median of 1.3. Oman's 56.4 is an unusual outlier. Australia grows sorghum efficiently, though it is a smaller crop than wheat and barley."
        },
        "slope_chart": {
            "Wheat": "Australia's wheat production rose 55.7% from 21.9 to 34.1 million tonnes. China rose 52.4% to 140.1 million tonnes and Russia 81.8%. France fell 33.0%. Australia grew as fast as the giants, yet its crop is only a quarter of China's.",
            "Barley": "Australia's barley rose 71.4% from 7.7 to 13.3 million tonnes, climbing from eighth among these ten countries to second, behind only Russia. Ukraine fell 52.1% and Canada 35.1%. Barley is Australia's fastest-growing crop of the four.",
            "Oats": "Australia's oat output barely moved, from 1.28 to 1.32 million tonnes. It only increased 2.5% and ranked fourth. Brazil rose 137.6% and the United Kingdom 57.5%, while Russia fell 39.2%. Oats are a stable and small crop for Australia, not a growth crop.",
            "Sorghum": "Australia's sorghum rose 21.5% to 2.4 million tonnes and ranked tenth. Sudan (including South Sudan) rose 135.0% to 6.4 million tonnes, and Ethiopia 135.3%. The United States and Nigeria both fell 24.2%. Africa's growth is reshaping a market where Australia is small."
        }
    },
    "STATIC": {
        "crop_share": "Wheat dominates production across almost every state, accounting for 58% to 79% of total output. Queensland is the sole exception, where sorghum took the lead with about 50% in 2023–24. Tasmania stands out as Australia's most barley-heavy state, with barley making up around 40% of its grain harvest.",
        "production_history": "Australian grain output highlights extreme harvest volatility. Wheat swung from a 1994 drought low of 9.0 million tonnes to a record 41.2 million tonnes in 2022, in a run of wet La Niña years. The grey bands mark major droughts (1967, 1982, 1994, 2002, 2006 and 2018–19), when most crops fell together. In 2020, barley hit a record 14.6 million tonnes, while sorghum plunged to just 0.4 million tonnes in a dry summer. One harvest is never a reliable guide to the next.",
        "yield_boxplot": "Yields show striking year-on-year instability. Sorghum experienced swings of 20% or more in nearly half of all years (46%), while wheat saw similar volatility in 38% of years. Wheat dropped 57% in 2002 before rebounding 121% in 2003. Because median annual changes sit near zero, long-term averages hide severe single-year harvest risks.",
        "state_change": "State harvests diverged dramatically over the past two years. Western Australia lost 7.9 million tonnes in 2023–24 before rebounding by 6.6 million tonnes in 2024–25, alongside a 6.2 million tonne gain in New South Wales. Meanwhile, South Australia suffered back-to-back losses, ending 60.0% below its 2022–23 baseline, proving how national totals mask opposing state dynamics."
    }
};

function setInsight(chartId, text) {
    document.getElementById("insight_" + chartId).textContent = text;
}

// section 2 (charts 3 to 6) have one fixed text each
Object.keys(INSIGHTS.STATIC).forEach(function(chartId) {
    setInsight(chartId, INSIGHTS.STATIC[chartId]);
});

// section 1: the text depends on the crop and the year
function updateSection1Insights(crop, year) {
    Object.keys(INSIGHTS.S1).forEach(function(chartId) {
        setInsight(chartId, INSIGHTS.S1[chartId][crop + "|" + year]);
    });
}

// sections 3 & 4: the text depends on the crop
function updateCropInsights(sectionTexts, crop) {
    Object.keys(sectionTexts).forEach(function(chartId) {
        setInsight(chartId, sectionTexts[chartId][crop]);
    });
}



// section 1 (charts 1 and 2) shares one crop control and one year control, which are in index.html
var section1Views = [];

function applySection1Controls() {
    var crop = document.getElementById("crop_select_1").value;
    var year = document.querySelector('input[name="year_1"]:checked').value;
    section1Views.forEach(function(view) {
        view.signal("crop", crop).signal("year", year).run();
    });
    updateSection1Insights(crop, year);
}

// show the texts for the starting selection straight away, before the charts have loaded
updateSection1Insights(document.getElementById("crop_select_1").value, document.querySelector('input[name="year_1"]:checked').value);

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
    updateCropInsights(INSIGHTS.S3, crop);
}

updateCropInsights(INSIGHTS.S3, document.getElementById("crop_select_3").value);

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
    updateCropInsights(INSIGHTS.S4, crop);
}

updateCropInsights(INSIGHTS.S4, document.getElementById("crop_select_4").value);

Promise.all([
    vegaEmbed("#world_yield", vg_10, vlOptions),
    vegaEmbed("#slope_chart", vg_11, vlOptions)
]).then(function(results) {
    section4Views = results.map(function(result) { return result.view; });
    document.getElementById("crop_select_4").addEventListener("change", applySection4Controls);
    applySection4Controls();   // also covers a browser that restores the old control value on reload
}).catch(console.error);