<!-- 一个合同收款记录 -->
<template>
  <div class="dialog-timeline" v-loading="isLoading" element-loading-text="正在加载...">
    <div class="top-panel">
      <div class="info-item">
        <span class="info-item-label">编号:</span>
        {{ contractInfo.contractNo }}
      </div>
      <div class="info-item">
        <span class="info-item-label">状态:</span>
        {{ contractInfo.status }}
      </div>
      <div class="info-item">
        <span class="info-item-label">合同款:</span>
        {{ contractSummary.total }}元
      </div>
      <div class="info-item">
        <span class="info-item-label">已收款:</span>
        {{ contractSummary.recievedMoney }}元
      </div>
      <el-button
        class="info-item"
        type="text"
        @click="showDetail"
      >{{ showDetailInfo ? "收起" : "更多" }}</el-button>
      <div style="flex:1;text-align:right;">
        <!-- <el-tooltip content="添加合同款项" placement="bottom">
          <el-button type="text" @click="addItem">添加</el-button>
        </el-tooltip>-->
        <el-button type="text" @click="refashData">刷新</el-button>
      </div>
    </div>
    <div class="deltail-info" v-if="showDetailInfo">
      <div class="info-item">
        <span class="info-item-label">已开票:</span>
        {{ contractSummary.invoicedMoney }}元
      </div>
      <div class="info-item">
        <span class="info-item-label">未收款: :</span>
        {{ contractSummary.unrecievedMoney }}元
      </div>
    </div>
    <div class="timeline" v-if="!isLoading">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in contractPeriods"
          :key="index"
          :timestamp="item.info.endTime.toString() + '———' + item.info.periodContent"
          placement="top"
          type="primary"
        >
          <template slot="dot">
            <span class="timeline-dot">
              <span class="timeline-dot-text">{{ item.info.periodName }}</span>
              <i class="el-icon-success icon-success"></i>
            </span>
          </template>
          <div>
            <el-card v-if="item.proceed != undefined">
              <div @mouseenter="itemEnter(item)" @mouseleave="itemLeave(item)">
                <div class="info-list">
                  <div class="info-list-item">
                    <div class="timeline-item-title">收款金额: {{ item.proceed.receiveMoney }}元</div>
                  </div>
                  <div class="info-list-item">收款方式: {{ item.proceed.receiveMethod }}</div>
                  <div class="info-list-item">收款人: {{ item.proceed.receivePerson }}</div>
                  <div class="info-list-item">
                    发票编号:
                    <el-button
                      type="text"
                      v-if="item.invoice != undefined"
                      @click="showInvoiceInfo(item)"
                    >
                      {{
                      item.invoice.invoiceNo
                      }}
                    </el-button>
                    <el-button
                      type="text"
                      v-if="item.invoice == undefined"
                      @click="addItem(item)"
                    >未开发票</el-button>
                  </div>
                </div>
                <div>备注: {{ item.remark }}</div>
                <div v-if="item.showInvoice">
                  <div class="info-invoice-title">发票信息</div>
                  <div class="info-list">
                    <div class="info-list-item">
                      <div class="timeline-item-title">发票金额: {{ item.invoice.invoiceMoney }}元</div>
                    </div>
                    <div class="info-list-item">发票编号: {{ item.invoice.invoiceNo }}</div>
                    <div class="info-list-item">开票人: {{ item.invoice.invoicePerson }}</div>
                    <div class="info-list-item">开票时间: {{ item.invoice.invoiceTime }}</div>
                  </div>
                </div>
                <div class="item-edit-panel" v-if="item.showEditor">
                  <el-button type="text" @click="editItem(item)">编辑</el-button>
                  <el-button type="text" @click="deleteItem(item)">删除</el-button>
                </div>
              </div>
            </el-card>
            <div v-if="item.proceed == undefined">
              <el-button type="text" @click="addItem(item)">未收款项，点击添加</el-button>
            </div>
          </div>
        </el-timeline-item>
        <el-timeline-item hide-timestamp type="success" v-if="contractInfo.status == '已完成'">
          <span style="font-weight:bold">合同款项已结清</span>
        </el-timeline-item>
        <el-timeline-item hide-timestamp type="warning" v-if="contractInfo.status != '已完成'">
          <div class="inline-panel-center">
            <span style="font-weight:bold">合同款项待收取</span>
            <!-- <el-tooltip content="添加合同款项" placement="right">
              <span class="add-button">
                <i class="el-icon-circle-plus" @click="addItem"></i>
              </span>
            </el-tooltip>-->
            <el-dialog
              title="添加合同收款项"
              :visible.sync="addItemDialogVisible"
              append-to-body
              width="fit-content"
              height="fit-content"
            >
              <add-proceeds-form
                :contractId="contractInfo.id"
                :period="currentEditPeriod"
                @cancel="cancleAdd($event)"
                @submit="submitAddItem"
              ></add-proceeds-form>
            </el-dialog>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { Component, Prop, Watch, PropSync } from "vue-property-decorator";
import {
  contractApi,
  proceedsApi,
  invoiceApi,
  GetContractReceivablesResp,
  GetContractResp,
  GetContractPeriodResp,
  periodApi
} from "../../client/data-provider";
import { ContractCreator, ContractInfo, ContractPeroid } from "./ContractInfo";

