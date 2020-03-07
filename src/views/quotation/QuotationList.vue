<!-- 项目报价列表主页 -->
<template>
  <el-table
    :data="data"
    height="100%"
    v-loading="isLoading"
    element-loading-text="正在加载..."
    row-key="id"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    default-expand-all
  >
    <el-table-column prop="name" label="项目" sortable></el-table-column>
    <el-table-column prop="content" label="内容"></el-table-column>
    <el-table-column prop="quotation" label="报价(万元)"></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import Vue from "vue";
import { quotationApi, GetProjectQuotationListResp } from "@/client-api";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class QuotationList extends Vue {
  data = [];
  isLoading: boolean = false;

  @Prop()
  tagInfo?: any;
  async mounted() {
    this.tagInfo.title = "项目报价";
    this.isLoading = true;
    let result = await quotationApi.queryAllProjectQuotationUsingGET();
    if (result.status == 0 && result.data != undefined) {
      const groups = new Map<number, GetProjectQuotationListResp[]>();
      result.data.list?.forEach(value => {
        if (groups.has(value.id!)) {
          groups.get(value.id!)!.push(value);
        } else {
          groups.set(value.id!, []);
        }
      });
      let list: any = [];
      groups.forEach((value, key) => {
        list.push({
          id: "parent" + key,
          name: value[0].name,
          content: "11",
          remark: "11",
          quotation:
            "合计: " +
            value.map(v => v.quotation).reduce((pre, curr) => pre! + curr!),
          children: value
        });
      });
      this.data = list;
    } else {
      this.$message.error(result.msg as string);
    }
    this.isLoading = false;
  }
}
interface tableSpanParameter {
  row: any;
  column: any;
  rowIndex: any;
  columnIndex: any;
}
</script>
<style lang="scss" scoped>
.list-table {
  height: 100%;
  padding: 8px;
}
</style>