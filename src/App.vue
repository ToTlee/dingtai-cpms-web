<template>
<div id="app">
    <router-view style="flex:1"></router-view>
</div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'app',
    components: {
       
    }
}
</script>

<style lang='scss'>
@import './element-variables.scss';
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-title{
    padding-top: 8px;
    font-size: 22px;
    color: $--color-primary;
}
</style>
