<template>
  <el-container class="info-root" v-loading="loading">
    <div class="info-title">客户资料</div>
    <div class="info">
      <el-row class="info-row" :gutter="20">
        <el-col :span="4" class="info-algin-justify">客户名称:</el-col>
        <el-col :span="8" class="info-algin-left" style="font-weight:bold">{{ customerInfo.customerName }}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">联系人:</el-col>
        <el-col :span="9" class="info-algin-left">{{ customerInfo.contacts }}</el-col>
        <el-col :span="3" class="info-algin-justify">联系电话:</el-col>
        <el-col :span="9" class="info-algin-left">{{ customerInfo.phone }}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">地址:</el-col>
        <el-col :span="9" class="info-algin-left">{{ customerInfo.address }}</el-col>
        <el-col :span="3" class="info-algin-justify">对接人:</el-col>
        <el-col :span="9" class="info-algin-left">{{ customerInfo.connector }}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="3" class="info-algin-justify">备注:</el-col>
        <el-col :span="9" class="info-algin-left">{{ customerInfo.remark }}</el-col>
      </el-row>
      <el-row class="info-row" :gutter="20">
        <el-col :span="4" class="info-algin-justify">最后一次更新:</el-col>
        <el-col :span="8" class="info-algin-left">{{ lastUpdateDate }}</el-col>
      </el-row>
    </div>
    <div class="info-title">跟进</div>
    <div class="info">
      <el-form size="mini">
        <el-row>
          <el-col :span="16">
            <el-form-item label="跟进内容:" required>
              <el-input type="textarea" v-model="followContent" style="width:300px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align:left">
            <!-- <el-button type="primary" @click="cancelFollow" size="mini">取消</el-button> -->
            <el-button type="primary" style="margin-left:10px" @click="saveFollow" size="mini">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="info-title">客户跟进情况</div>
    <div v-if="customerFollow.length == 0" style="text-align:left;margin-left:8px">无</div>
    <div>
      <el-timeline class="info-timeline" v-if="customerFollow.length > 0">
        <el-timeline-item v-for="(follow, index) in customerFollow" :key="index" :timestamp="follow.createTime" color="#0790df">
          <div>
            <div style="font-weight:bold">{{ follow.followCase }}</div>
            <div style="color:gray;font-size:14px">跟进人: {{ follow.creator }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-container>
</template>

<script lang="ts">
import {
  ClientDataVue,
  customerApi,
  GetCustomerResp,
  GetContractResp,
  GetCustomerFollowResp,
  customerFollowApi,
  AddCustomerFollowReq
} from "@/client-api";
import { Prop, Watch, Component, PropSync, Emit } from "vue-property-decorator";
import { ContractInfo } from "../contracts/ContractInfo";

@Component
export default class customerFollow extends ClientDataVue {
  @PropSync("info", { default: {} })
  contractInfo2?: GetCustomerResp;
  customerInfo: GetCustomerResp = {};
  customerFollow: Array<GetCustomerFollowResp> = [];
  followContent: string = "";
  loading = false;
  get customerId() {
    if (this.contractInfo2) {
      return this.contractInfo2.id;
    }
    return -1;
  }

  get lastUpdateDate() {
    if (this.customerFollow.length > 0) {
      return this.customerFollow.reduce((pre, cur) => (pre.createTime! < cur.createTime! ? cur : pre)).createTime;
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
      let result = await this.getData<GetCustomerResp>(() => customerApi.getCustomerUsingGET(this.customerId!));
      if (result) {
        this.customerInfo = result;
      } else {
        this.customerInfo = {};
      }
    }
  }

  async getCustomerFollow() {
    let result = await this.getData<Array<GetCustomerFollowResp>>(() => customerApi.getCustomerFollowUsingGET(this.customerId!));
    if (result) {
      this.customerFollow = result;
    } else {
      this.customerFollow = [];
    }
  }
  async saveFollow() {
    let result = false;
    //添加
    let data: AddCustomerFollowReq = {
      customerId: this.customerId,
      followCase: this.followContent,
      remark: "无备注"
    };

    result = await this.requestWithoutResult(() => customerFollowApi.addCustomerFollowUsingPOST(data));
    if (result) {
      this.$message.success("操作成功");

      this.submit();
      this.refreshData();
    }
  }

  cancelFollow() {
    let vm = this;
    this.$msgbox
      .confirm("是否放弃当跟进?")
      .then(() => {
        vm.cancel();
      })
      .catch(() => {});
  }
  @Emit()
  submit() {
    return this.followContent;
  }

  @Emit()
  cancel() {}
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";

.info-root {
  display: flex;
  width: 580px;
  height: 600px;
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
