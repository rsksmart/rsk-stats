export const charts = (state, getters, rootState, rootGetters) => {
  return rootGetters.getCharts
}
/* eslint-disable no-unused-vars */
export const getChart = (state, getters, rootState, rootGetters) => name => {
  let chart = state.definitions[name]
  if (chart) {
    chart.data = getters.charts[name]
    chart.options = chart.options || {}
    if (chart.entity) {
      let entity = rootGetters['app/entity/getEntity'](chart.entity)
      let applyFilters = rootGetters['app/entity/applyFilter']
      // get options from entity
      if (entity) {
        chart.title = chart.title || entity.title
        chart.yUnits = chart.yUnits || entity.suffix
        chart.icon = chart.icon || entity.icon
        let thresholdObj = entity.thresholdObj || {}
        let options = {
          colorFunc: thresholdObj.colorFunc,
          formatY: (y) => {
            return applyFilters(entity.filters, y)
          }
        }
        // respect explicit charts configurations
        for (let op in options) {
          if (!chart.options[op]) chart.options[op] = options[op]
        }
      }
    }
    return chart
  }
}
