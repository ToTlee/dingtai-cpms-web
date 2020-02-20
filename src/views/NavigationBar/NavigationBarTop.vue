<!-- 顶部导航栏 -->
<template>
<div>
    <div class="nav_top">
        {{appName}}
    </div>
</div>
</template>

<script>
import {
    appConstants
} from '../../AppConstants'

export default {
    data() {
        return {
            appName: appConstants.APP_NAME
        }
    }
}
</script>

<style scoped>
.nav_top {
    height: 60px;
}
</style>
