<!-- 合同列表 -->
<template>
<div>
    <el-table :data="data" stripe style="height:100%" size="small">
        <el-table-column prop="customerName" label="供应商名称" width="180">
        </el-table-column>
        <el-table-column prop="contacts" label="联系人" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="bankName" label="开户名">
        </el-table-column>
        <el-table-column prop="creditCode" label="税号（统一社会信用代码）">
        </el-table-column>
        <el-table-column prop="bank" label="开户行">
        </el-table-column>
        <el-table-column prop="tel" label="电话">
        </el-table-column>
        <el-table-column prop="invoiceContent" label="发票内容">
        </el-table-column>
        <el-table-column prop="invoiceType" label="发票类型">
        </el-table-column>
        <el-table-column prop="account" label="账号">
        </el-table-column>
        <el-table-column prop="registerAddress" label="注册地址">
        </el-table-column>
    </el-table>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Message
} from 'element-ui'
import {
    contractApi,
    GetCustomerListResp
} from '@/client/data-provider'
import Component from 'vue-class-component'

@Component
export default class Contracts extends Vue{
    data:Array<GetCustomerListResp> | undefined = [];
    async mounted() {
        let result = await contractApi.listContractUsingGET();
        if (result.status == 0) {
            this.data = result.data?.list;
        } else {
            this.$message.error(result.msg as string);
        }
    }
}
</script>
