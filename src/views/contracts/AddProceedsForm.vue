<template>
  <div style="width:600px">
    <div class="input-forms">
      <div class="item-input-form">
        <div class="tile-text">收款信息</div>
        <el-form label-width="100px">
          <el-form-item label="收款金额:" required>
            <div class="money-input">
              <el-input v-model="info.receiveMoney" style="flex:1;margin-right:10px" size="small"></el-input>
              <span>元</span>
            </div>
          </el-form-item>
          <el-form-item label="收款人:" required>
            <el-input v-model="info.receivePerson" size="small"></el-input>
          </el-form-item>
          <el-form-item label="收款方式:" required>
            <el-input v-model="info.receiveMethod" size="small"></el-input>
          </el-form-item>
          <el-form-item label="收款时间:" required>
            <el-date-picker
              v-model="info.receiveTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="info.remark" type="textarea" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="item-input-form" style="margin-left:16px">
        <div class="tile-text">发票信息</div>
        <el-form class="item-input-form" label-width="100px">
          <el-form-item label="开票金额:" required>
            <div class="money-input">
              <el-input v-model="info.receiveMoney" style="flex:1;margin-right:10px" size="small"></el-input>
              <span>元</span>
            </div>
          </el-form-item>
          <el-form-item label="发票编号:" required>
            <el-input v-model="info.receiveMethod" size="small"></el-input>
          </el-form-item>
          <el-form-item label="开票人:" required>
            <el-input v-model="info.receivePerson" size="small"></el-input>
          </el-form-item>
          <el-form-item label="开票日期:" required>
            <el-date-picker
              v-model="info.receiveTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="info.remark" type="textarea" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <el-button @click="cancel">放弃</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { Component, Emit, Prop, PropSync } from "vue-property-decorator";
import {
  GetContractReceivablesResp,
  proceedsApi
} from "@/client/data-provider";
import { Form } from "element-ui";

@Component
export default class AddProceedsForm extends ClientDataVue {
  @PropSync("contractId")
  contractIdSync?: number;
  info: GetContractReceivablesResp = {
    receiveMoney: 0,
    receivePerson: "",
    receiveMethod: "",
    receiveTime: new Date(),
    remark: "",
    contractId: -1
  };

  async onSubmit() {
    this.info.contractId = this.contractIdSync;
    let resResult = await proceedsApi.addContractReceivablesUsingPOST(
      this.info
    );
    let result = this.getClientData(resResult);
    if (result.successed) {
      this.$message.success(result.message!);
      this.submit(this.info);
    }
  }

  @Emit()
  cancel() {}

  @Emit()
  async submit(info: GetContractReceivablesResp) {
    console.log(info);
    return info;
  }
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";

.input-forms {
  display: flex;
}

.tile-text {
  font-size: 18px;
  color: $--color-primary;
  margin-bottom: 10px;
  margin-left: 18px;
}

.money-input {
  display: inline-flex;
}

.item-input-form {
}

.item-input-form .el-form-item {
  margin-bottom: 2px;
}
</style>