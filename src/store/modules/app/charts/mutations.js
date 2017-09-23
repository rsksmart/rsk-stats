export const MINIMIZE_CHART = (state, name) => {
  state.charts[name] = true
}

export const MAXIMIZE_CHART = (state, name) => {
  state.charts[name] = false
}
