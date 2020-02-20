<template>
<div id="app">
    <nav-top class="nav-top"></nav-top>
    <router-view style="flex:1"></router-view>
    <nav-bottom class="nav-bottom"></nav-bottom>
</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavigationBarTop from './views/NavigationBar/NavigationBarTop'
import NavigationBarBottom from './views/NavigationBar/NavigationBarBottom'

export default {
    name: 'app',
    components: {
        HelloWorld,
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
    color: #2c3e50;
    height: 100%;
    display: flex;
    flex-direction: column;
}

</style>
