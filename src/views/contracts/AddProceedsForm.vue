<template>
  <div class="input-root">
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
      <div style="margin-left:16px">
        <el-button type="text" v-if="!editingInvoice" @click="toggleEditInvoice">添加发票</el-button>
        <div v-if="editingInvoice" class="item-input-form">
          <div class="tile-text">
            发票信息
            <el-link type="danger" style="text-align:right" @click="toggleEditInvoice">取消</el-link>
          </div>
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
              <el-input v-model="info.invoice.invoiceNo" size="small"></el-input>
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
import { ContractPeroid, ContractCreator, ContractInfo } from "./ContractInfo";

@Component
export default class AddProceedsForm extends ClientDataVue {
  @Prop()
  period?: ContractPeroid;
  @Prop()
  contractId?: number;
  periodId?: number = this.period?.info.id;
  editingInvoice: boolean = true;

  get info(): ContractPeroid {
    let contractPeroid: ContractPeroid = {
      info: ContractCreator.createEmptyPeriod()
    };
    contractPeroid.info.contractId = this.contractId;
    if (this.period) {
      contractPeroid.proceed = ContractCreator.copyProceed(this.period.proceed);
      contractPeroid.proceed.contractId = this.contractId;
      contractPeroid.proceed.periodId = this.period.info.id;

      contractPeroid.invoice = ContractCreator.copyInvoice(this.period.invoice);
      contractPeroid.invoice.contractId = this.contractId;
      contractPeroid.invoice.periodId = this.period.info.id;
    }
    return ClientDataVue.observable(contractPeroid);
  }

  @Watch("period")
  onPeriod(newVal?: ContractPeroid) {
    this.editingInvoice = newVal?.invoice != undefined;
  }

  @Watch("periodId")
  onPeriodId(newVal: number, oldVal: number) {
    this.info.proceed!.periodId = newVal;
    this.info.invoice!.periodId = newVal;
  }

  toggleEditInvoice() {
    this.editingInvoice = !this.editingInvoice;
  }
  deleteInvoice() {
    let vm = this;
    this.$msgbox
      .confirm("是否取消添加发票?")
      .then(() => {
        if (vm.info.invoice && vm.info.invoice.id != undefined) {
          invoiceApi
            .deleteContractInvoiceUsingPOST(vm.info.invoice.id)
            .then(dataResult => {
              let result = vm.getClientData(dataResult);
              if (result.successed) {
                vm.toggleEditInvoice();
                vm.info.invoice = undefined;
              }
            })
            .catch(err => {
              vm.$message.error(err.message);
            });
        }
      })
      .catch(() => {});
  }
  async onSubmit() {
    if (this.period) {
      let result: ContractPeroid = {
        info: this.period.info
      };
      let proceedResult = await this.saveProceed(this.info.proceed!);
      if (proceedResult) {
        result.proceed = this.info.proceed;
      }
      if (this.editingInvoice) {
        let invoiceResult = await this.saveInvoice(this.info.invoice!);
        if (invoiceResult) {
          result.invoice = this.info.invoice;
        }
      }
      this.submit(result);
    } else {
      this.cancel();
    }
  }

  async saveProceed(proceed: GetContractReceivablesResp): Promise<boolean> {
    if (this.period?.proceed) {
      let dataResult = await proceedsApi.updateContractReceivablesUsingPOST(
        this.info.proceed!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "添加收款项成功");
        return true;
      }
    } else {
      let dataResult = await proceedsApi.addContractReceivablesUsingPOST(
        this.info.proceed!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "更新收款项成功");
        return true;
      }
    }
    return false;
  }
  async saveInvoice(invoice: GetContractInvoiceResp): Promise<boolean> {
    if (this.period?.invoice) {
      let dataResult = await invoiceApi.updateContractInvoiceUsingPOST(
        this.info.invoice!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "添加收款项成功");
        return true;
      }
    } else {
      let dataResult = await invoiceApi.addContractInvoiceUsingPOST(
        this.info.invoice!
      );
      let result = this.getClientData(dataResult);
      if (result.successed) {
        this.$message.success(result.message ?? "更新收款项成功");
        return true;
      }
    }
    return false;
  }
  @Emit()
  cancel() {}

  @Emit()
  async submit(info: ContractPeroid) {
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

.item-input-form .el-form-item {
  margin-bottom: 2px;
}
</style>
