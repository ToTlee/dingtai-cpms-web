<!-- 合同管理模块 -->
<template>
  <div class="contracts-root">
    <div class="page-title">项目合同信息</div>
    <div class="contracts-tools">
      <el-button type="primary" size="small">客户资料</el-button>
      <el-button type="primary" size="small">添加</el-button>
    </div>
    <div class="contracts-content">
      <contracts></contracts>
    </div>
  </div>
</template>

<script>
import Contracts from "./Contracts";

export default {
  data() {
    return {};
  },
  components: {
    Contracts
  }
};
</script>

<style lang="scss" scoped>
.contracts-root {
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
</style>
