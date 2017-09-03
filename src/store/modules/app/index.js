import State from './state.js'
import * as types from './types.js'
import * as mutations from './mutations.js'
import * as actions from './actions.js'
import * as getters from './getters.js'
import entity from './entity'
import nodesTable from './nodesTable'
import charts from './charts'
const state = State(types)
export default {
  state,
  mutations,
  actions,
  getters,
  modules: {
    entity,
    nodesTable,
    charts
  }
}
