<template>
  <div class="detail-root">
    <el-row>
      <el-col :span="12">
        <div>实验参数</div>
        <el-table
          class="table"
          :data="data.basic"
          :show-header="false"
          size="mini"
          border
          :cell-style="{padding:'1px'}"
          :row-style="{height:'10px'}"
        >
          <el-table-column prop="label"></el-table-column>
          <el-table-column prop="value"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
      <el-col :span="12">
        <div>检测指标</div>
        <el-table
          class="table"
          :data="data.testing"
          size="mini"
          border
          :cell-style="{padding:'1px'}"
        >
          <el-table-column prop="label" label="检测指标"></el-table-column>
          <el-table-column prop="value" label="次数"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
    </el-row>
    <el-table
      ref="table"
      class="table"
      :data="data.prices"
      default-expand-all
      :tree-props="{children: 'children'}"
      row-key="id"
      size="mini"
      border
      height="360px"
      show-summary
      :summary-method="getSummaries"
      :cell-style="{padding:'1px'}"
    >
      <el-table-column prop="label">
        <template slot-scope="scope">
          <span>{{scope.row.children ? scope.row.label:""}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="内容"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column label="总计"></el-table-column>
      <el-table-column label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  quotationInventoryApi,
  QuotationExperimentEntity,
  quotationExperimentApi,
  GetQuotationInfoResp
} from "@/client-api";
import { Component, Prop } from "vue-property-decorator";
import { QuotationDetailInfo, createTempInfo, QuotaionItem } from "./quotation";
import { TableColumn, Table } from "element-ui";

const store = {
  props: [
    "组数",
    "动物数量（只）",
    "伴随TK动物数量",
    "检疫适应期",
    "给药次数",
    "给药期天数",
    "恢复天数",
    "每只动物采血点",
    "采血周期",
    "TK样本量"
  ],
  propsValues: [4, 400, 40, 7, 728, 728, 0, 8, 3, 780],
  tests: [
    "体重检测",
    "摄食检测",
    "体温检测",
    "心电检测",
    "眼科检查",
    "临床检验"
  ],
  testsValues: [105, 104, 0, 0, 3, 1],
  quotaions: [
    {
      name: "In-Life阶段",
      children: [
        {
          name: "动物费用",
          price: 3500
        },
        {
          name: "动物房费用",
          price: 833
        },
        {
          name: "饲养费用",
          price: 10
        },
        {
          name: "给药费用",
          price: 20
        },
        {
          name: "临床观察",
          price: 5
        },
        {
          name: "体重检测",
          price: 10
        },
        {
          name: "摄食检测",
          price: 5
        },
        {
          name: "体温检测",
          price: 10
        },
        {
          name: "心电检测",
          price: 100
        },
        {
          name: "眼科检查",
          price: 50
        },
        {
          name: "临床检验",
          price: 400
        },
        {
          name: "制剂配制",
          price: 100
        },
        {
          name: "TK样本采集",
          price: 50
        }
      ]
    },
    {
      name: "临床病理",
      children: [
        {
          name: "大体解剖",
          price: 100
        },
        { name: "组织病理", price: 1500 }
      ]
    },
    {
      name: "方案及报告",
      children: [
        { name: "研究方案", price: 40000 },
        { name: "研究报告", price: 40000 }
      ]
    },
    ,
    {
      name: "生物样本",
      price: 200
    },
    {
      name: "其他"
    },
    {
      name: "合计"
    },
    {
      name: "合计*1.2"
    },
    {
      name: "取整"
    }
  ],
  simpleQuotaions: []
};
@Component
export default class QuotationDetail extends ClientDataVue {
  @Prop({ type: Object, required: true })
  info!: GetQuotationInfoResp;
  data: QuotationDetailInfo = { basic: [], testing: [], prices: [] };
  async mounted() {
    let data = createTempInfo();
    let experimentResult = await this.getData<QuotationExperimentEntity>(() =>
      quotationExperimentApi.getQuotationExperimentByIdUsingGET(this.info.id!)
    );
    if (experimentResult) {
      data.basic.forEach(b => {
        b.value = experimentResult![b.id];
      });
      data.testing.forEach(b => {
        b.value = experimentResult![b.id];
      });
    }

    let priceResult = await this.getData<QuotationExperimentEntity>(() =>
      quotationInventoryApi.getUnitQuotationInventoryByIdUsingGET(this.info.id!)
    );
    if (priceResult) {
      data.prices.forEach(p => {
        if (p.children) {
          p.children.forEach(c => {
            c.price = priceResult![c.id];
          });
        } else {
          p.price = priceResult![p.id];
        }
      });
    }
    this.data = data;
  }

  getSummaries(param) {
    this.$nextTick(() => {
      let table: any = this.$refs.table;
      table.doLayout();
    });
    const { columns, data } = param;
    let summary: string[] = [];
    if (columns && data) {
      columns.forEach((col, index) => {
        if (index == 0) {
          summary[index] = "合计";
        } else if (index == 3) {
          summary[index] = "总价";
        } else {
          summary[index] = "";
        }
      });
    }
    return summary;
  }
}
</script>

<style lang="scss" scoped>
.detail-root {
  width: 600px;
  text-align: left;
  font-size: 12px;
}
.property-col {
  text-align: center;
  line-height: 14px;
}

.property-col div {
  text-align: center;
  color: rebeccapurple;
}

.table {
  font-family: "宋体";
}
</style>
