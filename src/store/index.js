import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'
import socket from '../socket.js'
import backend from './modules/backend/'
import app from './modules/app/'
import socketPlugin from './socketPlugin.js'
const wsPlugin = socketPlugin(socket)

Vue.use(Vuex)
// Vue.prototype.$socket = socket

const store = new Vuex.Store({
  strict: false, // <-- review all components and set to true
  state: state(),
  getters,
  actions,
  mutations,
  plugins: [wsPlugin],
  modules: {
    app,
    backend
  }
})

export default store
