<template>
<div class="login-root">
    <div class="login-border">
        <div class="titleBorder">{{title}}</div>
        <div class="login-panel">
            <div class="logo-info">
                <img class="bg-img" src="../assets/login_bg.png" />
            </div>
            <div class="login-part">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="dock-panel">
                            <el-input placeholder="请输入验证码"></el-input>
                            <img :src="captchaUrl" class="captcha-img" title="点击刷新验证码" @click="changeCaptcha" />
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="dock-panel">
                            <el-checkbox style="flex:1;text-align:left;">记住我</el-checkbox>
                            <el-button style="flex:1;text-align:right;" type="text">忘记密码？</el-button>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" style="width:100%">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    appConstants
} from '../AppConstants'

import {
    loginApi,
    LoginControllerApiFetchParamCreator
} from '../client/data-provider'

export default {
    data() {
        return {
            title: appConstants.APP_NAME,
            captchaUrl: ''
        }
    },
    mounted() {
        this.changeCaptcha();
    },
    methods: {
        changeCaptcha() {
            let relativeUrl = LoginControllerApiFetchParamCreator(loginApi.configuration).captchaUsingGET().url;
            this.captchaUrl = loginApi.basePath + relativeUrl + "?i="+new Date().getTime();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../element-variables.scss';

.login-root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 800px;
    background-color: #fcfcfc;
}

.login-border {
    width: 800px;
    height: 500px;
    box-shadow: 0px 20px 80px 0px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    background-color: white;
    display: flex;
    flex-direction: column;
    margin-top: -30px;
    padding-top: 12px
}

.bg-img {
    width: 100%;
    height: 100%;
}

.titleBorder {
    color: $--color-primary;
    font-size: 36px;
}

.login-part {
    padding: 10px;
    width: 280px;
    // display: flex;
    // align-items: center;
    margin-top: 30px;
}

.login-panel {
    flex: 1;
    display: flex;
    margin-top: 16px;

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
    margin-bottom: 10px;
}

.captcha-img {
    width: 120px;
    cursor: hand;
    margin-left: 8px;
}
</style>
