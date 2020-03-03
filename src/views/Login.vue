<template>
  <div class="login-root">
    <div class="titleBorder">{{title}}</div>
    <div class="login-border">
      <div class="login-title">用户登录</div>
      <div class="login-panel">
        <!-- <div class="logo-info">
                <img class="bg-img" src="../assets/login_bg.png" />
        </div>-->
        <div class="login-part">
          <el-form>
            <el-form-item>
              <el-input placeholder="请输入用户名" v-model="userName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <div class="dock-panel">
                <el-input placeholder="请输入验证码" v-model="captcha"></el-input>
                <img :src="captchaUrl" class="captcha-img" title="点击刷新验证码" @click="changeCaptcha" />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" style="width:100%" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appConstants } from "../AppConstants";

import {
  loginApi,
  LoginControllerApiFetchParamCreator,
  LoginReq
} from "../client/data-provider";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      title: appConstants.APP_NAME,
      captchaUrl: "",
      userName: "",
      password: "",
      captcha: ""
    };
  },
  mounted() {
    this.changeCaptcha();
  },
  created: function() {
    let that = this;
    document.onkeypress = function(e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.login();
        return false;
      }
    };
  },
  methods: {
    ...mapMutations(["CHANGE_LOGIN"]),
    changeCaptcha() {
      let relativeUrl = LoginControllerApiFetchParamCreator(
        loginApi.configuration
      ).captchaUsingGET().url;
      this.captchaUrl =
        loginApi.basePath + relativeUrl + "?i=" + new Date().getTime();
    },
    async login() {
      let userReq = {
        userName: this.userName,
        captcha: this.captcha,
        password: this.password
      };
      let result = await loginApi.loginUsingPOST(userReq);
      if (result.status == 0) {
        let userInfo = {
          name: this.userName,
          token: this.userName
        };
        this.CHANGE_LOGIN(this.$store.state, userInfo);
        sessionStorage.setItem("userName", this.userName);
        this.$router.push({
          path: "/"
        });
      } else {
        this.$message.error(result.msg);
        this.changeCaptcha();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../element-variables.scss";

.login-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  min-height: 540px;
  min-width: 840px;
  text-align: center;
  background-image: url("../assets/login-bg2.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.login-border {
  width: 340px;
  height: 380px;
  box-shadow: 0px 20px 80px 0px #0000004d;
  border-radius: 6px;
  background-color: #e1fcff;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  margin-right: 8%;
  padding-top: 12px;
}

.bg-img {
  width: 100%;
  height: 100%;
}

.titleBorder {
  align-self: start;
  margin: 6%;
  color: #0072ff;
  font-size: 60px;
  font-family: "华文行楷";
  position: absolute;
}

.login-title {
  color: $--color-primary;
  font-size: 30px;
}

.login-part {
  padding: 10px;
  width: 280px;
  // display: flex;
  // align-items: center;
  margin-top: 10px;
}

.login-panel {
  flex: 1;
  display: flex;
  justify-content: center;
}

.logo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dock-panel {
  display: flex;
}

.login-part .el-form-item {
  margin-bottom: 18px;
}

.captcha-img {
  width: 120px;
  cursor: pointer;
  margin-left: 8px;
}
</style>
