

<template>
  <div class="form-root">
    <el-form label-width="100px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人:" required>
            <el-input v-model="customerInfo.info.contacts"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码:" required>
            <el-input v-model="customerInfo.info.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址:" required>
            <el-input v-model="customerInfo.info.address" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="统一社会信用吗:" required>
            <el-input v-model="customerInfo.info.credit_code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开户行:" required>
            <el-input v-model="customerInfo.info.bank"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话:" required>
            <el-input v-model="customerInfo.info.tel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发票内容:" required>
            <el-input v-model="customerInfo.info.invoice_content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发票类型:" required>
            <el-input v-model="customerInfo.info.invoice_type"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户:" required>
            <el-input v-model="customerInfo.info.account"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="注册地址:" required>
            <el-input v-model="customerInfo.info.register_address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱:" required>
            <el-input v-model="customerInfo.info.mail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="对接人:" required>
            <el-input v-model="customerInfo.info.connector"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注:" required>
            <el-input v-model="customerInfo.info.connector"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目代号:" required>
            <el-input v-model="customerInfo.info.project_target"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="normal">
        <el-button type="primary" @click="saveCustomer">保存</el-button>
        <el-button @click="cancelCustomer">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client-api";
import {
  customerApi,
  AddCustomerReq,
  UpdateCustomerReq,
  Result,
  roleApi,
  GetRoleInfoResp,
  PageInfoGetRoleInfoResp
} from "@/client-api";
import { CustomerCreator, CustomerInfo } from "./CustomerInfo";
import Component, { createDecorator } from "vue-class-component";
import { Emit, Prop, PropSync } from "vue-property-decorator";

@Component
export default class AddCustomer extends ClientDataVue {
  @Prop({ default: undefined })
  info?: CustomerInfo;
  allRoles?: Array<GetRoleInfoResp> = [];
  async mounted() {
    if (this.info) {
      //编辑信息
      let result = await customerApi.getCustomerUsingGET(this.info.info!.id!);
      this.info.info = result.data;
      debugger;
    }
  }
  isSearching = false;
  get customerInfo(): CustomerInfo {
    let info = new CustomerInfo(CustomerCreator.createEmptyCustomer());
    return ClientDataVue.observable(info);
  }

  @Emit()
  submit() {
    return this.customerInfo;
  }

  @Emit()
  cancel() {}

  async saveCustomer() {
    let currentInfo = this.customerInfo.info!;
    if (this.info) {
      let data: UpdateCustomerReq = {
        customerName: currentInfo.customerName,
        contacts: currentInfo.contacts,
        mail: currentInfo.mail,
        tel: currentInfo.tel,
        remark: currentInfo.remark,
        projectTarget: currentInfo.projectTarget,
        connector: currentInfo.connector,
        registerAddress: currentInfo.registerAddress,
        account: currentInfo.account,
        invoiceType: currentInfo.invoiceType,
        invoiceContent: currentInfo.invoiceContent,
        bank: currentInfo.bank,
        creditCode: currentInfo.creditCode,
        bankName: currentInfo.bankName,
        address: currentInfo.address,
        phone: currentInfo.phone
      };
      let result = await customerApi.updateCustomerUsingPOST(data);
      if (result.status == 0) {
        this.$message.success("修改成功");
        this.submit();
      } else {
        this.$message.error(result.msg!);
      }
    } else {
      //添加
      let data: AddCustomerReq = {
        customerName: currentInfo.customerName,
        contacts: currentInfo.contacts,
        mail: currentInfo.mail,
        tel: currentInfo.tel,
        remark: currentInfo.remark,
        projectTarget: currentInfo.projectTarget,
        connector: currentInfo.connector,
        registerAddress: currentInfo.registerAddress,
        account: currentInfo.account,
        invoiceType: currentInfo.invoiceType,
        invoiceContent: currentInfo.invoiceContent,
        bank: currentInfo.bank,
        creditCode: currentInfo.creditCode,
        bankName: currentInfo.bankName,
        address: currentInfo.address,
        phone: currentInfo.phone
      };

      let result = await customerApi.addCustomerUsingPOST(data);
      if (result.status == 0) {
        this.$message.success("添加成功");
        this.submit();
      } else {
        this.$message.error(result.msg!);
      }
    }
  }

  cancelCustomer() {
    let vm = this;
    this.$msgbox
      .confirm("是否放弃当前编辑内容?")
      .then(() => {
        vm.cancel();
      })
      .catch(() => {});
  }
  private async commitCustomer(
    contractCallback: (...para: any) => Promise<Result>
  ): Promise<boolean> {
    let data = this.customerInfo;
    let result = await this.requestWithoutResult(contractCallback);

    return result;
  }

  getDate(value: Date | string) {
    if (value instanceof Date) {
      return value.date();
    }
    return new Date(value).date();
  }
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";

.form-root {
  width: 660px;
  text-align: left;
  max-height: 700px;
  overflow: auto;
}
.form-root .el-form-item {
  margin-bottom: 10px;
}
.info-header {
  font-size: 15px;
  color: $--color-primary;
}
.timeline {
  margin-top: 10px !important;
  padding: 0px !important;
}

.period-title {
  font-weight: bold;
}
.period-content {
  color: gray;
}
</style>
