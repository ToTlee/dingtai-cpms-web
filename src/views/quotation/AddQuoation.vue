<template>
  <div class="add-root">
    <el-row style="margin:6px" type="flex" align="middle">
      <el-col :span="3">项目:</el-col>
      <el-col :span="9">
        <el-input size="mini" v-model="info.content"></el-input>
      </el-col>
      <el-col :span="3">客户:</el-col>
      <el-col :span="9" style="text-align:left">
        <el-autocomplete
          style="line-height:12px;width:200px"
          size="mini"
          v-model="info.customer"
          value-key="customerName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-row style="margin:6px">
      <el-col :span="3">备注:</el-col>
      <el-col :span="9">
        <el-input type="textarea" size="mini" v-model="info.remark"></el-input>
      </el-col>
    </el-row>
    <project-quoation ref="project"></project-quoation>
    <div class="button-panel">
      <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
      <el-button size="mini">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ClientDataVue,
  AddDetailQuotationReq,
  quotationApi,
  GetQuotationInfoResp,
  customerApi,
  PageInfoGetCustomerResp
} from "@/client-api";
import { Emit, Prop, Component } from "vue-property-decorator";
import ProjectQuoation from "./ProjectQuoation.vue";
import { QuotationDetailInfo, createTempInfo } from "./quotation";

@Component({
  components: {
    ProjectQuoation
  }
})
export default class AddQuoation extends ClientDataVue {
  info: AddDetailQuotationReq = {
    content: "",
    customer: "",
    remark: "",
    detailLst: [],
    quotation: 0
  };

  async onSubmit() {
    let vm = this;
    let p: any = this.$refs.project;
    this.info.detailLst = p.data.detailLst;
    let result = await this.requestWithoutResult(() =>
      quotationApi.addDetailQuotationUsingPOST(vm.info)
    );
    if (result) {
      this.$message.success("添加成功");
      this.submit();
    }
  }
  async querySearchAsync(queryString: string, db) {
    let result = await this.getData<PageInfoGetCustomerResp>(() =>
      customerApi.listCustomerUsingGET()
    );
    if (result) {
      let data = result.list;
      if (data) {
        data = data.filter(value =>
          value.customerName!.toLowerCase().includes(queryString.toLowerCase())
        );
      }
      db(data);
    }
  }

  @Emit()
  submit() {
    return this.info;
  }
  @Emit()
  cancel() {}
}
</script>

<style scoped>
.add-root {
  font-family: "宋体";
  font-size: 12px;
}

.button-panel {
  margin: 10px 0px;
}
</style>