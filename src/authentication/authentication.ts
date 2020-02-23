import {UserInfo} from './user'

export * from  './user'

const AUTHORIZATION_KEY = 'Authorization';

export default {
  getAuthorization(){
   // let token = localStorage.getItem(AUTHORIZATION_KEY);
    let token = sessionStorage.getItem(AUTHORIZATION_KEY);
    return  token ? token : '';
  },
  setAuthorization(user:UserInfo){
    //localStorage.setItem(AUTHORIZATION_KEY, user.Authorization);
    sessionStorage.setItem(AUTHORIZATION_KEY, user.token);
  },
  useAuthentication(router: any) {
    router.beforeEach((to: any, from: any, next: any) => {
      let token = sessionStorage.getItem(AUTHORIZATION_KEY);
      if (token === null || token === '') {
        if(to.path === '/login'){
          next();
        } else{
          next('/login');
        }
      }else if(to.path === '/login'){
        next({path:'/'})
      }else{
        next();
      }
    })
  }
}