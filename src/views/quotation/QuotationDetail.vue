<template>
  <div class="detail-root">
    <el-row :gutter="30">
      <el-col :span="12">
        <div class="span-header">实验参数</div>
        <el-scrollbar style="height:184px">
          <el-table
            class="table"
            :data="data2.basic"
            :show-header="false"
            size="mini"
            border
            :cell-style="{padding:'1px'}"
            :row-style="{height:'10px'}"
          >
            <el-table-column prop="label"></el-table-column>
            <el-table-column prop="value">
              <template slot-scope="scope">
                <el-input
                  v-if="!scope.row.provider && isEditting"
                  v-model="scope.row.value"
                  size="mini"
                />
                <span v-else>{{scope.row.value}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
      <el-col :span="12">
        <div class="span-header">检测指标</div>
        <el-table
          class="table"
          :data="data2.testing"
          size="mini"
          border
          :cell-style="{padding:'1px'}"
        >
          <el-table-column prop="label" label="检测指标"></el-table-column>
          <el-table-column prop="value" label="次数">
            <template slot-scope="scope">
              <el-input
                v-if="!scope.row.provider && isEditting"
                v-model="scope.row.value"
                size="mini"
              />
              <span v-else>{{scope.row.value}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
    </el-row>
    <div class="span-header">
      <span>项目价格明细</span>
      <el-button
        v-if="!isEditting"
        class="edit-button"
        size="mini"
        type="text"
        @click="startEditing"
      >编辑</el-button>
      <span v-else-if="info" class="edit-button">
        <el-button class="edit-button" size="mini" type="text" @click="saveEdit">确定</el-button>
        <el-button class="edit-button" size="mini" type="text" @click="cancelEdit">放弃</el-button>
      </span>
      <el-button v-if="info" class="edit-button" size="mini" type="text" @click="loadData">刷新</el-button>
      <el-button v-if="info" class="edit-button" size="mini" type="text" @click="exportPdf">导出</el-button>
    </div>
    <el-table
      ref="table"
      class="table"
      :data="data2.prices"
      default-expand-all
      :tree-props="{children: 'children'}"
      row-key="id"
      size="mini"
      border
      height="380px"
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
      <el-table-column label="单价">
        <template slot-scope="scope">
          <el-input v-if="!scope.row.children && isEditting" v-model="scope.row.price" size="mini" />
          <span v-else>{{!scope.row.children ? scope.row.price:""}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计"></el-table-column>
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
  GetQuotationInfoResp,
  ResultQuotationInventoryEntity,
  UpdateQuotationInventoryReq,
  UpdateQuotationExperimentReq
} from "@/client-api";
import { Component, Prop, Watch } from "vue-property-decorator";
import { QuotationDetailInfo, createTempInfo, QuotaionItem } from "./quotation";
import { TableColumn, Table } from "element-ui";
import { ObjUtils } from "@/utils";

@Component
export default class QuotationDetail extends ClientDataVue {
  @Prop({ type: Object, required: false })
  info!: GetQuotationInfoResp;
  @Prop({ type: Object, required: false, default: new QuotationDetailInfo() })
  data!: QuotationDetailInfo;
  isEditting = !this.info;

  get data2() {
    return this.data;
  }

  async mounted() {
    await this.loadData();
  }

  async loadData() {
    if (this.info && this.info.id) {
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

      let priceResult = await this.getData<ResultQuotationInventoryEntity>(() =>
        quotationInventoryApi.getUnitQuotationInventoryByIdUsingGET(
          this.info.id!
        )
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
  }

  getSummaries(param) {
    this.$nextTick(() => {
      let table: any = this.$refs.table;
      table.doLayout();
    });
    let vm = this;
    const { columns, data } = param;
    let summary: string[] = [];
    if (columns && data) {
      columns.forEach((col, index) => {
        if (index == 0) {
          summary[index] = "合计\n合计*1.1\n取整";
        } else if (index == 3) {
          let result = vm.data.total;

          summary[index] =
            result +
            "\n" +
            Math.floor(result * 1.1) +
            "\n" +
            Math.floor((result * 1.1) / 1000) * 1000;
        } else {
          summary[index] = "";
        }
      });
    }
    return summary;
  }
  startEditing() {
    this.data.clone();
    this.isEditting = true;
  }
  async saveEdit() {
    let updateInfo: UpdateQuotationInventoryReq = {
      quotationid: this.info.id
    };
    this.data.prices.forEach(p => {
      if (p.children && p.children.length > 0) {
        p.children.forEach(child => {
          updateInfo[child.id] = child.price;
        });
      } else {
        updateInfo[p.id] = p.price;
      }
    });
    updateInfo.isunit = 0;
    let result = await this.requestWithoutResult(
      () =>
        quotationInventoryApi.updateQuotationInventoryUnitUsingPOST(updateInfo),
      "更新总价"
    );
    if (result) {
      this.$message.success("更新单价成功！");
      this.isEditting = false;
    }
    updateInfo.isunit = 1;
    this.data.prices.forEach(p => {
      if (p.children && p.children.length > 0) {
        p.children.forEach(child => {
          updateInfo[child.id] = child.total;
        });
      } else {
        updateInfo[p.id] = p.total;
      }
    });
    updateInfo.total = this.data.total;
    let result2 = await this.requestWithoutResult(
      () =>
        quotationInventoryApi.updateQuotationInventoryUnitUsingPOST(updateInfo),
      "更新总价"
    );
    let exp: any = {
      quotationid: this.info.id!
    };
    this.data.basic.forEach(item => {
      exp[item.id] = item.value;
    });
    this.data.testing.forEach(item => {
      exp[item.id] = item.value;
    });
    let result3 = await this.requestWithoutResult(() =>
      quotationExperimentApi.updateExperimentByQuotationIdUsingPOST(exp)
    );

    if (result && result2 && result3) {
      this.$message.success("更新总价成功！");
      this.isEditting = false;
    }
  }

  cancelEdit() {
    this.isEditting = false;
    this.data.reset();
  }

  exportPdf() {
    this.$message.info("该功能开发中");
  }

  @Watch("info")
  async onInfoChanged() {
    await this.loadData();
  }
}
</script>
<style>
.detail-root .el-input__inner {
  padding: 0px !important;
  border-radius: 0px !important;
  height: 20px !important;
  font-family: "宋体";
}

.detail-root .el-textarea__inner {
  padding: 0px !important;
  border-radius: 0px !important;
}
</style>
<style lang="scss" scoped>
.detail-root {
  width: 700px;
  text-align: left;
  font-size: 12px;
  font-family: "宋体";
}
.property-col {
  text-align: center;
  line-height: 14px;
}
.edit-button {
  margin-left: 10px;
}
.span-header {
  margin: 4px 0px;
  font-weight: bold;
}

.property-col div {
  text-align: center;
  color: rebeccapurple;
}

.table {
  font-family: "宋体";
}
</style>
