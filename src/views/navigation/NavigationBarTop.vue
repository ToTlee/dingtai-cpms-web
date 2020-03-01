<!-- 顶部导航栏 -->
<template>
  <div class="nav_top">
    <div class="app-name" @click="goHome">{{appName}}</div>
    <span class="user-panel">
      <el-dropdown style="height: 40px;">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid" style="color:white"></i>
          用户02
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid">个人信息</el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-tools">账号设置</el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-comment">意见反馈</el-dropdown-item>
          <el-dropdown-item icon="el-icon-error">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <router-link to="/login"><el-button type="text">登录</el-button></router-link> -->
    </span>
  </div>
</template>

<script>
import { appConstants } from "../../AppConstants";

export default {
  data() {
    return {
      appName: appConstants.APP_NAME
    };
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

<style lang="scss" scoped>
@import "../../element-variables.scss";

.nav_top {
  height: 60px;
  line-height: 60px;
  background-color: $--color-primary;
  color: white;
  display: flex;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-size: 16px;
}

.app-name {
  font-size: 24px;
  margin-left: 10px;
  margin-right: 6px;
  cursor: pointer;
}

.user-panel {
  text-decoration: none;
  flex: 1;
  text-align: right;
  margin-right: 18px;
  color: white;
}
</style>
