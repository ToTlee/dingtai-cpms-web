<template>
  <div class="input-root">
    <div>
      <div class="item-input-form">
        <div class="tile-text">基本信息</div>
        <div>
          <el-form label-width="100px" size="small">
            <el-form-item label="合同期间:">
              <el-select v-model="periodId">
                <el-option
                  v-for="item in periodOptions"
                  :key="item.id"
                  :label="item.periodName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="input-forms">
      <div class="item-input-form">
        <div class="tile-text">收款信息</div>
        <el-form label-width="100px">
          <el-form-item label="收款金额:" required>
            <div class="money-input">
              <el-input
                v-model="info.proceed.receiveMoney"
                style="flex:1;margin-right:10px"
                size="small"
              ></el-input>
              <span>元</span>
            </div>
          </el-form-item>
          <el-form-item label="收款人:" required>
            <el-input v-model="info.proceed.receivePerson" size="small"></el-input>
          </el-form-item>
          <el-form-item label="收款方式:" required>
            <el-input v-model="info.proceed.receiveMethod" size="small"></el-input>
          </el-form-item>
          <el-form-item label="收款时间:" required>
            <el-date-picker
              v-model="info.proceed.receiveTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="info.proceed.remark" type="textarea" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="item-input-form" style="margin-left:16px">
        <div class="tile-text">发票信息</div>
        <el-form class="item-input-form" label-width="100px">
          <el-form-item label="开票金额:" required>
            <div class="money-input">
              <el-input
                v-model="info.invoice.invoiceMoney"
                style="flex:1;margin-right:10px"
                size="small"
              ></el-input>
              <span>元</span>
            </div>
          </el-form-item>
          <el-form-item label="发票编号:" required>
            <el-input v-model="info.invoice.contractNo" size="small"></el-input>
          </el-form-item>
          <el-form-item label="开票人:" required>
            <el-input v-model="info.invoice.invoicePerson" size="small"></el-input>
          </el-form-item>
          <el-form-item label="开票日期:" required>
            <el-date-picker
              v-model="info.invoice.invoiceTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="info.invoice.remark" type="textarea" size="small"></el-input>
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
import { Component, Emit, Prop, PropSync, Watch } from "vue-property-decorator";
import {
  GetContractReceivablesResp,
  contractApi,
  proceedsApi,
  GetContractPeriodResp,
  periodApi,
  GetContractInvoiceResp,
  invoiceApi
} from "@/client/data-provider";
import { ContractPeroid, ContractCreator } from "./ContractInfo";

@Component
export default class AddProceedsForm extends ClientDataVue {
  @Prop()
  period?: ContractPeroid;
  @Prop()
  contractId?: number;
  periodId?: number = this.period?.info.id;

  periodOptions: Array<GetContractPeriodResp> = [];

  async mounted() {
    let data = await contractApi.getContractPeriodUsingGET(this.contractId!);
    let result = this.getClientData(data);
    if (result.successed) {
      this.periodOptions = result.data!;
    }
  }

  get info(): ContractPeroid {
    let contractPeroid: ContractPeroid = {
      info: ContractCreator.createEmptyPeriod()
    };
    contractPeroid.info.contractId = this.contractId;
    if (this.period) {
      contractPeroid.proceed = ContractCreator.copyProceed(this.period.proceed);
      contractPeroid.invoice = ContractCreator.copyInvoice(this.period.invoice);
    }
    return ClientDataVue.observable(contractPeroid);
  }

  @Watch("periodId")
  onPeriodId(newVal: number, oldVal: number) {
    this.info.proceed!.periodId = newVal;
    this.info.invoice!.periodId = newVal;
  }

  async onSubmit() {
    // 信息关联

    // 请求添加收款信息
    if (this.period) {
      await this.saveProceed(this.info.proceed!);
      // 更新
    } else {
      // 添加
      await this.saveInvoice(this.info.invoice!);
    }
  }

  async saveProceed(proceed: GetContractReceivablesResp) {
    if (proceed) {
      //原本为空
      let dataResult = await proceedsApi.updateContractReceivablesUsingPOST(
        this.info.proceed!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "添加收款项成功");
      }
    } else {
      let dataResult = await proceedsApi.addContractReceivablesUsingPOST(
        this.info.proceed!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "更新收款项成功");
      }
    }
  }
  async saveInvoice(invoice: GetContractInvoiceResp) {
    if (invoice) {
      //原本为空
      let dataResult = await invoiceApi.updateContractInvoiceUsingPOST(
        this.info.invoice!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "添加收款项成功");
      }
    } else {
      let dataResult = await invoiceApi.addContractInvoiceUsingPOST(
        this.info.invoice!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "更新收款项成功");
      }
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
.input-root {
  width: 600px;
}
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