import AddProceedsForm from "./AddProceedsForm.vue";
import ToggleButton from "@/components/Element/ToggleButton.vue";

@Component({
  components: {
    "add-proceeds-form": AddProceedsForm,
    "el-toggle-button": ToggleButton
  }
})
export default class ContractsProceedsRecord extends ClientDataVue {
  @PropSync("info", { default: {} })
  contractInfo!: GetContractResp;
  // contractPeriods: GetContractPeriodResp[] = [];
  isLoading: boolean = false;
  addItemDialogVisible: boolean = false;
  data: ContractInfo = {};
  showDetailInfo: boolean = false;
  currentEditPeriod?: ContractPeroid = undefined;

  async mounted() {
    await this.requestData();
  }

  @Watch("info")
  async contractIdChanged() {
    await this.requestData();
  }

  get contractPeriods() {
    return this.data.peroids;
  }

  get contractSummary() {
    let recievedMoney = 0;
    let invoicedMoney = 0;
    let total = this.contractInfo.contractMoney!;
    this.data?.peroids?.forEach(element => {
      invoicedMoney += element.invoice?.invoiceMoney ?? 0;
      recievedMoney += element.proceed?.receiveMoney ?? 0;
    });
    let unrecievedMoney = total - recievedMoney;
    return { total, invoicedMoney, recievedMoney, unrecievedMoney };
  }

  async requestData() {
    this.isLoading = true;
    // if (this.contractInfo) {
    //   let result = await contractApi.getContractReceivablesUsingGET(this.contractInfo.id!);
    //   let resultData = this.getClientData<Array<GetContractReceivablesResp>>(result);
    //   if (resultData.successed && resultData.data != undefined) {
    //     this.data = resultData.data;
    //   } else {
    //     this.data = [];
    //   }

    //   let periodResult = await periodApi.getContractPeriodUsingGET1(this.contractInfo.id);
    //   let periods = this.getClientData<Array<GetContractPeriodResp>>(result);
    //   if (periods.successed && periods.data != undefined) {
    //     this.contractPeriods = periods.data;
    //   } else {
    //     this.data = [];
    //   }
    // }

    this.data = await ContractCreator.get(this.contractInfo);
    this.currentEditPeriod = undefined;
    this.isLoading = false;
  }

  async refashData() {
    await this.requestData();
  }

  showDetail() {
    this.showDetailInfo = !this.showDetailInfo;
  }

  itemEnter(item: any) {
    this.$set(item, "showEditor", true);
  }

  itemLeave(item: any) {
    this.$set(item, "showEditor", false);
  }
  deleteItem(item: GetContractReceivablesResp) {
    this.$confirm("是否删除该收款项, 是否继续?", "提示", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    })
      .then(() => {
        let result = proceedsApi.deleteContractReceivablesUsingPOST(item.id!);
        result.then(r => {
          let resultValue = this.getClientData(r);
          if (resultValue.successed) {
            // let index = this.data.findIndex(value => value.id == item.id);
            // this.data.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  showInvoiceInfo(info: any) {
    this.$set(info, "showInvoice", !info.showInvoice);
  }
  editItem(item: GetContractReceivablesResp) {}

  addItem(period?: ContractPeroid) {
    this.currentEditPeriod = period;
    this.addItemDialogVisible = true;
  }

  closeAddItemDialog() {
    this.addItemDialogVisible = false;
  }

  submitAddItem(newItem: GetContractReceivablesResp) {
    //this.data.push(newItem);
    this.closeAddItemDialog();
  }

  cancleAdd() {
    this.closeAddItemDialog();
  }
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";
.top-panel {
  display: inline-flex;
  align-items: center;
}
.dialog-timeline {
  text-align: left;
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.info-item {
  margin-right: 18px;
}

.info-item-label {
}

.deltail-info {
  display: flex;
  flex-direction: row;
}

.timeline {
  flex: 1;
  overflow: auto;
  margin-top: 20px;
}

.item-first-line {
  display: inline-flex;
}

.timeline-item-title {
  font-weight: bold;
  width: 180px;
}
.timeline-dot {
  margin-left: -37px;
  margin-top: -2px;
}
.timeline-dot-text {
  color: $--color-primary;
  font-weight: bold;
  margin-right: 6px;
}
.info-invoice-title {
  color: $--color-primary;
  margin-top: 10px;
  margin-bottom: 6px;
  font-weight: bold;
}

.icon-success {
  color: $--color-success;
  font-size: 16px;
}

.icon-warning {
  font-size: 16px;
  color: --color-warning;
}

.info-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.info-list-item {
  width: 200px;
  margin-bottom: 6px;
}

.info-list-item .el-button--text {
  padding: 0px;
}

.item-edit-panel {
  position: absolute;
  bottom: 0px;
  right: 8px;
  display: inline-flex;
}

.add-button {
  margin-left: 8px;
  cursor: pointer;
  font-size: 20px;
  color: $--color-primary;
}
.inline-panel-center {
  display: flex;
  align-items: center;
}
</style>
