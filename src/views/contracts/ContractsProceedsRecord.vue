<!-- 一个合同收款记录 -->
<template>
<div class="dialog-timeline" v-loading="isLoading" element-loading-text="正在加载...">
    <div class="top-panel">
        <div>
            合同编号: {{contractInfo.contractNo}}
        </div>
        <div>
            合同状态: {{contractInfo.status == 1? '已完成':'未完成'}}
        </div>
        <div style="flex:1;text-align:right;">
            <el-button type="text" @click="refashData">刷新</el-button>
        </div>
    </div>
    <el-timeline v-if="!isLoading &&(data && data.length > 0)" style="flex:1">
        <el-timeline-item v-for="(item, index) in data" :key="index" :timestamp="item.receiveTime" placement="top"
            type='primary'>
            <el-card>
                <div @mouseenter="itemEnter(item)" @mouseleave="itemLeave(item)">
                    <div class="item-first-line">
                        <div class="timeline-item-title">收款金额: {{item.receiveMoney}}元</div>
                        <div>收款方式: {{item.receiveMethod}}</div>
                    </div>
                    <div>收款人: {{item.receivePerson}}</div>
                    <div>备注: {{item.remark}}</div>
                    <div class="item-edit-panel" v-if="item.showEditor">
                        <el-button type="text" @click="editItem(item)">编辑</el-button>
                        <el-button type="text" @click="deleteItem(item)">删除</el-button>
                    </div>
                </div>
            </el-card>
        </el-timeline-item>
        <el-timeline-item hide-timestamp type="success" v-if="contractInfo.status == '已完成'">
            <span style="font-weight:bold">合同款项已结清</span>
        </el-timeline-item>
        <el-timeline-item hide-timestamp type="warning" v-if="contractInfo.status != '已完成'">
            <div class="inline-panel-center">
                <span style="font-weight:bold">合同款项待收取</span>
                <el-tooltip content="添加合同款项" placement="right">
                    <span class="add-button">
                        <i class="el-icon-circle-plus" @click="addItem(item)"></i>
                    </span>
                </el-tooltip>
                <el-dialog title="添加合同收款项" :visible.sync="addItemDialogVisible" append-to-body width="400px" height="fit-content">
                    <add-proceeds-form :contractId="contractInfo.id" @cancel="cancleAdd($event)" @submit="submitAddItem"></add-proceeds-form>
                </el-dialog>
            </div>
        </el-timeline-item>
    </el-timeline>
    <div style="font-size:18px;" v-if="!isLoading &&(!data || data.length == 0)">没有收款记录</div>
</div>
    
</template>

<script lang="ts">
import {ClientDataVue} from '@/client/client-types'
import {Component, Prop, Watch, PropSync} from 'vue-property-decorator'
import {contractApi,proceedsApi, GetContractReceivablesResp, GetContractResp} from '../../client/data-provider'

import AddProceedsForm from './AddProceedsForm.vue'
@Component({
    components:{
        "add-proceeds-form":AddProceedsForm
    }
})
export default class ContractsProceedsRecord extends ClientDataVue{
    @PropSync('info',{default : undefined})
    contractInfo!: GetContractResp;
    isLoading: boolean = false;
    addItemDialogVisible: boolean = false;
    data: Array<GetContractReceivablesResp> = [];

    async mounted() {
        await this.requestData();
    };
    
    @Watch('info')
    async contractIdChanged(){
        await this.requestData();
    }

    async requestData(){
        this.isLoading = true;
        if(this.contractInfo){
            let result = await contractApi.getContractReceivablesUsingGET(this.contractInfo.id!);
            let resultData = this.getClientData<Array<GetContractReceivablesResp>>(result);
            if(resultData.successed && resultData.data != undefined){
                this.data = resultData.data;
            } else{
                this.data = [];
            }
        }
        this.isLoading = false;
    }
    async refashData(){
        await this.requestData();
    }

    itemEnter(item :any ){
        this.$set(item,'showEditor',true);
    }

    itemLeave(item :any ){
         this.$set(item,'showEditor',false);
    }
    deleteItem(item : GetContractReceivablesResp){
        this.$confirm('是否删除该收款项, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
            let result = proceedsApi.deleteContractReceivablesUsingPOST(item.id!);
            result.then(r =>{
                let resultValue = this.getClientData(r);
                if(resultValue.successed){
                    let index = this.data.findIndex(value => value.id == item.id);
                    this.data.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
    }
    editItem(item : GetContractReceivablesResp){

    }
    

    addItem(item : GetContractReceivablesResp){
        this.addItemDialogVisible= true;
    }

    closeAddItemDialog(){
        this.addItemDialogVisible = false;
    }

    submitAddItem(newItem: GetContractReceivablesResp){
        this.data.push(newItem);
        this.closeAddItemDialog();
    }

    cancleAdd(){
        this.closeAddItemDialog();
    }
}
</script>

<style lang="scss" scoped>
@import '@/element-variables.scss';

.dialog-timeline{
    text-align: left;
    width: 600px;
    height: 600px;
    display: flex;
    flex-direction: column;
    overflow: auto;
}
.item-first-line{
    display: inline-flex;
}

.timeline-item-title{
    font-weight: bold;
    width: 180px;
}

.item-edit-panel{
    position: absolute;
    bottom: 0px;
    right: 8px;
    display: inline-flex;
}
.top-panel{
    display: inline-flex;
    align-items: center;
    margin-left: 30px;
    margin-bottom: 20px;
}
.add-button{
    margin-left: 8px;
    cursor: pointer;
    font-size: 20px;
    color: $--color-primary;
}
.inline-panel-center{
    display: flex;
    align-items: center;
}

</style>