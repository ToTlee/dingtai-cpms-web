<!-- 报价列表 -->
<template>
  <div class="quotations-panel">
    <el-table
      style="flex:1"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      height="100%"
      size="mini"
      row-key="id"
      :data="data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
      default-expand-all
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="categoryName" label="项目"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="quotation" label="报价(万元)"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown
            szie="medium"
            @command="openInfo($event, scope.row)"
            v-if="!scope.row.children"
          >
            <span class="el-dropdown-link">
              <el-button size="medium" type="primary">
                查看
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </span>
            <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-s-cooperation" command="proceeds">收款记录</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="invoice">发票记录</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="customer-info">客户资料</el-dropdown-item>
            </el-dropdown-menu>-->
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
  quotationApi,
  GetQuotationInfoResp,
  PageInfoGetQuotationInfoResp
} from "@/client-api";
import Component from "vue-class-component";

import Overview from "../overview/Overview.vue";
import { Emit, Prop } from "vue-property-decorator";
import { ExportOptions } from "../data-view/ExportOptions";
import ArrayUtils from "../../utils/arrayUtils";

@Component({
  components: {}
})
export default class Quotations extends DataListVue {
  data: Array<GetQuotationInfoResp> = [];
  pageInfo: PageInfo = { pageSize: 50, pageNum: 1, total: 0, pages: 0 };
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetQuotationInfoResp = {};
  isLoading: boolean = false;
  addContractVisible: boolean = false;
  selectedItems: Array<GetQuotationInfoResp> = [];
  options: any = {
    title: "项目报价"
  };
  async mounted() {
    await this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    let vm = this;
    let result = await this.getData<PageInfoGetQuotationInfoResp>(() =>
      quotationApi.listAllQuotationInfoUsingGET(
        vm.pageInfo.pageNum,
        vm.pageInfo.pageSize
      )
    );
    if (result) {
      this.pageInfo = result;
      const groups = ArrayUtils.groupBy(
        result.list!,
        item => item.categoryName
      );
      let list: any = [];
      groups.forEach(value => {
        list.push({
          id: "parent" + value.key,
          categoryName: value.key,
          remark: "",
          quotation:
            "合计: " +
            value.group
              .map(v => v.quotation)
              .reduce((pre, curr) => pre! + curr!),
          children: value.group
        });
      });
      this.data = list;
    } else {
      this.data = [];
    }
    this.isLoading = false;
  }
  tableRowClassName({ row, rowIndex }) {
    if (row.children) {
      return "group-row";
    }
    return "";
  }
  handleSelectionChange(selection: Array<GetQuotationInfoResp>) {
    this.selectedItems = selection;
  }

  onAddItem() {
    // this.currentContractInfo = undefined;
    // this.addContractVisible = true;
    return true;
  }
  async onEditItem() {
    // let vm = this;
    // if (vm.selectedItems.length == 1) {
    //   let cinfo = new ContractInfo(vm.selectedItems[0], []);
    //   let result = await this.getData<Array<GetContractPeriodResp>>(() =>
    //     contractApi.getContractPeriodUsingGET(cinfo.info!.id!)
    //   );
    //   if (result) {
    //     result.forEach(element => {
    //       cinfo.periods!.push({ info: element });
    //     });
    //   }
    //   this.currentContractInfo = cinfo;
    //   this.addContractVisible = true;
    // } else {
    //   this.$message.warning("必须选中一项！");
    // }
  }
  onDeleteItem() {
    let vm = this;
    if (this.selectedItems.length == 0) return;
    this.$msgbox
      .confirm("是否确定删除选中的报价?")
      .then(async () => {
        for (let i = 0; i < vm.selectedItems.length; i++) {
          const element = vm.selectedItems[i];
          await vm.requestWithoutResult(() =>
            // contractApi.deleteUserUsingPOST(element.id!)
            quotationApi.deleteQuotationUsingPOST(element.id!)
          );
          vm.data.splice(vm.data.indexOf(element), 1);
        }
        vm.$message.success(
          "成功删除" + this.selectedItems.length + "个报价！"
        );
      })
      .catch();
  }

  onRefresh(): void {
    this.refreshData();
  }

  // submitContract(info: ContractInfo) {
  //   if (this.currentContractInfo) {
  //     //更新
  //     let index = this.data.indexOf(this.currentContractInfo.info!);
  //     this.$set(this.data, index, info.info);
  //   } else {
  //     //添加
  //     this.data.push(info.info!);
  //   }
  //   this.addContractVisible = false;
  // }

  // cancleAddContract() {
  //   this.addContractVisible = false;
  // }

  // openInfo(command: string, row: GetContractResp) {
  //   let component = Overview;
  //   this.currentInfo = row;
  //   if (command == "proceeds") {
  //     this.dialogComponent = "proceeds-record";
  //     this.dialogTitle = row.contractName + "合同收款情况";
  //     this.dialogTableVisible = true;
  //   } else if (command == "invoice") {
  //   } else if (command == "customer-info") {
  //   }
  // }

  async onSearch(query: string): Promise<boolean> {
    let vm = this;
    if (!query || query == "") {
      await this.refreshData();
      return true;
    }
    this.isLoading = true;
    let result = await this.getData<PageInfoGetQuotationInfoResp>(() =>
      quotationApi.getQuotationByNameUsingGET(
        vm.pageInfo.pageNum,
        vm.pageInfo.pageSize,
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
<style>
.el-table .group-row {
  background: #ccdcf8 !important;
}
</style>

<style lang="scss" scoped>
.quotations-panel {
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
