<template>
  <div ref="chart" style="width:600px;height:400px"></div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  contractApi,
  ResultListGetContractTimeSummaryResp,
  GetContractTimeSummaryResp
} from "@/client-api";
import Component from "vue-class-component";
import ArrayUtils from "../../utils/arrayUtils";
import echarts from "echarts";
let chart: echarts.ECharts | undefined = undefined;
@Component
export default class ContractsStaticstic extends ClientDataVue {
  data: Array<any> = [];

  mounted() {
    chart = echarts.init(this.$refs.chart as HTMLDivElement);
    this.refreshData();
  }

  async refreshData() {
    let result = await this.getData<Array<GetContractTimeSummaryResp>>(() =>
      contractApi.getContractSummaryUsingGET(2)
    );
    if (result) {
      let polar: echarts.EChartOption = {
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
            data: result.map(item => [item.time, item.value])
          }
        ]
      };
      chart!.setOption(polar);
    }
  }
}
</script>
