<template>
  <div id="app">
    <router-view style="flex:1"></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "app",
  components: {}
};
</script>

<style lang="scss">
@import "./element-variables.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-title {
  padding-left: 4px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 22px;
  color: $--color-primary;
  text-align: left;
}

.dot {
  width: 12;
  height: 12;
}

.echarts {
  width: 100%;
  height: 100%;
}

.el-table .cell {
  white-space: pre-line !important;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.el-table--border th.gutter:last-of-type {
  background-color: transparent;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
