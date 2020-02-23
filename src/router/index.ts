import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'


import authentication from '../authentication/authentication'
import routes from './routes'

Vue.use(VueRouter);

export class AuthVueRouter extends VueRouter {
  constructor(option?: RouterOptions) {
    super(option);
  }

  clearLogin(): void {
    authentication.setAuthorization({
      name: '',
      token: ''
    });
    this.push({path:'/login'});
  }
}

const router = new AuthVueRouter({
  routes
});
authentication.useAuthentication(router);

export default router;
