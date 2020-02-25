<!-- 合同管理模块 -->
<template>
<div class="customer-root">
    <div class="page-title">客户跟进</div>
    <div class="customer-tools">
        <el-button type="primary" size="small">客户资料</el-button>
        <el-button type="primary" size="small">添加</el-button>
    </div>
    <div class="customer-content">
        <customers></customers>
    </div>
</div>
</template>

<script lang="ts">
import {ClientDataVue} from '@/client/client-types'
import {Component} from  'vue-property-decorator'
import Customers from './Customers.vue'

@Component({
    components:{
        "customers":Customers
    }
})
export default class Index extends ClientDataVue{
    
};
</script>

<style lang="scss" scoped>
.customer-root {
    display: flex;
    width: 100%;
    flex-direction: column;
}

.customer-tools {
    display: flex;
    flex-direction: row;
    margin-top: 4px;
    margin-bottom: 10px;
}

.customer-content {
    flex: 1;
    padding: 8px;
}
</style>
