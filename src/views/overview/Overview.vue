<!-- 统计概览页面，根据用户角色不同显示不同的内容 -->
<template>
<div class="overview-panel">
    <user-overview></user-overview>
    <div class="statistics-panel">
        <overview-contracts v-if="true"></overview-contracts>
        <overview-customer v-if="true"></overview-customer>
        <overview-project-quotation v-if="true"></overview-project-quotation>
    </div>
    
</div>
</template>

<script>
import ContractsOverView from './ContractsOverview'
import CustomerOverview from './CustomerOverview'
import ProjectQuotationOverview from './ProjectQuotationOverview'
import UserOverview from './UserOverview'

export default {
    components: {
        "overview-contracts": ContractsOverView,
        "overview-customer": CustomerOverview,
        "overview-project-quotation": ProjectQuotationOverview,
        "user-overview":UserOverview
    }
}
</script>

<style lang="scss" scoped>
.overview-panel{
    display: flex;
    align-self: center;
    flex-direction: row;
    background-color: antiquewhite;
    max-width: 1200px;
}
.statistics-panel{
    //background-color: antiquewhite;
    flex: 1;
}
</style>