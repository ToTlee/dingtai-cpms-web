<!-- 顶部导航栏 -->
<template>
  <div class="nav_top">
    <div class="app-name" @click="goHome">{{appName}}</div>
    <span class="user-panel">
      <el-dropdown style="height: 40px;">
        <span class="el-dropdown-link">
          <i class="el-icon-user-" style="color:white"></i>
          {{userName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" @click.native="modifyPwd">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-error" @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog
        title="修改密码"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        @close="cancel('ruleForm')"
      >
        <el-form class="passwordForm" :model="form" ref="ruleForm">
          <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPassword">
            <el-input v-model="form.oldPassword" auto-complete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input v-model="form.newPassword" auto-complete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" auto-complete="off" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <router-link to="/login"><el-button type="text">登录</el-button></router-link> -->
    </span>
  </div>
</template>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script>
import { appConstants } from "../../AppConstants";
import {
  loginApi,
  LoginControllerApiFetchParamCreator,
  LoginReq
} from "../../client/data-provider";
import { mapMutations } from "vuex";
import { ModifyPass } from "../systemmanage/ModifyPass.vue";
export default {
  data() {
    return {
      appName: appConstants.APP_NAME,
      userName: sessionStorage.getItem("userName"),
      dialogFormVisible: false,
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        userId: 0
      }
    };
  },
  methods: {
    ...mapMutations(["CHANGE_LOGIN"]),
    selected(index, indexPath) {
      this.$router.push(index);
    },
    goHome() {
      this.$router.push({
        path: "/"
      });
    },
    async logout() {
      let result = await loginApi.logoutUsingGET();
      if (result.status == 0) {
        sessionStorage.clear();

        this.$router.push({
          path: "/login"
        });
      } else {
        this.$message.error(result.msg);
      }
    },
    modifyPwd() {
      debugger;
      this.dialogFormVisible = true;
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
.header .passwordForm {
  text-align: center;
  padding: 0 40px;
}

.header .passwordForm .el-input {
  /* width: 85%; */
}

.header .passwordForm .el-form-item {
  margin-bottom: 35px;
  width: 100%;
}

.header .passwordForm .el-form-item__content {
  margin-left: 100px !important;
}

.header .passwordForm .el-form-item__label {
  width: 100px !important;
}
</style>
