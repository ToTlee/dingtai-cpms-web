<!-- 项目报价主页 -->
<template>
<div class="quotation-root">
    <div class="page-title">项目报价标准</div>
    <div class="quotation-tools">
        <el-button type="primary" size="small">添加</el-button>
        <el-button type="primary" size="small">管理项</el-button>
    </div>
    <div class="quotation-content">
        <quotation-list></quotation-list>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import QuotationList from './QuotationList.vue'
import Component from 'vue-class-component'

@Component({
    components: {
        "quotation-list": QuotationList
    }
})
export default class Quotation extends Vue {

}
</script>

<style lang="scss" scoped>
.quotation-root {
    display: flex;
    flex-direction: column;
}

.quotation-tools {
    display: flex;
    flex-direction: row;
    margin-top: 4px;
    margin-bottom: 10px;
}

.quotation-content {
    flex: 1;
    padding: 8px;
}
</style>
