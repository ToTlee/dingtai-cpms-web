<!-- 系统管理-用户列表 -->

<template>
  <div class="users-panel">
    <el-table
      v-loading="isLoading"
      element-loading-text="正在加载..."
      height="100%"
      :data="data"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userName" label="用户账号" sortable></el-table-column>
      <el-table-column prop="realName" label="姓名" sortable></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
      :visible.sync="addUserVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加用户"
      width="fit-content"
      height="fit-content"
      :show-close="false"
    >
      <add-user-form :info="currentUserInfo" @submit="submitUser" @cancel="cancleAddUser"></add-user-form>
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
import { ClientDataVue, PageInfo } from "@/client/client-types";
import {
  userApi,
  GetUserListResp,
  PageInfoGetUserListResp
} from "@/client/data-provider";
import { Component, Prop } from "vue-property-decorator";
import { DataListVue } from "../DataListVue";
import { UserInfo } from "./UserInfo";
import AddUser from "./AddUser.vue";
import Overview from "../overview/Overview.vue";

@Component({
  components: {
    "add-user-form": AddUser
  }
})
export default class Users extends DataListVue {
  data: Array<GetUserListResp> = [];
  pageInfo: PageInfo = { pageSize: 10, pageNum: 1, total: 0, pages: 0 };
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetUserListResp = {};
  isLoading: boolean = false;
  addUserVisible: boolean = false;
  selectedItems: Array<GetUserListResp> = [];
  currentUserInfo?: UserInfo = {};

  @Prop()
  tagInfo?: any;
  async mounted() {
    this.tagInfo.title = "用户管理";
    await this.refreshData();
  }
  async refreshData() {
    this.isLoading = true;
    let vm = this;
    debugger;
    let result = await this.getData<PageInfoGetUserListResp>(() =>
      userApi.listUserInfoUsingGET(vm.pageInfo.pageNum, vm.pageInfo.pageSize)
    );
    if (result) {
      this.pageInfo = result;
      let list = result?.list;
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

  handleSelectionChange(selection: Array<GetUserListResp>) {
    this.selectedItems = selection;
  }

  onAddItem() {
    this.currentUserInfo = undefined;
    this.addUserVisible = true;
    return true;
  }
  async onEditItem() {
    let vm = this;
    if (vm.selectedItems.length == 1) {
      let cinfo = new UserInfo(vm.selectedItems[0]);
      this.currentUserInfo = cinfo;
      this.addUserVisible = true;
    } else {
      this.$message.warning("必须选中一项！");
    }
  }
  onDeleteItem() {
    let vm = this;
    if (this.selectedItems.length == 0) return;
    let count = this.selectedItems.length;
    this.$msgbox
      .confirm("是否确定删除选中的用户?")
      .then(async () => {
        for (let i = 0; i < vm.selectedItems.length; i++) {
          const element = vm.selectedItems[i];
          await vm.requestWithoutResult(() =>
            userApi.deleteUserUsingPOST1(element.id!)
          );
          vm.data.splice(vm.data.indexOf(element), 1);
        }
        vm.$message.success("成功删除" + count + "个用户！");
      })
      .catch();
  }

  onRefresh(): void {
    this.refreshData();
  }

  submitUser(info: UserInfo) {
    debugger;
    if (this.currentInfo) {
      //更新
      let index = this.data.indexOf(this.currentUserInfo?.info!);
      this.$set(this.data, index, info.info);
    } else {
      //添加
      this.data.push(info.info!);
    }
    this.addUserVisible = false;
    this.refreshData();
  }

  cancleAddUser() {
    this.addUserVisible = false;
  }

  openInfo(command: string, row: GetUserListResp) {
    let component = Overview;
    this.currentInfo = row;
    if (command == "proceeds") {
      this.dialogComponent = "proceeds-record";
      this.dialogTitle = row.userName + "用户情况";
      this.dialogTableVisible = true;
    } else if (command == "invoice") {
    } else if (command == "customer-info") {
    }
  }

  async onSearch(query: string): Promise<boolean> {
    if (!query || query == "") {
      await this.refreshData();
      return true;
    }
    this.isLoading = true;
    let result = await this.getData<PageInfoGetUserListResp>(() =>
      userApi.listUserInfoUsingGET(
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
.users-panel {
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
.users-root .el-dialog__body {
  padding: 0px;
  font-size: 14px;
}
</style>
