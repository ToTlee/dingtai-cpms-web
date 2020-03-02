<!-- 系统管理-用户列表 -->
<template>
  <el-table
    :data="data"
    v-loading="isLoading"
    element-loading-text="正在加载..."
    stripe
    style="height:100%;"
    border
  >
    <el-table-column prop="userName" label="用户账号" sortable></el-table-column>
    <el-table-column prop="realName" label="姓名" sortable></el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="roleName" label="角色名称"></el-table-column>
    <el-table-column prop="createTime" label="创建时间"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { userApi, GetUserListResp } from "@/client/data-provider";
import { Component } from "vue-property-decorator";
import { UserInfo } from "../../authentication/user";

@Component
export default class Users extends ClientDataVue {
  data?: GetUserListResp[] = [];
  isLoading: boolean = false;
  async mounted() {
    this.isLoading = true;
    let result = await userApi.listUserInfoUsingGET();
    let resultData = this.getClientData(result);
    if (resultData.successed && resultData.data) {
      this.data = resultData.data.list;
    } else {
      this.data = [];
    }
    this.isLoading = false;
  }
}
</script>
