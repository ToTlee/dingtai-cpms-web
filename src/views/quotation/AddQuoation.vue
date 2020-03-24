<template>
  <div class="add-root">
    <el-row style="margin:6px" type="flex" align="middle">
      <el-col :span="3">项目类型:</el-col>
      <el-col :span="9" style="text-align:left">
        <el-autocomplete
          style="line-height:12px;width:200px"
          size="mini"
          v-model="data.category"
          value-key="category"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
        ></el-autocomplete>
      </el-col>
      <el-col :span="3">项目内容:</el-col>
      <el-col :span="9">
        <el-input size="mini" v-model="data.content"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin:6px">
      <el-col :span="3">备注:</el-col>
      <el-col :span="9">
        <el-input type="textarea" size="mini" v-model="data.remark"></el-input>
      </el-col>
    </el-row>
    <quotation-detail :data="priceInfo"></quotation-detail>
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
  quotationApi
} from "@/client-api";
import { Emit, Prop, Component } from "vue-property-decorator";
import QuotationDetail from "./QuotationDetail.vue";
import { QuotationDetailInfo, createTempInfo } from "./quotation";

@Component({
  components: {
    QuotationDetail
  }
})
export default class AddQuoation extends ClientDataVue {
  data: AddDetailQuotationReq = {
    content: "",
    remark: ""
  };

  priceInfo: QuotationDetailInfo = createTempInfo();

  async onSubmit() {
    // let vm = this;
    // this.priceInfo.basic.forEach(item => {
    //   vm.data.quotationExperimentEntity[item.id] = Number(item.value);
    // });
    // this.priceInfo.testing.forEach(item => {
    //   vm.data.quotationExperimentEntity[item.id] = Number(item.value);
    // });
    // this.priceInfo.prices.forEach(item => {
    //   if (item.children && item.children.length > 0) {
    //     item.children.forEach(child => {
    //       vm.data.quotationInventoryEntity[child.id] = child.price;
    //       vm.data.quotationTotalInventoryEntity[child.id] = child.total;
    //     });
    //   } else {
    //     vm.data.quotationInventoryEntity[item.id] = item.price;
    //     vm.data.quotationTotalInventoryEntity[item.id] = item.total;
    //   }
    // });
    // vm.data.quotationTotalInventoryEntity.total = this.priceInfo.total;
    // let result = await this.requestWithoutResult(() =>
    //   quotationApi.addDetailQuotationUsingPOST(this.data)
    // );
    // if (result) {
    //   this.$message.success("添加成功");
    //   this.submit();
    // }
  }
  async querySearchAsync(queryString: string, db) {
    // let result = await this.getData<PageInfoGetQuotationCategoryListResp>(() =>
    //   quotationCategoryApi.getProjectCategoryUsingGET()
    // );
    // if (result) {
    //   let data = result.list;
    //   if (data) {
    //     data = data.filter(value =>
    //       value.category!.toLowerCase().includes(queryString.toLowerCase())
    //     );
    //   }
    //   db(data);
    // }
  }

  @Emit()
  submit() {
    return this.data;
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