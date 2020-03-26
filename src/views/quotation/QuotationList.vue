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
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName"
      default-expand-all
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <!-- <el-table-column prop="categoryName" label="项目"></el-table-column> -->
      <el-table-column label="项目">
        <template slot-scope="scope">
          <div v-if="!scope.row.children">
            <el-input v-if="scope.row.editing" v-model="scope.row.content" size="mini"></el-input>
            <div v-if="!scope.row.editing">{{ scope.row.content }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户">
        <template slot-scope="scope">
          <div v-if="!scope.row.children">
            <el-autocomplete
              v-if="scope.row.editing"
              style="line-height:12px;width:200px"
              size="mini"
              v-model="scope.row.customer"
              value-key="customerName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入客户名称"
            ></el-autocomplete>
            <div v-if="!scope.row.editing">{{ scope.row.customer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报价(万元)">
        <template slot-scope="scope">
          <div>{{ scope.row.quotation }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="editing">
        <template slot-scope="scope">
          <div v-if="!scope.row.children">
            <el-input
              type="textarea"
              v-if="scope.row.editing"
              :autosize="{ minRows: 2, maxRows: 10 }"
              v-model="scope.row.remark"
              size="mini"
            ></el-input>
            <div v-if="!scope.row.editing">{{ scope.row.remark }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            v-if="!scope.row.children"
            type="text"
            @click="editRow(scope.row)"
          >
            {{
            scope.row.editing ? "确定" : "编辑"
            }}
          </el-button>
          <el-button
            size="small"
            v-if="!scope.row.children && scope.row.editing"
            type="text"
            @click="cancelEditRow(scope.row)"
          >取消</el-button>
          <el-button
            size="small"
            v-if="!scope.row.children"
            type="text"
            @click="showDetial(scope.row)"
          >明细</el-button>
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
      style="margin:20px"
      :title="dialogTitle"
      :visible.sync="dlgVisible"
      width="fit-content"
      height="fit-content"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      lock-scroll
    >
      <component :is="dialogComponent" :info="currentInfo" @submit="onSubmit" @cancel="cancel"></component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  PageInfo,
  AddDetailQuotationReq,
  PageInfoGetCustomerResp,
  customerApi
} from "@/client-api";
import { DataListVue } from "../data-view/DataListVue";
import {
  quotationApi,
  GetQuotationInfoResp,
  PageInfoGetQuotationInfoResp
} from "@/client-api";
import Component from "vue-class-component";

import Overview from "../overview/Overview.vue";
import { Emit, Prop } from "vue-property-decorator";
import { ExportOptions, ExportType } from "../data-view/ExportOptions";
import ArrayUtils from "../../utils/arrayUtils";
import ProjectQuoation from "./ProjectQuoation.vue";
// import QuotationDetail from "./QuotationDetail.vue";
import AddQuoation from "./AddQuoation.vue";

@Component({
  components: {
    "quotation-detail": ProjectQuoation,
    AddQuoation
  }
})
export default class Quotations extends DataListVue {
  data: Array<GetQuotationInfoResp> = [];
  pageInfo: PageInfo = { pageSize: 50, pageNum: 1, total: 0, pages: 0 };
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetQuotationInfoResp = { customer: "" };
  isLoading: boolean = false;
  addContractVisible: boolean = false;
  selectedItems: Array<GetQuotationInfoResp> = [];
  options: any = {
    title: "项目报价"
  };
  async mounted() {
    await this.refreshData();
  }

  get dlgVisible() {
    return this.dialogTableVisible;
  }
  set dlgVisible(newVal) {
    if (this.dialogTableVisible != newVal) {
      this.dialogTableVisible = newVal;
    }
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
    if (result && result.list) {
      this.pageInfo = result;
      // const groups = ArrayUtils.groupBy(
      //   result.list!,
      //   item => item.categoryName
      // );
      // let list: any = [];
      // groups.forEach(value => {
      //   list.push({
      //     id: "parent" + value.key,
      //     categoryName: value.key,
      //     remark: "",
      //     quotation:
      //       "合计: " +
      //       value.group
      //         .map(v => v.quotation)
      //         .reduce((pre, curr) => pre! + curr!),
      //     children: value.group
      //   });
      // });
      this.data = result.list;
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

  async editRow(row: GetQuotationInfoResp) {
    let _row: any = row;
    let editing = !!_row.editing;
    if (editing) {
      //确定
      let result = await this.requestWithoutResult(() =>
        quotationApi.updateQuotationDetailUsingPOST({
          id: row.id,
          content: row.content,
          customer: row.customer,
          remark: row.remark,
          quotation: row.quotation
        })
      );
      if (result) {
        this.$message.success("更新报价信息成功！");
        delete _row.copy;
        this.$set(_row, "editing", false);
      }
    } else {
      //开始编辑
      _row.copy = { ...row };
      this.$set(_row, "editing", true);
    }
  }

  cancelEditRow(row) {
    let vm = this;
    if (row.copy) {
      Object.assign(row, row.copy);
      this.$set(row, "editing", false);
    }
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

  onAddItem() {
    this.dialogComponent = "add-quoation";
    this.dialogTitle = "新建项目报价";
    this.currentInfo = { customer: "" };
    this.dialogTableVisible = true;
    return true;
  }

  onSubmit() {
    this.dialogTableVisible = false;
    this.refreshData();
  }
  cancel() {
    this.dialogTableVisible = false;
  }

  showDetial(row: GetQuotationInfoResp) {
    this.dialogComponent = "quotation-detail";
    this.dialogTitle = "项目报价明细";
    this.currentInfo = row;
    this.dialogTableVisible = true;
  }

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

  async onExport(options: ExportOptions) {
    if (this.selectedItems.length < 1) {
      this.$message.warning("必须勾选一项！");
      return;
    } else if (this.selectedItems.length > 1) {
      this.$message.warning("只能勾选一项！");
      return;
    }
    let pageOp = options.pageOptions.toParameters();
    let result = await quotationApi.exportQuotationUsingGET(
      options.pageOptions.pageCurrent,
      options.pageOptions.pageSize,
      undefined,
      undefined,
      this.selectedItems[0].id
    );
    if (result.status == 200) {
      window.location.href = result.url;
    }
  }

  onChangePage(page: number) {
    this.pageInfo.pageNum = page;
    this.refreshData();
  }
  onPageSizeChange(size: number) {
    this.pageInfo.pageSize = size;
    this.refreshData();
  }

  async querySearchAsync(queryString: string, db) {
    let result = await this.getData<PageInfoGetCustomerResp>(() =>
      customerApi.listCustomerUsingGET()
    );
    if (result) {
      let data = result.list;
      if (data) {
        data = data.filter(value =>
          value.customerName!.toLowerCase().includes(queryString.toLowerCase())
        );
      }
      db(data);
    }
  }
}
</script>


<style >
.el-dialog__header {
  padding: 20px 0px 6px 0px;
}
.el-dialog__body {
  padding: 0px 20px;
}
</style>

<style scoped>
.el-table .group-row {
  background: #ccdcf8 !important;
}
.el-table .cell {
  white-space: pre-line;
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

<style>
.quotations-panel .el-input__inner {
  padding: 0px !important;
  border-radius: 0px !important;
}

.quotations-panel .el-textarea__inner {
  padding: 0px !important;
  border-radius: 0px !important;
}
</style>


