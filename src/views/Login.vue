<template>
<div class="login-root">
    <div class="login-border">
        <div class="titleBorder">{{tile}}</div>
        <div class="login-panel">
            <div class="logo-info">
                <img class="bg-img" src="../assets/login_bg.png"/>
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

export default {
    data() {
        return {
            tile: appConstants.APP_NAME
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
    box-shadow: 0px 20px 80px 0px rgba(0,0,0,0.3);
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
.login-panel{
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

.dock-panel{
    display: flex;
}

.login-part .el-form-item {
    margin-bottom: 10px;
}
</style>
