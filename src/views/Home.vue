<template>
  <div class="home">
    <nav-top></nav-top>
    <div class="nav-mid">
      <div class="main-menu">
        <el-menu @select="selected" background-color="#1b2a46" text-color="#ffffff" default-active="/customers">
          <el-menu-item index="/customers">
            客户跟进
          </el-menu-item>
          <el-menu-item index="/quotation">
            项目报价
          </el-menu-item>
          <el-menu-item index="/contracts">
            合同管理
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">系统管理</template>
            <el-menu-item index="4-1">用户管理</el-menu-item>
            <el-menu-item index="4-2">权限管理</el-menu-item>
            <el-menu-item index="4-3">系统设置</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <router-view style="flex:1;overflow:auto"></router-view>
    </div>
    <!-- <nav-bottom class="nav-bottom"></nav-bottom> -->
  </div>
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
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-mid {
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
}

.main-menu {
  text-align: left;
  background-color: #1b2a46;
  margin-right: 10px;
  overflow: auto;
}

.main-menu .el-menu {
  width: 200px;
  height: 100%;
}
</style>
