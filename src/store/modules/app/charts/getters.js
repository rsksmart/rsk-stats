export const charts = (state, getters, rootState, rootGetters) => {
  return rootGetters.getCharts
}

export const getChart = (state, getters) => name => {
  let chart = state.chartsDefinitions[name]
  if (chart) {
    chart.data = getters.charts[name]
    return chart
  }
}
