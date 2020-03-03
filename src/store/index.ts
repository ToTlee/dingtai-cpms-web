import Vue from "vue";
import Vuex from "vuex";

import authentication from "../authentication/authentication";
import { UserInfo } from "../authentication/authentication";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 存储token
    authToken: authentication.getAuthorization(),
    dataViewTitle: "操作面板"
  },
  mutations: {
    // 修改token，并将token存入localStorage
    CHANGE_LOGIN(state, user: UserInfo) {
      state.authToken = user.token;
      authentication.setAuthorization(user);
    },
    changeDataViewTitle(state, title: string) {
      state.dataViewTitle = title;
    }
  },
  actions: {},
  modules: {}
});
