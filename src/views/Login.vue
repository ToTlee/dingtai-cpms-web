<template>
    <div class="loginBorder">
        <div class="titleBorder">{{tile}}</div>
        <img src="../assets/bg.png"/>
    </div>
</template>

<script>
import {appConstants} from '../AppConstants'

export default {
    data(){
        return {
            tile:appConstants.APP_NAME
        }
    }
}
</script>

<style lang="less" scoped>
.loginBorder{
    width: 600px;
}
.titleBorder{
    background-color: skyblue;
    height: 70px;
    font-size: 30px;
    line-height: 70px;
    text-align: center;
}
</style>