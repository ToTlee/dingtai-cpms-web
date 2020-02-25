<!-- 合同管理-客户列表 -->
<template>
<el-table :data="data" v-loading="isLoading" element-loading-text="正在加载..." stripe style="height:100%;"  border>
    <el-table-column prop="customerName" label="供应商名称" sortable>
    </el-table-column>
    <el-table-column prop="contacts" label="联系人" sortable>
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
</template>

<script lang="ts">
import {ClientDataVue} from '@/client/client-types'
import {
    customerApi, GetCustomerResp
} from '@/client/data-provider'
import {Component} from 'vue-property-decorator';

@Component
export default class Customers extends ClientDataVue{
    data?: GetCustomerResp[] = [];
    isLoading:boolean = false;
    async mounted() {
        this.isLoading = true;
        let result = await customerApi.listCustomerUsingGET();
        let resultData = this.getClientData(result);
        if(resultData.successed && resultData.data) {
            this.data = resultData.data.list;
        } else{
            this.data = [];
        }
        this.isLoading = false;
    };
}
</script>
