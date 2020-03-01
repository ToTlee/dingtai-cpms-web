<template>
  <div class="form-root">
    <el-form label-width="100px" size="small">
      <div class="info-header">基本信息</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户名称:" required>
            <el-select
              v-model="contractInfo.info.customerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户关键词"
              :remote-method="searchCustomers"
              :loading="isSearching"
            >
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.customerName"
                :value="item.id"
              ></el-option>
            </el-select>
            <!-- <el-input v-model="contractInfo.info.customerName"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号:" required>
            <el-input v-model="contractInfo.info.contractNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同名称:" required>
            <el-input v-model="contractInfo.info.contractName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签订日期:" required>
            <el-date-picker v-model="contractInfo.info.signTime"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="合同金额:" required>
        <el-input v-model="contractInfo.info.contractMoney" placeholder="单位: 元"></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input type="textarea"></el-input>
      </el-form-item>
      <div class="info-header">合同分期</div>
      <el-form-item :label="'合同共分 '+contractInfo.periods.length+' 期'">
        <div v-if="contractInfo.periods.length == 0">
          <el-link type="primary" @click="showAddPeriodDialog">未添加合同期间</el-link>
        </div>
        <el-timeline class="timeline" v-if="contractInfo.periods.length > 0">
          <el-timeline-item
            v-for="(item, index) in contractInfo.periods"
            :key="index"
            hide-timestamp
            :timestamp="item.info.endTime.toString()"
            placement="bottom"
          >
            <div class="period-title">
              {{item.info.periodName}}
              <span>(共 {{item.info.periodMoney}} 元)</span>
            </div>
            <div class="period-content">{{item.info.periodContent ? item.info.periodContent:'无节点'}}</div>
            <div
              class="period-content"
            >{{item.info.startTime.date()}} 至 {{item.info.endTime.date()}}</div>
          </el-timeline-item>
          <el-timeline-item>
            <el-link type="primary" @click="showAddPeriodDialog" hide-timestamp>添加期间</el-link>
          </el-timeline-item>
        </el-timeline>
        <el-dialog
          :visible.sync="addPeriodVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          title="添加合同分期信息"
          width="fit-content"
          height="fit-content"
          :show-close="false"
          append-to-body
        >
          <add-period-form @submit="addPeriod" @cancel="cancelAddPeriod"></add-period-form>
        </el-dialog>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" @click="saveContract">保存</el-button>
        <el-button @click="cancelContract">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import {
  contractApi,
  customerApi,
  GetContractPeriodResp,
  GetContractResp,
  periodApi,
  Result,
  GetCustomerResp,
  PageInfoGetCustomerResp,
  AddContractReq,
  AddContractPeriodReq
} from "@/client/data-provider";
import { ContractCreator, ContractInfo, ContractPeroid } from "./ContractInfo";
import AddPeriodForm from "./AddPeriodForm.vue";
import Component, { createDecorator } from "vue-class-component";
import { Emit } from "vue-property-decorator";

@Component({
  components: {
    "add-period-form": AddPeriodForm
  }
})
export default class AddContractForm extends ClientDataVue {
  info?: ContractInfo;
  addPeriodVisible = false;
  isSearching = false;
  customers: Array<GetCustomerResp> = [];
  get contractInfo(): ContractInfo {
    let info = new ContractInfo(ContractCreator.createEmptyContract(), []);
    if (this.info) {
      //编辑信息
      info.info = ContractCreator.copyContract(this.info.info);
      this.info.periods?.forEach(p => {
        info.periods?.push({ info: ContractCreator.copyPeriod(p.info) });
      });
      if (this.info.periods) {
      }
    }
    return ClientDataVue.observable(info);
  }

  @Emit()
  submit() {
    if (this.info) {
      this.info = this.contractInfo;
      return undefined;
    } else {
      return this.contractInfo;
    }
  }

  @Emit()
  cancle() {}

  showAddPeriodDialog() {
    this.addPeriodVisible = true;
  }

  async searchCustomers(query: string) {
    this.isSearching = true;
    let data = await this.getData<PageInfoGetCustomerResp>(() =>
      customerApi.listCustomerUsingGET(
        1,
        50,
        "customer_name",
        undefined,
        undefined,
        query
      )
    );
    if (data && data.list) {
      this.customers = data.list;
    } else {
      this.customers = [];
    }
    this.isSearching = false;
  }

  addPeriod(info: GetContractPeriodResp) {
    if (info) {
      this.contractInfo.periods?.push({ info });
    }
    this.addPeriodVisible = false;
  }
  cancelAddPeriod() {
    this.addPeriodVisible = false;
  }

  async saveContract() {
    let vm = this;
    let result = false;
    let cinfo = this.contractInfo.info!;
    if (this.info) {
      //编辑
      result = await this.commitContract(
        () => contractApi.updateContractUsingPOST(vm.contractInfo.info!),
        data => periodApi.updateContractPeriodUsingPOST(data)
      );
    } else {
      //添加
      let data: AddContractReq = {
        contractMoney: cinfo.contractMoney,
        contractName: cinfo.contractName,
        contractNo: cinfo.contractNo,
        signTime: cinfo.signTime,
        customerId: cinfo.customerId,
        addContractPeriodReqs: []
      };
      if (this.contractInfo.periods) {
        data.addContractPeriodReqs = this.contractInfo.periods.map<
          AddContractPeriodReq
        >(p => {
          return {
            contractId: cinfo.id,
            startTime: p.info.startTime,
            endTime: p.info.endTime,
            periodName: p.info.periodName,
            periodContent: p.info.periodContent,
            periodMoney: p.info.periodMoney
          };
        });
      }

      result = await this.requestWithoutResult(() =>
        contractApi.addContractUsingPOST(data)
      );
    }
    if (result) {
      this.$message.success("添加成功");
      this.submit();
    }
  }

  cancelContract() {
    let vm = this;
    this.$msgbox.confirm("是否放弃当前编辑内容?").then(() => {
      vm.cancle();
    });
  }

  private async commitContract(
    contractCallback: (...para: any) => Promise<Result>,
    periodCallback: (...para: any) => Promise<Result>
  ): Promise<boolean> {
    let data = this.contractInfo;
    let result = await this.requestWithoutResult(contractCallback);
    if (result && data.periods) {
      for (let i = 0; i < data.periods.length; i++) {
        try {
          await this.requestWithoutResult(periodCallback, data.periods[i].info);
        } catch (error) {
          console.log(error);
        }
      }
    }
    return result;
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