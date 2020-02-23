<!-- 项目报价列表主页 -->
<template>
<div>
    <el-table :data="data" style="height:100%" row-key="id" size="small" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all>
        <el-table-column prop="name" label="项目" sortable>
        </el-table-column>
        <el-table-column prop="content" label="内容">
        </el-table-column>
        <el-table-column prop="quotation" label="报价(万元)">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
    </el-table>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    quotationApi,
    GetProjectQuotationListResp
} from '@/client/data-provider'
import Component from 'vue-class-component';

@Component
export default class QuotationList extends Vue {
    data = [];
    async mounted() {
        let result = await quotationApi.queryAllProjectQuotationUsingGET();
        if (result.status == 0 && result.data != undefined) {
            const groups = new Map<number,GetProjectQuotationListResp[]>();
            result.data.list?.forEach(value => {
                if (groups.has(value.id!)) {
                    groups.get(value.id!) !.push(value);
                } else {
                    groups.set(value.id!, []);
                }
            });
            let list: any = [];
            groups.forEach((value, key) => {
                list.push({
                    id: "parent" + key,
                    name: value[0].name,
                    quotation: '合计: '+value.map(v => v.quotation).reduce((pre, curr) => pre!+curr!),
                    children: value
                });
            });
            this.data = list;
        } else {
            this.$message.error(result.msg as string);
        }
    };
}
interface tableSpanParameter {
    row: any,
        column: any,
        rowIndex: any,
        columnIndex: any
}
</script>
