/* Embeds every Vega-Lite / Vega specification in /js/vega_lite and /js/vega, and adds the play buttons.
   A shared theme keeps fonts, axis styling and colours consistent across all charts. */

const CENSUS_YEARS = [1911, 1921, 1933, 1947, 1954, 1961, 1966, 1971, 1976, 1981,
  1986, 1991, 1996, 2001, 2006, 2011, 2016, 2021];

const INK = "#1f2933";
const INK_2 = "#4a5563";
const MUTED = "#6e7783";
const GRID = "#e6dfd3";
const FONT = "'Source Sans 3', 'Segoe UI', Helvetica, Arial, sans-serif";

const theme = {
  background: null,
  font: FONT,
  padding: { top: 6, right: 6, bottom: 6, left: 6 },
  view: { stroke: null },
  title: { font: FONT, fontSize: 15, fontWeight: 700, color: INK, anchor: "start" },
  axis: {
    labelFont: FONT,
    labelFontSize: 12,
    labelColor: MUTED,
    titleFont: FONT,
    titleFontSize: 12,
    titleFontWeight: 600,
    titleColor: INK_2,
    gridColor: GRID,
    gridWidth: 0.8,
    domainColor: "#cbc3b5",
    tickColor: "#cbc3b5",
    labelPadding: 4
  },
  legend: {
    labelFont: FONT,
    labelFontSize: 12,
    labelColor: INK_2,
    titleFont: FONT,
    titleFontSize: 12,
    titleFontWeight: 600,
    titleColor: INK_2,
    symbolStrokeWidth: 0
  },
  header: {
    labelFont: FONT,
    labelFontSize: 12,
    labelColor: INK_2,
    titleFont: FONT
  },
  text: { font: FONT, fontSize: 12, color: INK_2 },
  range: {
    category: ["#2a78d6", "#d2553a", "#1a9e8a", "#e09f1f", "#a04c96", "#5a8f2e"]
  }
};

const SPECS = [
  { el: "#vis-growth", url: "js/vega_lite/01_population_growth.vg.json" },
  { el: "#vis-cities", url: "js/vega_lite/02_city_symbol_map.vg.json" },
  { el: "#vis-heatmap", url: "js/vega_lite/03_state_growth_heatmap.vg.json" },
  { el: "#vis-lga", url: "js/vega_lite/04_lga_choropleth.vg.json" },
  { el: "#vis-dots", url: "js/vega_lite/05_population_dot_map.vg.json", renderer: "canvas" },
  { el: "#vis-ridgeline", url: "js/vega_lite/06_age_ridgeline.vg.json" },
  { el: "#vis-pyramid", url: "js/vega_lite/07_age_pyramid.vg.json" },
  { el: "#vis-fertility", url: "js/vega_lite/08_fertility_life_connected_scatter.vg.json" },
  { el: "#vis-waffle", url: "js/vega_lite/09_born_overseas_waffle.vg.json" },
  { el: "#vis-bump", url: "js/vega_lite/10_birthplace_bump_chart.vg.json" },
  { el: "#vis-flows", url: "js/vega_lite/11_birthplace_flow_map.vg.json" },
  { el: "#vis-religion-trend", url: "js/vega_lite/12_religion_trend.vg.json" },
  { el: "#vis-religion-treemap", url: "js/vega/13_religion_treemap.vega.json" },
  { el: "#vis-indigenous", url: "js/vega_lite/14_indigenous_census_counts.vg.json" }
];

const views = {};

const embedded = SPECS.map(({ el, url, renderer }) =>
  vegaEmbed(el, url, { actions: false, config: theme, renderer: renderer || "svg" })
    .then((result) => { views[el] = result.view; })
    .catch((err) => console.error(url, err))
);

/* Play button: steps a slider parameter through the Census years (about one per second). */
function addPlayButton(buttonId, viewKey, signalName) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  let timer = null;

  const stop = () => {
    clearInterval(timer);
    timer = null;
    button.textContent = "▶ Play 1911–2021";
  };

  button.addEventListener("click", () => {
    const view = views[viewKey];
    if (!view) return;
    if (timer) { stop(); return; }
    let i = 0;
    button.textContent = "❚❚ Pause";
    const step = () => {
      view.signal(signalName, CENSUS_YEARS[i]).runAsync();
      i += 1;
      if (i >= CENSUS_YEARS.length) stop();
    };
    step();
    timer = setInterval(step, 900);
  });
}

Promise.all(embedded).then(() => {
  addPlayButton("play-cities", "#vis-cities", "cityYear");
  addPlayButton("play-pyramid", "#vis-pyramid", "pyramidYear");
});
