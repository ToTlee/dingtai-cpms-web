<template></template>

<script lang="ts">
import Vue from "vue";
import DataView from "./DataView.vue";
import Component from "vue-class-component";

@Component({
  components: {
    "data-view": DataView
  }
})
export default class Index extends Vue {}
</script>