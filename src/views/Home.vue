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
          default-active="/customers"
        >
          <el-menu-item index="customers">客户跟进</el-menu-item>
          <el-menu-item index="quotation">项目报价</el-menu-item>
          <el-menu-item index="contracts">合同管理</el-menu-item>
          <el-submenu index="4">
            <template slot="title">系统管理</template>
            <el-menu-item index="/users">用户管理</el-menu-item>
            <el-menu-item index="/roles">角色管理</el-menu-item>
            <el-menu-item index="4-3">系统设置</el-menu-item>
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
