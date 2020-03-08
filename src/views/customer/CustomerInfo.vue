<template>
  <el-container class="info-root" v-loading="loading">
    <div class="info-title">Sponsor资料</div>
    <div class="info">
      <el-row class="info-row" :gutter="20">
        <el-col :span="4" class="info-algin-justify">供应商名称:</el-col>
        <el-col
          :span="8"
          class="info-algin-left"
          style="font-weight:bold"
        >{{customerInfo.customerName}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">联系人:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.contacts}}</el-col>
        <el-col :span="3" class="info-algin-justify">联系电话:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.phone}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">地址:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.address}}</el-col>
        <el-col :span="3" class="info-algin-justify">对接人:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.connector}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">备注:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.remark}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="4" class="info-algin-justify">最后一次更新:</el-col>
        <el-col :span="8" class="info-algin-left">{{lastUpdateDate}}</el-col>
      </el-row>
    </div>
    <div class="info-title">开票信息</div>
    <div class="info">
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">开户名:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.bankName}}</el-col>
        <el-col :span="2" class="info-algin-justify">税号:</el-col>
        <el-col :span="10" class="info-algin-left">{{customerInfo.creditCode}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">开户行:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.bank}}</el-col>
        <el-col :span="2" class="info-algin-justify">电话:</el-col>
        <el-col :span="10" class="info-algin-left">{{customerInfo.tel}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">注册地址:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.registerAddress}}</el-col>
        <el-col :span="2" class="info-algin-justify">账号:</el-col>
        <el-col :span="10" class="info-algin-left">{{customerInfo.account}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">发票类容:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.invoiceContent}}</el-col>
        <el-col :span="3" class="info-algin-justify">发票类型:</el-col>
        <el-col :span="9" class="info-algin-left">{{customerInfo.invoiceType}}</el-col>
      </el-row>
    </div>
    <div class="info-title">客户跟进情况</div>
    <div v-if="customerFollow.length == 0" style="text-align:left;margin-left:8px">无</div>
    <el-timeline class="info-timeline" v-if="customerFollow.length > 0">
      <el-timeline-item
        v-for="(follow, index) in customerFollow"
        :key="index"
        :timestamp="follow.createTime"
        color="#0790df"
      >
        <div>
          <div style="font-weight:bold">{{follow.followCase}}</div>
          <div style="color:gray;font-size:14px">备注: {{follow.remark}}</div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-container>
</template>

<script lang="ts">
import {
  ClientDataVue,
  customerApi,
  GetCustomerResp,
  GetContractResp,
  GetCustomerFollowResp
} from "@/client-api";
import { Prop, Watch, Component, PropSync } from "vue-property-decorator";
import { ContractInfo } from "../contracts/ContractInfo";

@Component
export default class CustomerInfo extends ClientDataVue {
  @PropSync("info", { default: {} })
  contractInfo2?: GetContractResp;
  customerInfo: GetCustomerResp = {};
  customerFollow: Array<GetCustomerFollowResp> = [];
  loading = false;
  get customerId() {
    if (this.contractInfo2) {
      return this.contractInfo2.customerId;
    }
    return -1;
  }

  get lastUpdateDate() {
    if (this.customerFollow.length > 0) {
      return this.customerFollow.reduce((pre, cur) =>
        pre.createTime! < cur.createTime! ? cur : pre
      ).createTime;
    }
    return "无";
  }
  async mounted() {
    await this.refreshData();
  }

  @Watch("info")
  async onInfoChanged() {
    this.loading = true;
    await this.refreshData();
    this.loading = false;
  }

  private async refreshData() {
    if (this.customerId) {
      await this.getCustomerInfo();
      await this.getCustomerFollow();
    }
  }

  async getCustomerInfo() {
    if (this.customerId) {
      let result = await this.getData<GetCustomerResp>(() =>
        customerApi.getCustomerUsingGET(this.customerId!)
      );
      if (result) {
        this.customerInfo = result;
      } else {
        this.customerInfo = {};
      }
    }
  }

  async getCustomerFollow() {
    let result = await this.getData<Array<GetCustomerFollowResp>>(() =>
      customerApi.getCustomerFollowUsingGET(this.customerId!)
    );
    if (result) {
      this.customerFollow = result;
    } else {
      this.customerFollow = [];
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";

.info-root {
  display: flex;
  width: 580px;
  height: 500px;
  flex-direction: column;
}

.info-row {
  margin-bottom: 10px;
}

.info-algin-left {
  text-align: left;
  padding-right: 0px !important;
  min-height: 1px;
}

.info-algin-justify {
  text-align: justify;
  text-align-last: justify;
  padding-right: 0px !important;
  color: gray;
}

.info {
  width: 100%;
}
.info-title {
  font-weight: bold;
  text-align: left;
  margin: 4px 0 14px 0;
  color: $--color-primary;
}
.info-timeline {
  flex: 1;
  text-align: left;
}
</style>