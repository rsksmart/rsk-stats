export const charts = (state, getters, rootState, rootGetters) => {
  return rootGetters.getCharts
}

export const getChart = (state, getters) => name => {
  let chart = state.definitions[name]
  if (chart) {
    chart.data = getters.charts[name]
    return chart
  }
}
