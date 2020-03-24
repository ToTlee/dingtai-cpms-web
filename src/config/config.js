//项目域名地址
const PROD_URL = "http://106.54.69.174:8080/admin";

let ROOT;
//为了方便之后不再更改，判断了当前环境，而生成的不同的ROOT
if (process.env.NODE_ENV === "development") {
  //开发环境下的代理地址，解决本地跨域跨域，配置在vue.config.js里
  ROOT = "/admin";
} else {
  //生产环境下的地址
  ROOT = PROD_URL;
}

exports.PROD_URL = PROD_URL; //代理指向地址
exports.URL_ROOT = ROOT;
// export default { ROOT, URL };
