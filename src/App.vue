<template>
<div id="app">
    <nav-top class="nav-top"></nav-top>
    <router-view style="flex:1"></router-view>
    <nav-bottom class="nav-bottom"></nav-bottom>
</div>
</template>

<script>
// @ is an alias to /src
import NavigationBarTop from './views/navigationBar/NavigationBarTop'
import NavigationBarBottom from './views/navigationBar/NavigationBarBottom'
export default {
    name: 'app',
    components: {
        "nav-top": NavigationBarTop,
        "nav-bottom": NavigationBarBottom
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
