<!-- 顶部导航栏 -->
<template>
<div class="nav_top">
    <div class="app-name">
        {{appName}}
    </div>
    <el-menu mode="horizontal" class="main-menu">
        <el-menu-item index="1">
            项目报价
        </el-menu-item>
        <el-menu-item index="2">
            合同管理
        </el-menu-item>
        <el-menu-item index="3">
            客户跟进
        </el-menu-item>
        <el-submenu index="4">
            <template slot="title">关于</template>
            <el-menu-item index="4-1">关于项目报价</el-menu-item>
            <el-menu-item index="4-2">关于合同管理</el-menu-item>
            <el-menu-item index="4-3">关于客户跟进</el-menu-item>
        </el-submenu>
    </el-menu>
    <span class="user-panel">
        <el-dropdown style="height: 40px;">
            <span class="el-dropdown-link">
                <i class="el-icon-user-solid"></i>
                用户01
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
import {
    appConstants
} from '../../AppConstants'

export default {
    data() {
        return {
            appName: appConstants.APP_NAME
        }
    },
    methods: {
        login() {
            this.$router.go("/login");
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../element-variables.scss';
.nav_top {
    height: 60px;
    line-height: 60px;
    color: $--color-primary;
    display: flex;
}
 .el-dropdown-link {
    cursor: pointer;
  }
.app-name {
    font-size: 20px;
    margin-left: 10px;
    margin-right: 6px;
}

.main-menu {
    flex: 1;
}

.user-panel {
    text-decoration: none;
    margin-right: 18px;

}
</style>
