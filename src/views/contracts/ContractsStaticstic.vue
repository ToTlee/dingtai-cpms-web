<template></template>

<script lang="ts">
import { ClientDataVue } from "@/client-api";
import ECharts from "vue-echarts";
import Component from "vue-class-component";

@Component({
  components: {
    "v-charts": ECharts
  }
})
export default class ContractsStaticstic extends ClientDataVue {}
</script>
