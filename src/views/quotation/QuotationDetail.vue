<template>
  <div class="detail-root">
    <el-row :gutter="0">
      <el-col :span="12">
        <div class="span-header">实验参数</div>
        <el-scrollbar style="height:184px">
          <el-table
            class="table"
            :data="data2.basic"
            :show-header="false"
            size="mini"
            border
            :cell-style="{ padding: '1px' }"
            :row-style="{ height: '10px' }"
          >
            <el-table-column prop="label"></el-table-column>
            <el-table-column prop="value">
              <template slot-scope="scope">
                <el-input v-if="!scope.row.provider && isEditting" v-model="scope.row.value" size="mini" />
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
      <el-col :span="12">
        <div class="span-header">检测指标</div>
        <el-table class="table" :data="data2.testing" size="mini" border :cell-style="{ padding: '1px' }">
          <el-table-column prop="label" label="检测指标"></el-table-column>
          <el-table-column prop="value" label="次数">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.provider && isEditting" v-model="scope.row.value" size="mini" />
              <span v-else>{{ scope.row.value }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="property-col"></el-col>
    </el-row>
    <div class="span-header">
      <span>项目价格明细</span>
      <el-button v-if="!isEditting" class="edit-button" size="mini" type="text" @click="startEditing">编辑</el-button>
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
      style="flex:1;"
      :data="data2.prices"
      default-expand-all
      :tree-props="{ children: 'children' }"
      row-key="id"
      size="mini"
      border
      show-summary
      :summary-method="getSummaries"
      :cell-style="{ padding: '1px' }"
    >
      <el-table-column prop="label">
        <template slot-scope="scope">
          <span>{{ scope.row.children ? scope.row.label : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="内容"></el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">
          <el-input v-if="!scope.row.children && isEditting" v-model="scope.row.price" size="mini" />
          <span v-else>{{ !scope.row.children ? scope.row.price : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  GetQuotationInfoResp,
  quotationApi,
  ResultGetDetailQuotationResp,
  GetDetailQuotationResp,
  QuotationDetailEntity,
  UpdateQuotationDetailReq,
  UpdateQuotationModuleReq
} from "@/client-api";
import { Component, Prop, Watch, PropSync } from "vue-property-decorator";
import { QuotationDetailInfo, createTempInfo, QuotaionItem } from "./quotation";
import { TableColumn, Table } from "element-ui";
import { ObjUtils } from "@/utils";

@Component
export default class QuotationDetail extends ClientDataVue {
  @PropSync("info")
  _info!: QuotationDetailEntity;
  data: QuotationDetailInfo = createTempInfo();
  isEditting = false;

  get data2() {
    return this.data;
  }

  async mounted() {
    if (!this._info || !this._info.id) {
      this.isEditting = true;
    }
    await this.loadData();
  }

  async loadData() {
    let data = createTempInfo();
    if (this._info) {
      let experimentResult = this._info;
      if (experimentResult) {
        data.basic.forEach(b => {
          b.value = Number(experimentResult![b.id]);
        });
        data.testing.forEach(b => {
          b.value = Number(experimentResult![b.id]);
        });

        data.prices.forEach(p => {
          if (p.children) {
            p.children.forEach(c => {
              let value: string = experimentResult![c.id];
              let strs = (value ?? "").toString().split("|");
              c.price = Number(strs[0]);
              c.remark = strs[2] ?? "";
            });
          } else {
            let value: string = experimentResult![p.id];
            let strs = (value ?? "").toString().split("|");
            p.price = Number(strs[0]);
            p.remark = strs[2] ?? "";
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

          summary[index] = result + "\n" + Math.floor(result * 1.1) + "\n" + Math.floor((result * 1.1) / 1000) * 1000;
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
    let updateInfo: UpdateQuotationModuleReq = {
      id: this._info.id,
      name: this._info.name,
      hasdetail: this._info.hasdetail,
      parentid: this._info.parentid
    };
    this.data.prices.forEach(p => {
      if (p.children && p.children.length > 0) {
        p.children.forEach(child => {
          updateInfo[child.id] = child.price + "|" + child.total + "|" + child.remark ?? "";
        });
      } else {
        updateInfo[p.id] = p.price;
      }
    });
    this.data.basic.forEach(item => {
      updateInfo[item.id] = item.value;
    });
    this.data.testing.forEach(item => {
      updateInfo[item.id] = item.value;
    });
    updateInfo.totalcost = this.data.total + "";

    if (this._info && this._info.id) {
      let result = await this.requestWithoutResult(() => quotationApi.updateQuotationModuleUsingPOST(updateInfo));
      if (result) {
        this.$message.success("更新信息成功！");
        this.isEditting = false;
        Object.assign(this._info, updateInfo);
      }
    } else {
      this.isEditting = false;
      Object.assign(this._info, updateInfo);
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
  text-align: left;
  font-size: 12px;
  font-family: "宋体";
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow: auto;
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
