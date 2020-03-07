<template>
  <el-form label-width="100px" size="small" @submit="onSubmit" class="form-root">
    <el-row>
      <el-col :span="12">
        <el-form-item label="期间名称:" required>
          <el-input v-model="info.periodName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="分期金额:" required>
          <el-input v-model="info.periodMoney" placeholder="单位: 元"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="分期节点:" required>
          <el-input v-model="info.periodContent"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态:" required>
          <el-input v-model="info.status"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="开始日期:" required>
          <el-date-picker v-model="info.startTime"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束日期:" required>
          <el-date-picker v-model="info.endTime"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="备注:">
      <el-input type="textarea"></el-input>
    </el-form-item>
    <el-form-item style="text-align: center;" size="normal">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { GetContractPeriodResp } from "@/client/api";
import { ContractCreator } from "./ContractInfo";
import { Component, Emit, Prop } from "vue-property-decorator";
@Component
export default class AddPeroidForm extends ClientDataVue {
  @Prop()
  period?: GetContractPeriodResp;
  get info() {
    let p = ContractCreator.copyPeriod(this.period);
    return ClientDataVue.observable(p);
  }

  onSubmit() {
    this.submit();
  }

  @Emit()
  submit() {
    return this.info;
  }
  @Emit()
  cancel() {}
}
</script>
<style lang="scss" scoped>
.form-root {
  max-height: 70%;
}
</style>