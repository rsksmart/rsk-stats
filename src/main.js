// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import VueSVGIcon from 'vue-svgicon'
import App from './App.vue'

Vue.use(VueSVGIcon, { tagName: 'icon' })
Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
