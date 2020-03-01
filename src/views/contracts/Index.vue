<!-- 合同管理模块 -->
<template>
  <div class="contracts-root">
    <div class="page-title">项目合同信息</div>
    <div class="contracts-tools">
      <div class="function-panel">
        <el-button type="primary" size="small" @click="addContract">添加</el-button>
      </div>
      <el-dialog
        :visible.sync="addContractVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="添加合同"
        width="fit-content"
        height="fit-content"
        :show-close="false"
      >
        <add-contract-form @submit="submitContract" @cancle="cancleAddContract"></add-contract-form>
      </el-dialog>
      <div class="search-panel">
        <el-input prefix-icon="el-icon-search" placeholder="输入关键字" size="small">
          <!-- <el-select slot="prepend" placeholder="请选择检索段">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>-->
          <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="contracts-content">
      <contracts></contracts>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";

import Contracts from "./Contracts.vue";
import AddContractForm from "./AddContractForm.vue";
import Component from "vue-class-component";
import { ContractInfo } from "./ContractInfo";
@Component({
  components: {
    Contracts,
    "add-contract-form": AddContractForm
  }
})
export default class Index extends Vue {
  addContractVisible: boolean = false;

  addContract() {
    this.addContractVisible = true;
  }

  submitContract(info?: ContractInfo) {
    if (info) {
      //this.data.push(info.info!);
    }
    this.addContractVisible = false;
  }

  cancleAddContract() {}
}
</script>

<style lang="scss" scoped>
.contracts-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contracts-tools {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 10px;
}

.contracts-content {
  flex: 1;
  overflow: auto;
}
.function-panel {
  display: inline-flex;
  flex: 1;
}
.search-panel {
  display: inline-flex;
  text-align: right;
}
</style>
