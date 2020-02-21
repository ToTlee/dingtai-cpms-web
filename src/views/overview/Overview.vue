<template>
    <div>
        <overview-contracts v-if="true"></overview-contracts>
        <overview-customer v-if="true"></overview-customer>
        <overview-project-quotation v-if="true"></overview-project-quotation>
    </div>

</template>

<script>
import ContractsOverView from './ContractsOverview'
import CustomerOverview from './CustomerOverview'
import ProjectQuotationOverview from './ProjectQuotationOverview'

export default {
    components:{
        "overview-contracts":ContractsOverView,
        "overview-customer":CustomerOverview,
        "overview-project-quotation":ProjectQuotationOverview
    }
}
</script>