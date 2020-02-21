<template>
<div class="home">
    <overview></overview>
</div>
</template>

<script>

import Overview from '../views/overview/Overview.vue'

export default {
    name: 'Home',
    components: {
       'overview':Overview
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
