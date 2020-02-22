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
