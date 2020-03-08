<!-- 合同管理-客户列表 -->
<template>
  <div class="csutomers-panel">
    <el-table
      :data="data"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      stripe
      height="100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="60px" min-width="100px" sortable></el-table-column>
      <el-table-column prop="projectTarget" label="项目代号" min-width="100px" sortable></el-table-column>
      <el-table-column prop="customerName" label="客户名称" min-width="100px" sortable></el-table-column>
      <el-table-column prop="contacts" label="联系人"></el-table-column>
      <el-table-column prop="tel" label="联系电话"></el-table-column>
      <el-table-column prop="mail" label="邮箱地址"></el-table-column>
      <el-table-column prop="connector" label="对接人"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
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
              <el-dropdown-item icon="el-icon-s-cooperation" command="proceeds">跟进</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-order" command="customer-info">客户详情</el-dropdown-item>
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
      :visible.sync="addCustomerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加合同"
      width="fit-content"
      height="fit-content"
      :show-close="false"
    >
      <add-customer-form
        :info="currentCustomerInfo"
        @submit="submitCustomer"
        @cancel="cancleAddCustomer"
      ></add-customer-form>
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
  customerApi,
  GetCustomerResp,
  PageInfoGetCustomerResp
} from "@/client-api";
import { Emit, Prop } from "vue-property-decorator";
import { ExportOptions, ExportType } from "../data-view/ExportOptions";
import Component from "vue-class-component";
import { CustomerInfo } from "./CustomerInfo";
import Overview from "../overview/Overview.vue";
import AddCustomer from "./AddCustomer.vue";

@Component({
  components: {
    "add-customer-form": AddCustomer
  }
})
export default class Customers extends DataListVue {
  data: Array<GetCustomerResp> = [];
  pageInfo: PageInfo = { pageSize: 10, pageNum: 1, total: 0, pages: 0 };
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetCustomerResp = {};
  isLoading: boolean = false;
  addCustomerVisible: boolean = false;
  selectedItems: Array<GetCustomerResp> = [];
  currentCustomerInfo?: CustomerInfo = {};
  options: any = {
    title: "客户管理",
    showTools: true
  };
  @Prop()
  tagInfo?: any;
  async mounted() {
    await this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    let vm = this;
    let result = await this.getData<PageInfoGetCustomerResp>(() =>
      customerApi.listCustomerUsingGET(
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

  handleSelectionChange(selection: Array<GetCustomerResp>) {
    this.selectedItems = selection;
  }

  onAddItem() {
    this.currentCustomerInfo = undefined;
    this.addCustomerVisible = true;
    return true;
  }
  async onEditItem() {
    let vm = this;
    if (vm.selectedItems.length == 1) {
      let cinfo = new CustomerInfo(vm.selectedItems[0]);

      this.currentCustomerInfo = cinfo;
      this.addCustomerVisible = true;
    } else {
      this.$message.warning("必须选中一项！");
    }
  }
  onDeleteItem() {
    let vm = this;
    if (this.selectedItems.length == 0) return;
    this.$msgbox
      .confirm("是否确定删除选中的客户?")
      .then(async () => {
        for (let i = 0; i < vm.selectedItems.length; i++) {
          const element = vm.selectedItems[i];
          await vm.requestWithoutResult(() =>
            customerApi.deleteCustomerUsingPOST(element.id!)
          );
          vm.data.splice(vm.data.indexOf(element), 1);
        }
        vm.$message.success(
          "成功删除" + this.selectedItems.length + "个客户！"
        );
      })
      .catch();
  }

  onRefresh(): void {
    this.refreshData();
  }

  submitCustomer(info: CustomerInfo) {
    if (this.currentCustomerInfo) {
      //更新
      let index = this.data.indexOf(this.currentCustomerInfo.info!);
      this.$set(this.data, index, info.info);
    } else {
      //添加
      this.data.push(info.info!);
    }
    this.addCustomerVisible = false;
  }

  cancleAddCustomer() {
    this.addCustomerVisible = false;
  }

  async onSearch(query: string): Promise<boolean> {
    if (!query || query == "") {
      await this.refreshData();
      return true;
    }
    this.isLoading = true;
    let result = await this.getData<PageInfoGetCustomerResp>(() =>
      customerApi.listCustomerUsingGET(
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
  openInfo(command: string, row: GetCustomerResp) {
    let component = Overview;
    this.currentInfo = row;
    if (command == "proceeds") {
      this.dialogComponent = "proceeds-record";
      this.dialogTitle = row.customerName + "客户情况";
      this.dialogTableVisible = true;
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
}
</script>

<style lang="scss" scoped>
.csutomers-panel {
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

.customers-root .el-dialog__body {
  padding: 0px;
  font-size: 14px;
}
</style>