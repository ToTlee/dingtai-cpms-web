<!-- 用户管理模块 -->
<template>
  <div class="user-root">
    <div class="page-title">用户管理</div>
    <div class="user-tools">
      <el-button type="primary" size="small" @click="addUser">添加</el-button>
    </div>
    <el-dialog
      :visible.sync="addUserVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加用户"
      width="fit-content"
      height="fit-content"
      :show-close="true"
    >
      <add-user-form ref="addForm" @submit="submitUser" @cancel="cancleAddUser"></add-user-form>
    </el-dialog>
    <div class="user-content">
      <users ref="listForm"></users>
    </div>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { Component } from "vue-property-decorator";
import Users from "./Users.vue";
import AddUser from "./AddUser.vue";
import { UserInfo } from "./UserInfo";
@Component({
  components: {
    Users,
    "add-user-form": AddUser
  }
})
export default class Index extends ClientDataVue {
  addUserVisible: boolean = false;
  queryString: string | number = "";

  addUser() {
    this.addUserVisible = true;
  }

  cancleAddUser() {
    this.addUserVisible = false;
  }
  submitUser(info?: UserInfo) {
    if (info) {
      //this.data.push(info.info!);
    }
    this.addUserVisible = false;
  }
  async search() {
    let addform: any = this.$refs.addForm;
    let result = await addform.search(this.queryString);
  }
}
</script>

<style lang="scss" scoped>
.user-root {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.user-tools {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 10px;
}

.user-content {
  flex: 1;
  padding: 8px;
}
</style>
