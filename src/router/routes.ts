import Home from "../views/Home.vue";
import Contracts from "../views/contracts/Index.vue";
import Contracts1 from "../views/contracts/Contracts.vue";
import DataView from "../views/data-view/DataView.vue";

import { appConstants } from "../AppConstants";

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        name: appConstants.APP_NAME,
        redirect: "data-view/customers"
      },
      {
        path: "data-view",
        component: DataView,
        children: [
          {
            path: "contracts",
            name: "合同管理",
            component: () => import("../views/contracts/Contracts.vue")
          },
          {
            path: "quotation",
            name: "项目报价",
            component: () => import("../views/quotation/QuotationList.vue")
          },
          {
            path: "customers",
            name: "客户资料",
            component: () => import("../views/customer/Customers.vue")
          },
          {
            path: "users",
            name: "用户管理",
            component: () => import("../views/systemmanage/UsersIndex.vue")
          },
          {
            path: "roles",
            name: "角色管理",
            component: () => import("../views/customer/Customers.vue")
          }
        ]
      },
      {
        path: "/contracts",
        name: "合同管理",
        component: Contracts
      },
      {
        path: "/quotation",
        name: "项目报价",
        component: () => import("../views/quotation/Index.vue")
      },
      {
        path: "/customers",
        name: "客户资料",
        component: () => import("../views/customer/Index.vue")
      },
      {
        path: "/users",
        name: "用户管理",
        component: () => import("../views/systemmanage/UsersIndex.vue")
      },
      {
        path: "/roles",
        name: "角色管理",
        component: () => import("../views/systemmanage/RolesIndex.vue")
      }
    ]
  },

  {
    path: "/about",
    name: "关于",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("../views/Login.vue")
  }
];

export default routes;
