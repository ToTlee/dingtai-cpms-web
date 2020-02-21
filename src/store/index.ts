import Vue from 'vue'
import Vuex from 'vuex'

import authentication from '../authentication/authentication'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储token
    Authorization: authentication.getLocalAuthorization()
  },
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      authentication.setLocalAuthorization(user.Authorization);
    }
  },
  actions: {
  },
  modules: {
  }
})
