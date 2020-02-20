const AUTHORIZATION_KEY = 'Authorization';

export default {
  getAuthrization(){
    let token = localStorage.getItem(AUTHORIZATION_KEY);
    return  token ? token : '';
  },
  setAuthrization(user:any){
    localStorage.setItem(AUTHORIZATION_KEY, user.Authorization);
  },
    useAuthentication(router: any) {
        router.beforeEach((to: any, from: any, next: any) => {
            if (to.path === '/login') {
                next();
              } else {
                let token = localStorage.getItem(AUTHORIZATION_KEY);
             
                if (token === null || token === '') {
                  next('/login');
                } else {
                  next();
                }
              }
        })
    }
}