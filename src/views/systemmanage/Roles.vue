<!-- 系统管理-角色列表 -->
<template>
  <div class="roles-panel">
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
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="addRoleVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加角色"
      width="fit-content"
      height="fit-content"
      :show-close="false"
    >
      <add-Role-form :info="currentRoleInfo" @submit="submitRole" @cancel="cancleAddRole"></add-Role-form>
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
import { ClientDataVue } from "@/client/client-types";
import {
  roleApi,
  GetRoleListResp,
  PageInfoGetRoleListResp
} from "@/client/data-provider";
import { Component } from "vue-property-decorator";
import { DataListVue } from "../DataListVue";
import { RoleInfo } from "./RoleInfo";
import AddRole from "./AddRole.vue";
import Overview from "../overview/Overview.vue";

@Component({
  components: {
    "add-Role-form": AddRole
  }
})
export default class Roles extends DataListVue {
  data: Array<GetRoleListResp> = [];
  dialogTableVisible: boolean = false;
  dialogComponent: any = "";
  dialogTitle: string = "";
  currentInfo: GetRoleListResp = {};
  isLoading: boolean = false;
  addRoleVisible: boolean = false;
  selectedItems: Array<GetRoleListResp> = [];
  currentRoleInfo?: RoleInfo = {};
  async mounted() {
    await this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    let result = await roleApi.listRoleInfoUsingGET();
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

  handleSelectionChange(selection: Array<GetRoleListResp>) {
    this.selectedItems = selection;
  }

  onAddItem() {
    this.currentRoleInfo = undefined;
    this.addRoleVisible = true;
    return true;
  }
  async onEditItem() {
    let vm = this;
    if (vm.selectedItems.length == 1) {
      let cinfo = new RoleInfo(vm.selectedItems[0]);
      this.currentRoleInfo = cinfo;
      this.addRoleVisible = true;
    } else {
      this.$message.warning("必须选中一项！");
    }
  }
  onDeleteItem() {
    let vm = this;
    if (this.selectedItems.length == 0) return;
    this.$msgbox
      .confirm("是否确定删除选中的角色?")
      .then(async () => {
        for (let i = 0; i < vm.selectedItems.length; i++) {
          const element = vm.selectedItems[i];
          await vm.requestWithoutResult(() =>
            roleApi.deleteRoleUsingPOST(element.id!)
          );
          vm.data.splice(vm.data.indexOf(element), 1);
        }
        vm.$message.success(
          "成功删除" + this.selectedItems.length + "个角色！"
        );
      })
      .catch();
  }

  onRefresh(): void {
    this.refreshData();
  }

  submitRole(info: RoleInfo) {
    if (this.currentInfo) {
      //更新
      let index = this.data.indexOf(this.currentRoleInfo?.info!);
      this.$set(this.data, index, info.info);
    } else {
      //添加
      this.data.push(info.info!);
    }
    this.addRoleVisible = false;
    this.refreshData();
  }

  cancleAddRole() {
    this.addRoleVisible = false;
  }

  openInfo(command: string, row: GetRoleListResp) {
    let component = Overview;
    this.currentInfo = row;
    if (command == "proceeds") {
      this.dialogComponent = "proceeds-record";
      this.dialogTitle = row.roleName + "用户情况";
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
    let result = await this.getData<PageInfoGetRoleListResp>(() =>
      roleApi.listRoleInfoUsingGET(
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
.roles-panel {
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
.roles-root .el-dialog__body {
  padding: 0px;
  font-size: 14px;
}
</style>

