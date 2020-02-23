<!-- 合同列表 -->
<template>
<div>
    <el-table :data="data" stripe style="height:100%" size="small">
        <el-table-column prop="id" label="序号" fixed>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号" fixed>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" fixed>
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称">
        </el-table-column>
        <el-table-column prop="signTime" label="签订日期">
        </el-table-column>
        <el-table-column prop="contractMoney" label="合同金额">
        </el-table-column>
        <el-table-column prop="status" label="完成情况">
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
    GetContractListResp
} from '@/client/data-provider'
import Component from 'vue-class-component'

@Component
export default class Contracts extends Vue {
    data: Array < GetContractListResp > | undefined = [];
    async mounted() {
        let result = await contractApi.listContractUsingGET();
        if (result.status == 0) {
            let list = result.data?.list;
            if (list) {
                list.sort((a, b) => a.id!-b.id!);
            } else {
                list = [];
            }
            this.data = list;
        } else {
            this.$message.error(result.msg as string);
        }
    }
}
</script>
