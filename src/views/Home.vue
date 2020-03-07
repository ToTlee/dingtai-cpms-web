<template>
  <el-container style="height:100%">
    <el-header class="navigation-top">
      <nav-top style="padding:0px"></nav-top>
    </el-header>
    <el-container style="overflow: auto">
      <el-aside style="width:220px">
        <el-menu
          class="main-menu"
          @select="selected"
          background-color="#1b2a46"
          text-color="#ffffff"
          default-active="customers"
        >
          <el-menu-item index="/data-view/customers" name="menu">客户管理</el-menu-item>
          <el-menu-item index="/data-view/quotation" name="menu">报价管理</el-menu-item>
          <el-menu-item index="/data-view/contracts" name="menu">合同管理</el-menu-item>
          <el-submenu index="4" name="menu">
            <template slot="title">系统管理</template>
            <el-menu-item index="/data-view/users" name="menu">用户管理</el-menu-item>
            <el-menu-item index="/data-view/roles" name="menu">角色管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="padding:0px 20px 20px 10px">
        <router-view style="flex:1;"></router-view>
      </el-main>
    </el-container>
  </el-container>

  <!-- <nav-bottom class="nav-bottom"></nav-bottom> -->
</template>

<script>
import NavigationBarTop from "@/views/navigation/NavigationBarTop";
// import Overview from './overview/Overview.vue'

export default {
  name: "Home",
  components: {
    //    'overview':Overview,
    "nav-top": NavigationBarTop
  },
  created() {},
  mounted() {
    var items = document.getElementsByName("menu");
    for (var i = 0; i < items.length; i++) {
      var perms = JSON.parse(sessionStorage.getItem("perms"));
      items[i].hidden = true;
      for (var j = 0; j < perms.length; j++) {
        if (items[i].innerHTML.search(perms[j].name) != -1) {
          items[i].hidden = false;
          break;
        }
        if (perms[j].children.length > 0) {
          for (var k = 0; k < perms[j].children.length; k++) {
            if (items[i].innerHTML.search(perms[j].children[k].name) != -1) {
              items[i].hidden = false;
              break;
            }
          }
        }
      }
    }
  },
  methods: {
    selected(index, indexPath) {
      this.$router.push(index);
    },
    goHome() {
      this.$router.push({
        path: "/"
      });
    }
  }
};
</script>

<style scoped>
.navigation-top {
  padding: 0px !important;
}
.main-menu {
  text-align: left;
  background-color: #1b2a46;
  height: 100%;
  text-align: left;
}
</style>
