<!-- 合同管理模块 -->
<template>
  <div class="view-root">
    <div class="page-title">项目合同信息</div>
    <div class="contracts-tools">
      <div class="function-panel">
        <el-button type="primary" size="small" @click="addItem">添加</el-button>
        <el-button type="primary" size="small" @click="editItem">编辑</el-button>
        <el-button type="primary" size="small" @click="deleteItem">删除</el-button>
        <el-button type="primary" size="small" @click="refresh">刷新</el-button>
      </div>

      <div class="search-panel">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="输入关键字"
          @keyup.enter.native="search"
          size="small"
          v-model="queryString"
        >
          <!-- <el-select slot="prepend" placeholder="请选择检索段">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>-->
          <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="contracts-content">
      <router-view ref="dataView"></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";

import Component from "vue-class-component";
import { DataListVue } from "../DataListVue";
@Component({
  components: {}
})
export default class DataView extends Vue {
  queryString: string | number = "";

  async addItem() {
    let dataView: any = this.$refs.dataView;
    if (dataView.onAddItem) {
      let result = await dataView.onAddItem();
    }
  }
  async search() {
    let dataView: any = this.$refs.dataView;
    if (dataView.onSearch) {
      let result = await dataView.onSearch(this.queryString);
    }
  }

  deleteItem() {
    let dataView: any = this.$refs.dataView;
    if (dataView.onDeleteItem) {
      dataView.onDeleteItem();
    }
  }
  refresh() {
    let dataView: any = this.$refs.dataView;
    if (dataView.onRefresh) {
      dataView.onRefresh();
    }
  }
  editItem() {
    let dataView: any = this.$refs.dataView;
    if (dataView.onEditItem) {
      dataView.onEditItem();
    }
  }
}
</script>

<style lang="scss" scoped>
.view-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contracts-tools {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 10px;
}

.contracts-content {
  flex: 1;
  overflow: auto;
}
.function-panel {
  display: inline-flex;
  flex: 1;
}
.search-panel {
  display: inline-flex;
  text-align: right;
}
</style>
