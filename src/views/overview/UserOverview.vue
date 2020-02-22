<template>
<div class="user-panel">
    <avatar :size="90" username="用户01"></avatar>
    <div class="user-name">用户01</div>
    <div class="user-description">用户01 暂无简介</div>
</div>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
    data() {
        return {

        }
    },
    components: {
        Avatar
    }
}
</script>

<style lang="scss" scoped>
.user-panel {
    width: 400px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.user-name{
    font-size: 24px;
    margin: 8px;
    font-weight: bold;
}
.user-description{
    color: #888;
}

</style>
