<template>
    <el-form label-width="80px">
        <el-form-item label="收款金额:">
            <div class="money-input">
                <el-input  v-model="info.receiveMoney" style="flex:1;margin-right:10px"></el-input>
                <span>元</span>
            </div>
        </el-form-item>
        <el-form-item label="收款人:">
            <el-input v-model="info.receivePerson"></el-input>
        </el-form-item>
        <el-form-item label="收款方式:">
            <el-input v-model="info.receiveMethod"></el-input>
        </el-form-item>
        <el-form-item label="收款时间:">
            <el-date-picker v-model="info.receiveTime" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
            <el-input v-model="info.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="cancel">放弃</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import {ClientDataVue} from '@/client/client-types'
import {Component, Emit, Prop, PropSync} from 'vue-property-decorator';
import {GetContractReceivablesResp,proceedsApi} from '@/client/data-provider'
	import { Form } from 'element-ui';

@Component
export default class AddProceedsForm extends ClientDataVue{
    @PropSync('contractId')
    contractIdSync?: number;
    info: GetContractReceivablesResp = {
        receiveMoney: 0,
        receivePerson:'',
        receiveMethod:'',
        receiveTime:new Date(),
        remark:'',
        contractId:-1
        
    };

    async onSubmit(){
        console.log('111111111111');
        this.info.contractId = this.contractIdSync;
        let resResult = await proceedsApi.addContractReceivablesUsingPOST(this.info);
        let result = this.getClientData(resResult);
        if(result.successed){
            this.$message.success(result.message!);
            this.submit(this.info);
        }
    }

    @Emit()
    cancel(){}

    @Emit()
    async submit(info: GetContractReceivablesResp){
        console.log(info);
        return info;
    }

}
</script>

<style lang="scss" scoped>
.money-input{
    display: inline-flex;
}
</style>