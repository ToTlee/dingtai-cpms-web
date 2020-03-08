<template>
  <div>
    <v-chart :options="polar" />
  </div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  contractApi,
  ResultListGetContractTimeSummaryResp,
  GetContractTimeSummaryResp
} from "@/client-api";
import Component from "vue-class-component";
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import ArrayUtils from "../../utils/arrayUtils";
@Component({
  components: {
    "v-chart": ECharts
  }
})
export default class ContractsStaticstic extends ClientDataVue {
  data: Array<any> = [];
  polar: any = {
    title: {
      text: "近一年的合同统计情况"
    },
    color: ["#3398DB"],
    toolbox: {
      show: true
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "0",
      containLabel: true
    },
    xAxis: [
      {
        type: "time",
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "合同情况",
        type: "line",
        data: []
      }
    ]
  };

  mounted() {
    this.refreshData();
  }

  async refreshData() {
    let result = await this.getData<Array<GetContractTimeSummaryResp>>(() =>
      contractApi.getContractSummaryUsingGET(2)
    );
    if (result) {
      this.polar.series[0].data = result.map(item => [item.time, item.value]);
    }
  }
}
</script>
