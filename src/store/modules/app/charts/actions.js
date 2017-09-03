import * as types from '../types'

export const createChartDialog = ({ state, commit, dispatch }, dialog) => {
  dialog.type = types.CHART
  dispatch('app/createDialog', dialog, { root: true })
}

