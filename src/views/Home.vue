<template>
<div class="home">
    <nav-top class="nav-top"></nav-top>
    <router-view style="flex:1"></router-view>
    <nav-bottom class="nav-bottom"></nav-bottom>
</div>
</template>

<script>
import NavigationBarTop from './navigationBar/NavigationBarTop'
import NavigationBarBottom from './navigationBar/NavigationBarBottom'

// import Overview from './overview/Overview.vue'

export default {
    name: 'Home',
    components: {
    //    'overview':Overview,
        "nav-top": NavigationBarTop,
        "nav-bottom": NavigationBarBottom
    },
    created() {

    },
}
</script>

<style scoped>
.home {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
