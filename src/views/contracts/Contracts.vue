<!-- 合同列表 -->
<template>
  <div class="contracts-panel">
    <el-table
      style="flex:1"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      height="100%"
      :data="data"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="序号" fixed></el-table-column>
      <el-table-column prop="contractNo" label="合同编号" fixed sortable></el-table-column>
      <el-table-column prop="customerName" label="客户名称" fixed sortable></el-table-column>
      <el-table-column prop="contractName" label="合同名称" sortable></el-table-column>
      <el-table-column prop="signTime" label="签订日期" sortable></el-table-column>
      <el-table-column prop="contractMoney" label="合同金额" sortable></el-table-column>
      <el-table-column prop="finishMoney" label="已完成金额" sortable></el-table-column>
      <el-table-column prop="receiveMoney" label="已收款金额" sortable></el-table-column>
      <el-table-column prop="unFinishMoney" label="未完成金额" sortable></el-table-column>
      <el-table-column prop="unReceiveMoney" label="未收款金额" sortable></el-table-column>
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
              <el-dropdown-item icon="el-icon-s-cooperation" command="proceeds">收款与发票</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="customer-info">客户资料</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
      :size="pageInfo.pages"
      :current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onPageSizeChange"
      @current-change="onChangePage"
    ></el-pagination>
    <el-dialog
      :visible.sync="addContractVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加合同"
      width="fit-content"
      height="fit-content"
      :show-close="false"
    >
      <add-contract-form
        :info="currentContractInfo"
        @submit="submitContract"
        @cancel="cancleAddContract"
      ></add-contract-form>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      width="fit-content"
      height="fit-content"
      lock-scroll
    >
      <template></template>
      <component :is="dialogComponent" :info="currentInfo"></component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ClientDataVue, PageInfo } from "@/client-api";
import { DataListVue } from "../data-view/DataListVue";
import {
  contractApi,
  GetContractResp,
  PageInfoGetContractResp,
  GetCustomerFollowResp,
  GetContractPeriodResp
} from "@/client-api";
import Component from "vue-class-component";

import Overview from "../overview/Overview.vue";
import ContractsProceedsRecord from "./ContractsProceedsRecord.vue";
import ContractsStaticstic from "./ContractsStaticstic.vue";
import AddContractForm from "./AddContractForm.vue";
import { ContractInfo } from "./ContractInfo";
import { Emit, Prop } from "vue-property-decorator";
import { ExportOptions, ExportType } from "../data-view/ExportOptions";

@Component({
  components: {
    "proceeds-record": ContractsProceedsRecord,
    "add-contract-form": AddContractForm,
    staticstic: ContractsStaticstic
  }
})
export default class Contracts extends DataListVue {
  data: Array<GetContractResp> = [];
  pageInfo: PageInfo = { pageSize: 10, pageNum: 1, total: 0, pages: 0 };
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetContractResp = {};
  isLoading: boolean = false;
  addContractVisible: boolean = false;
  selectedItems: Array<GetContractResp> = [];
  currentContractInfo?: ContractInfo = {};
  options: any = {
    title: "合同管理",
    showTools: true
  };
  async mounted() {
    await this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    let vm = this;
    let result = await this.getData<PageInfoGetContractResp>(() =>
      contractApi.listContractUsingGET(
        vm.pageInfo.pageNum,
        vm.pageInfo.pageSize
      )
    );
    if (result) {
      this.pageInfo = result;
      let list = result.list;
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

  handleSelectionChange(selection: Array<GetContractResp>) {
    this.selectedItems = selection;
  }

  onAddItem() {
    this.currentContractInfo = undefined;
    this.addContractVisible = true;
    return true;
  }
  async onEditItem() {
    let vm = this;
    if (vm.selectedItems.length == 1) {
      let cinfo = new ContractInfo(vm.selectedItems[0], []);
      let result = await this.getData<Array<GetContractPeriodResp>>(() =>
        contractApi.getContractPeriodUsingGET(cinfo.info!.id!)
      );
      if (result) {
        result.forEach(element => {
          cinfo.periods!.push({ info: element });
        });
      }
      this.currentContractInfo = cinfo;
      this.addContractVisible = true;
    } else {
      this.$message.warning("必须选中一项！");
    }
  }
  onDeleteItem() {
    let vm = this;
    if (this.selectedItems.length == 0) return;
    this.$msgbox
      .confirm("是否确定删除选中的合同?")
      .then(async () => {
        for (let i = 0; i < vm.selectedItems.length; i++) {
          const element = vm.selectedItems[i];
          await vm.requestWithoutResult(() =>
            contractApi.deleteUserUsingPOST(element.id!)
          );
          vm.data.splice(vm.data.indexOf(element), 1);
        }
        vm.$message.success(
          "成功删除" + this.selectedItems.length + "个合同！"
        );
      })
      .catch();
  }

  onRefresh(): void {
    this.refreshData();
  }

  submitContract(info: ContractInfo) {
    if (this.currentContractInfo) {
      //更新
      let index = this.data.indexOf(this.currentContractInfo.info!);
      this.$set(this.data, index, info.info);
    } else {
      //添加
      this.data.push(info.info!);
    }
    this.addContractVisible = false;
  }

  cancleAddContract() {
    this.addContractVisible = false;
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

  async onExport(options: ExportOptions) {
    switch (options.Type) {
      case ExportType.All:
        break;
      case ExportType.CurrentPage:
        options.pageOptions.pageCurrent = this.pageInfo.pageNum!;
        options.pageOptions.pageSize = this.pageInfo.pageSize!;
        break;
      case ExportType.Selected:
        break;
      default:
        break;
    }
    let pageOp = options.pageOptions.toParameters();
    let result = await contractApi.exportContractUsingGET(...pageOp);
    if (result.status == 200) {
      window.location.href = result.url;
    }
  }

  onStaticstic() {
    this.dialogComponent = "staticstic";
    this.dialogTitle = "合同统计信息";
    this.dialogTableVisible = true;
  }

  async onSearch(query: string): Promise<boolean> {
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

  onChangePage(page: number) {
    this.pageInfo.pageNum = page;
    this.refreshData();
  }
  onPageSizeChange(size: number) {
    this.pageInfo.pageSize = size;
    this.refreshData();
  }
}
</script>

<style lang="scss" scoped>
.contracts-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
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
