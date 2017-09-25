export const renderEntities = ({ state, dispatch }) => {
  for (let name in state.entities) {
    dispatch('createEntity', name)
  }
}

export const createEntity = ({ state, commit, getters }, name) => {
  let entity = state.entities[name]
  if (entity) {
    entity.title = entity.title || name
    entity.id = name
    let threshold = entity.threshold
    if (threshold) {
      let thObj = state.thresholds[threshold]
      if (thObj) {
        let defaultFunc = () => { }
        let colorFunc = getters.thresholdColors(threshold)
        thObj.colorFunc = colorFunc || defaultFunc
        entity.thresholdObj = thObj
      }
    }
    commit('SET_RENDERED_ENTITY', entity)
  }
}
