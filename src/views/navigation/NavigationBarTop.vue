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
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :center="true"
        title="修改密码"
        width="fit-content"
        height="fit-content"
        :show-close="true"
      >
        <div class="form-root">
          <el-form label-width="100px" size="small">
            <el-form label-width="100px" size="small">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="原密码:" required>
                    <el-input show-password v-model="form.oldPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="新密码:" required>
                    <el-input show-password v-model="form.newPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="重复新密码:" required>
                    <el-input show-password v-model="form.confirmPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item size="normal">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-form>
        </div>
      </el-dialog>
      <!-- <router-link to="/login"><el-button type="text">登录</el-button></router-link> -->
    </span>
  </div>
</template>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script  >
import { appConstants } from "../../AppConstants";
import {
  loginApi,
  userApi,
  LoginControllerApiFetchParamCreator,
  LoginReq,
  UpdatePwdReq
} from "../../client/data-provider";
import { mapMutations } from "vuex";
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
      this.dialogFormVisible = true;
    },

    async save() {
      let data = {
        newPassword: this.form.newPassword,
        oldPassword: this.form.oldPassword,
        userId: this.form.userId
      };
      var result = await userApi.updatePasswordUsingPOST(data);
      debugger;
      if (result.status == 0) {
        sessionStorage.clear();
        this.$router.push({
          path: "/login"
        });
      } else {
        this.$message.warning(result.msg);
      }
    },
    cancel() {
      this.dialogFormVisible = false;
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
.form-root {
  width: 660px;
  text-align: left;
  max-height: 700px;
  overflow: auto;
}
.form-root .el-form-item {
  margin-bottom: 10px;
}
.info-header {
  font-size: 15px;
  color: $--color-primary;
}
.timeline {
  margin-top: 10px !important;
  padding: 0px !important;
}

.period-title {
  font-weight: bold;
}
.period-content {
  color: gray;
}
</style>
