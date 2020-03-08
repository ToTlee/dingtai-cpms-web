<template>
  <div class="info-root">
    <div class="info">
      <el-row class="info-row" :gutter="20" justify="space-between">
        <el-col :span="4" class="info-algin-justify">客户名称:</el-col>
        <el-col
          :span="8"
          class="info-algin-left"
          style="font-weight:bold"
        >{{customerInfo.customerName}}</el-col>
        <el-col :span="5" class="info-algin-justify">项目类型/靶点:</el-col>
        <el-col :span="7" class="info-algin-left">{{customerInfo.projectTarget}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20" justify="space-between">
        <el-col :span="4" class="info-algin-justify">联系人:</el-col>
        <el-col :span="8" class="info-algin-left">{{customerInfo.contacts}}</el-col>
        <el-col :span="4" class="info-algin-justify">电话:</el-col>
        <el-col :span="8" class="info-algin-left">{{customerInfo.tel}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20" justify="space-between">
        <el-col :span="4" class="info-algin-justify">地址:</el-col>
        <el-col :span="8" class="info-algin-left">{{customerInfo.address}}</el-col>
        <el-col :span="4" class="info-algin-justify">对接人:</el-col>
        <el-col :span="8" class="info-algin-left">{{customerInfo.connector}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20" justify="space-between">
        <el-col :span="4" class="info-algin-justify">备注:</el-col>
        <el-col :span="8" class="info-algin-left">{{customerInfo.remark}}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20" justify="space-between">
        <el-col :span="5" class="info-algin-justify">最后一次更新:</el-col>
        <el-col :span="7" class="info-algin-left">{{lastUpdateDate}}</el-col>
      </el-row>
    </div>
    <div class="info-title">客户跟进情况</div>
    <el-timeline class="info-timeline">
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
  </div>
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
}

.info-algin-justify {
  text-align: justify;
  text-align-last: justify;
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