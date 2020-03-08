<!-- 合同管理-客户列表 -->
<template>
  <el-table
    :data="data"
    v-loading="isLoading"
    element-loading-text="正在加载..."
    stripe
    height="100%"
    border
  >
    <el-table-column type="index" label="序号" width="60px" sortable></el-table-column>
    <el-table-column prop="projectTarget" label="项目代号" sortable></el-table-column>
    <el-table-column prop="customerName" label="客户名称" sortable></el-table-column>
    <el-table-column prop="contacts" label="联系人"></el-table-column>
    <el-table-column prop="tel" label="联系电话"></el-table-column>
    <el-table-column prop="mail" label="邮箱地址"></el-table-column>
    <el-table-column prop="connector" label="对接人"></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client-api";
import { customerApi, GetCustomerResp } from "@/client-api";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class Customers extends ClientDataVue {
  @Prop()
  tagInfo?: any;

  data?: GetCustomerResp[] = [];
  isLoading: boolean = false;
  async mounted() {
    this.tagInfo.title = "客户管理";
    this.isLoading = true;
    let result = await customerApi.listCustomerUsingGET();
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
