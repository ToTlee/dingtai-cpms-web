<!-- 合同列表 -->
<template>
  <div class="contracts-panel">
    <el-table
      v-loading="isLoading"
      element-loading-text="正在加载..."
      height="100%"
      :data="data"
      stripe
      border
    >
      <el-table-column prop="id" label="序号" fixed></el-table-column>
      <el-table-column prop="contractNo" label="合同编号" fixed sortable></el-table-column>
      <el-table-column prop="customerName" label="客户名称" fixed sortable></el-table-column>
      <el-table-column prop="contractName" label="合同名称" sortable></el-table-column>
      <el-table-column prop="signTime" label="签订日期" sortable></el-table-column>
      <el-table-column prop="contractMoney" label="合同金额" sortable></el-table-column>
      <el-table-column prop="status" label="完成情况" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown szie="medium" @command="openInfo($event, scope.row)">
            <span class="el-dropdown-link">
              <el-button size="medium" type="primary">
                查看
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-s-cooperation" command="proceeds">收款记录</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="invoice">发票记录</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="customer-info">客户资料</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      width="fit-content"
      height="fit-content"
      :show-close="false"
      lock-scroll
    >
      <template></template>
      <component :is="dialogComponent" :info="currentInfo"></component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { DataListVue } from "../DataListVue";
import { Message, Form } from "element-ui";
import {
  contractApi,
  GetContractResp,
  PageInfoGetContractResp
} from "@/client/data-provider";
import Component from "vue-class-component";
import auth from "@/authentication/authentication";
import { AuthVueRouter } from "@/router/index";

import Overview from "../overview/Overview.vue";
import ContractsProceedsRecord from "./ContractsProceedsRecord.vue";
import { ContractInfo } from "./ContractInfo";
import { ElSelect } from "element-ui/types/select";

@Component({
  components: {
    "proceeds-record": ContractsProceedsRecord
  }
})
export default class Contracts extends DataListVue {
  data: Array<GetContractResp> = [];
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetContractResp = {};
  isLoading: boolean = false;

  async mounted() {
    await this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    let result = await contractApi.listContractUsingGET();
    let resultData = this.getClientData(result);
    if (resultData.successed) {
      let list = result.data?.list;
      if (list) {
        list.sort((a, b) => a.id! - b.id!);
      } else {
        list = [];
      }
      this.data = list;
    } else {
      this.data = [];
    }
    this.isLoading = false;
  }

  openInfo(command: string, row: GetContractResp) {
    let component = Overview;
    this.currentInfo = row;
    if (command == "proceeds") {
      this.dialogComponent = "proceeds-record";
      this.dialogTitle = row.contractName + "合同收款情况";
      this.dialogTableVisible = true;
    } else if (command == "invoice") {
    } else if (command == "customer-info") {
    }
  }

  async search(query: string): Promise<boolean> {
    if (!query || query == "") {
      await this.refreshData();
      return true;
    }
    this.isLoading = true;
    let result = await this.getData<PageInfoGetContractResp>(() =>
      contractApi.listContractUsingGET(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        query
      )
    );
    let success = false;
    if (result && result.list) {
      this.data = result.list;
      success = true;
    }
    this.isLoading = false;
    return success;
  }
}
</script>

<style lang="scss" scoped>
.contracts-panel {
  height: 100%;
}
.el-dropdown-link {
  cursor: pointer;
  font-size: 18px;
}

.dialog-timeline .el-card__body {
  padding: 8px;
}

.timeline-item-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
  margin-bottom: 8px;
}
.contracts-root .el-dialog__body {
  padding: 0px;
  font-size: 14px;
}
</style>
