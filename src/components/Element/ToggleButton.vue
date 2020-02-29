<template>
  <div class="tb-container">
    <div>
      <slot name="header"></slot>
      <el-button>{{ label }}</el-button>
    </div>
    <slot vj-if="isChecked" @click="toggle"> </slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ToggleButton extends Vue {
  isChecked: boolean = false;

  get label() {
    return this.isChecked ? "展开" : "收起";
  }

  toggle() {
    this.isChecked = !this.isChecked;
  }
}
</script>

<style lang="scss">
.tb-container {
  display: flex;
}
</style>
