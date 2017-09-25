export const SET_RENDERED_ENTITY = (state, entity) => {
  state.renderedEntities[entity.id] = entity
}
