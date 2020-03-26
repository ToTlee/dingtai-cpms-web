<template>
  <el-form label-width="80px" size="mini">
    <el-form-item label="项目">
      <el-select v-model="category" placeholder="请选择" size="mini">
        <el-option
          v-for="(item,index) in categories"
          :key="index"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容">
      <el-select placeholder="请选择" v-model="id" size="mini">
        <el-option v-for="item in contents" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :disabled="!id">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  ClientDataVue,
  quotationApi,
  PageInfoGetNewQuotationDetailResp,
  GetNewQuotationDetailResp
} from "@/client-api";
import Component from "vue-class-component";
import { Watch, Emit } from "vue-property-decorator";
@Component
export default class AddItem extends ClientDataVue {
  category: string = "";
  id: number = -1;

  categories: Array<GetNewQuotationDetailResp> = [];
  contents: Array<GetNewQuotationDetailResp> = [];

  async mounted() {
    let result = await this.getData<PageInfoGetNewQuotationDetailResp>(() =>
      quotationApi.getQuotationRootInfoUsingGET(1, 99999)
    );
    if (result && result.list) {
      this.categories = result.list;
      if (this.categories.length > 0) {
        this.category = this.categories[0].name!;
      } else {
        this.category = "";
      }
    }
  }

  @Watch("category")
  async onCategoryChanged(newVal) {
    let result = await this.getData<PageInfoGetNewQuotationDetailResp>(() =>
      quotationApi.getDefaultSubQuotationByNameUsingGET(
        1,
        99999,
        undefined,
        undefined,
        0,
        newVal
      )
    );
    if (result && result.list) {
      this.contents = result.list;
      if (this.contents && this.contents.length > 0) {
        this.id = this.contents[0].id!;
      } else {
        this.id = -1;
      }
    }
  }

  onSubmit() {
    this.submit();
  }

  @Emit()
  submit() {
    let vm = this;
    if (!this.id) {
      return undefined;
    }
    let info = this.contents.find(t => t.id == vm.id);
    if (info) {
      let val = Object.assign({}, info);
      val.id = undefined;
      return {
        category: this.category,
        info: val
      };
    }
    return undefined;
  }
}
</script>