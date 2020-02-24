<!-- 合同列表 -->
<template>
    <div>
        <el-table :data="data" stripe style="height:100%" border>
            <el-table-column prop="id" label="序号" fixed>
            </el-table-column>
            <el-table-column prop="contractNo" label="合同编号" fixed sortable>
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称" fixed sortable>
            </el-table-column>
            <el-table-column prop="contractName" label="合同名称">
            </el-table-column>
            <el-table-column prop="signTime" label="签订日期">
            </el-table-column>
            <el-table-column prop="contractMoney" label="合同金额">
            </el-table-column>
            <el-table-column prop="status" label="完成情况">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-dropdown szie="medium" @command="openInfo($event,scope.row)">
                        <span class="el-dropdown-link">
                            <el-button size="medium" type="primary">查看<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-s-cooperation" command="proceeds">收款记录</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-s-order" command="invoice">发票记录</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-s-order" command="customer-info">客户资料</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="详细信息" :visible.sync="dialogTableVisible" width="fit-content" height="fit-content" lock>
            <component :is="dialogComponent" :contractId="currentId"></component>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Message,
    Form
} from 'element-ui'
import {
    contractApi, GetContractListResp
} from '@/client/data-provider'
import Component from 'vue-class-component'
import auth from '@/authentication/authentication'
import {
    AuthVueRouter
} from '@/router/index'

import Overview from '../overview/Overview.vue'
import ContractsProceedsRecord from './ContractsProceedsRecord.vue'

@Component({
    components: {
        "proceeds-record": ContractsProceedsRecord
    }
})
export default class Contracts extends Vue {
    data: Array<GetContractListResp> = [];
    dialogTableVisible:boolean = false;
    dialogComponent : any = '';
    currentId:number = Number.MIN_VALUE;
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
            (this.$router as AuthVueRouter).clearLogin();
            this.$message.error(result.msg as string);
        }
    };
    openInfo(command: string, row: GetContractListResp){
        let component = Overview;
        this.currentId = row.id!;
        if(command == "proceeds"){
            this.dialogComponent = "proceeds-record";
            this.dialogTableVisible = true;
        }else if(command == "invoice"){

        }
        else if(command == "customer-info"){

        }
    }

}
</script>


<style lang="scss" scoped>
.el-dropdown-link {
    cursor: pointer;
    font-size: 18px;
}


.dialog-timeline .el-card__body{
    padding: 8px;
}

.timeline-item-title{
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 8px;
}

</style>