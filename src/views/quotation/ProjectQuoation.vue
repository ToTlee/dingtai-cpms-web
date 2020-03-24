<template>
  <div class="project-root">
    <div>客户：{{data.customer}}</div>
    <div class="table-container">
      <el-table :data="detailLst" height="100%" style="width: 100%" size="mini">
        <el-table-column type="expand">
          <template slot-scope="props">
            <QuotationDetail :info="props.row" v-if="props.row.hasdetail"></QuotationDetail>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="内容" prop="name"></el-table-column>
        <el-table-column label="总计(万元)">
          <template slot-scope="props">
            <el-input
              v-if="!props.row.hasdetail && props.row.isEditting"
              v-model="props.row.totalcost"
              size="mini"
            />
            <span v-else>{{props.row.totalcost}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template slot-scope="props">
            <el-input
              v-if="!props.row.hasdetail && props.row.isEditting"
              v-model="props.row.remark"
              type="texterea"
              size="mini"
            />
            <span v-else>{{props.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <div>
              <el-button
                v-if="!props.row.hasdetail"
                type="text"
                size="mini"
                @click="onEditing(props.row)"
              >{{props.row.isEditting ?'确定':'编辑' }}</el-button>
              <el-button
                v-if="props.row.isEditting"
                type="text"
                size="mini"
                @click="cancelEditRow(props.row)"
              >取消</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="text">添加</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import {
  ClientDataVue,
  quotationApi,
  GetDetailQuotationResp,
  GetQuotationInfoResp
} from "@/client-api";
import { Component, Prop } from "vue-property-decorator";
import QuotationDetail from "./QuotationDetail.vue";

@Component({
  components: {
    QuotationDetail
  }
})
export default class ProjectQuoation extends ClientDataVue {
  @Prop({ type: Object, default: undefined, required: false })
  info?: GetQuotationInfoResp;
  data: GetDetailQuotationResp = {};

  get detailLst() {
    return this.data.detailLst ?? [];
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    let vm = this;
    if (!vm.info || !vm.info.id) return;
    let result = await this.getData<GetDetailQuotationResp>(() =>
      quotationApi.getDetailQuotationByIdUsingGET(vm.info!.id!)
    );
    if (result) {
      vm.data = result;
    }
  }
  async onEditing(row: GetQuotationInfoResp) {
    let _row: any = row;
    let editing = !!_row.editing;
    if (editing) {
      //确定
      // let result = await this.requestWithoutResult(() =>
      //   quotationApi.updateQuotationConditionUsingPOST({
      //     id: row.id!,
      //     content: row.content!,
      //     category: row.categoryName!,
      //     remark: row.remark
      //   })
      // );
      // if (result) {
      //   this.$message.success("更新报价信息成功！");
      //   delete _row.copy;
      //   this.$set(_row, "editing", false);
      // }
    } else {
      //开始编辑
      _row.copy = { ...row };
      this.$set(row, "isEditting", true);
    }
  }

  cancelEditRow(row) {
    let vm = this;
    if (row.copy) {
      Object.assign(row, row.copy);
      this.$set(row, "isEditting", false);
    }
  }
}
</script>
<style>
.table-container .el-table__expanded-cell {
  padding: 0px 0px 0px 30px;
}
</style>

<style scoped>
.project-root {
  width: 700px;
  height: 700px;
  text-align: left;
  font-size: 12px;
  font-family: "宋体";
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
}
</style>