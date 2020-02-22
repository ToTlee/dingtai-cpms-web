import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/vue-echarts.js'

import * as client from './client/index'

Vue.config.productionTip = false

Vue.prototype.$dataApi = client.UserControllerApiFp();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
