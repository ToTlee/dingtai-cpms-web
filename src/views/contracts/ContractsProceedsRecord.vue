<!-- 一个合同收款记录 -->
<template>
<div class="dialog-timeline" v-loading="isLoading" element-loading-text="正在加载...">
    <el-timeline v-if="!isLoading &&(data && data.length > 0)" style="flex:1">
        <el-timeline-item v-for="(item, index) in data" :key="index" :timestamp="item.receiveTime" placement="top"
            type='primary'>
            <el-card>
                <div class="item-first-line">
                    <div class="timeline-item-title">收款金额: {{item.receiveMoney}}元</div>
                    <div>收款方式: {{item.receiveMethod}}</div>
                </div>
                <div>收款人: {{item.receivePerson}}</div>
                <div>备注: {{item.remark}}</div>
            </el-card>
        </el-timeline-item>
        <el-timeline-item hide-timestamp timestamp="9999-99-99" type="success">
            <span style="font-weight:bold">合同款项已结清</span>
        </el-timeline-item>
    </el-timeline>
    <div style="font-size:18px;" v-if="!isLoading &&(!data || data.length == 0)">没有收款记录</div>
</div>
    
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop, Watch, PropSync} from 'vue-property-decorator'
import {contractApi, GetContractReceivablesResp} from '../../client/data-provider'

@Component
export default class ContractsProceedsRecord extends Vue{
    @PropSync('contractId',{type: Number,default :Number.NaN})
    contractId1!: number;
    isLoading:boolean = false;
    data:Array<GetContractReceivablesResp> = [];
    async mounted() {
        this.isLoading = true;
        console.log('----'+this.contractId1);
        if(this.contractId1 !== Number.NaN){
            let result = await contractApi.getContractReceivablesUsingGET(this.contractId1);
            if(result.status == 0 && result.data != undefined){
                this.data = result.data;
            }else{
                this.$message.error(result.msg as string);
            }
        }
        this.isLoading = false;
    };
    @Watch('contractId1')
    async contractIdChanged(){
        this.isLoading = true;
        if(this.contractId1 !== Number.NaN){
            let result = await contractApi.getContractReceivablesUsingGET(this.contractId1);
            if(result.status == 0 && result.data != undefined){
                this.data = result.data;
            }else{
                this.$message.error(result.msg as string);
            }
        }
        this.isLoading = false;
    }
}
</script>

<style lang="scss" scoped>
.dialog-timeline{
    text-align: left;
    width: 600px;
    height: 600px;
    display: flex;
    overflow: auto;
}
.item-first-line{
    display: inline-flex;
}

.timeline-item-title{
    font-weight: bold;
    width: 180px;
}

</style>