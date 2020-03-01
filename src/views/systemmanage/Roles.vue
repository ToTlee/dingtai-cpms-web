<!-- 系统管理-角色列表 -->
<template>
<el-table :data="data" v-loading="isLoading" element-loading-text="正在加载..." stripe style="height:100%;"  border>
    <el-table-column prop="roleName" label="角色名称">
    </el-table-column>
    <el-table-column prop="roleName" label="角色描述">
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间">
    </el-table-column>
</el-table>
</template>

<script lang="ts">
import {ClientDataVue} from '@/client/client-types'
import {
    roleApi,  GetRoleListResp
} from '@/client/data-provider'
import {Component} from 'vue-property-decorator';

@Component
export default class Roles extends ClientDataVue{
    data?: GetRoleListResp[] = [];
    isLoading:boolean = false;
    async mounted() {
        this.isLoading = true;
        let result = await roleApi.listRoleInfoUsingGET();
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
