import Vue from 'vue'
import VueRouter from 'vue-router'


import authentication from '../authentication/authentication'
import routes from './routes'

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});
// authentication.useAuthentication(router);

export default router;
