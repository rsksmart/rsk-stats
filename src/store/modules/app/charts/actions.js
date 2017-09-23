import * as types from '../types'

export const createChartDialog = ({ state, commit, dispatch }, dialog) => {
  dialog.type = types.CHART
  dispatch('app/createDialog', dialog, { root: true })
}

export const maximizeChart = ({ state, commit, dispatch, rootGetters }, name) => {
  let size = rootGetters.getSize
  let dialog = {
    id: name,
    width: size.w / 2.1,
    height: size.w / 6,
    centered: 'viewport'
  }
  commit('MAXIMIZE_CHART', name)
  dispatch('createChartDialog', dialog)
}

export const minimizeChart = ({ commit }, name) => {
  commit('MINIMIZE_CHART', name)
}
