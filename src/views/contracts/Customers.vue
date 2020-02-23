<!-- 合同管理-客户列表 -->
<template>
<el-table :data="data" stripe style="width: 100%;height:100%" size="small">
    <el-table-column prop="customerName" label="供应商名称">
    </el-table-column>
    <el-table-column prop="contacts" label="联系人">
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

<script>
import {
    customerApi,
} from '@/client/data-provider'

export default {
    data() {
        return {
            data:[]
        };
    },
    async mounted() {
        let result = await customerApi.listCustomerUsingGET();
        if(result.status == 0){
            this.data = result.data.list;
        }else{
            this.$message.error(result.msg);
        }
    },

}
</script>
