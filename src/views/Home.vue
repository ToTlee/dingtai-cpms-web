<template>
<div class="home">
    <nav-top class="nav-top"></nav-top>
    <router-view style="flex:1"></router-view>
    <nav-bottom class="nav-bottom"></nav-bottom>
</div>
</template>

<script>
// @ is an alias to /src
import NavigationBarTop from './NavigationBar/NavigationBarTop'
import NavigationBarBottom from './NavigationBar/NavigationBarBottom'

export default {
    name: 'Home',
    components: {
        "nav-top": NavigationBarTop,
        "nav-bottom": NavigationBarBottom
    },
    created() {

    },
}
</script>

<style scoped>
.home {
    width: 100%
}
</style>
