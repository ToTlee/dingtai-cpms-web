<!-- 合同管理模块 -->
<template>
<div class="contracts-root">
        <div class="page-title">项目合同信息</div>
    <div class="contracts-tools">
        <el-button type="primary" size="small">客户资料</el-button>
        <el-button type="primary" size="small">添加</el-button>
    </div>
    <div class="contracts-content">
        <contracts></contracts>
    </div>
</div>
</template>

<script>
import Customers from './Customers'
import Contracts from './Contracts'

export default {
    data() {
        return {

        }
    },
    components: {
        Customers,
        Contracts
    }
}
</script>

<style lang="scss" scoped>
.contracts-root {
    display: flex;
    flex-direction: column;
}

.contracts-tools {
    display: flex;
    flex-direction: row;
}

.contracts-content {
    flex: 1;
}
</style>
