<script lang="ts">
export default {
  name: "EmptyReport",
}
</script>
<script setup lang="ts">

import Diagram from "@/components/Diagram.vue";
</script>

<template>
  <a-layout :style="{height:'100%'}">
    <a-layout-sider :style="{border:'1px solid black',height:'100%',backgroundColor:'transparent'}">
      <div class="diagramContainer">
        <span class="diagramTitle">图表</span>
        <Diagram/>
      </div>

    </a-layout-sider>
    <a-layout-content :style="{border:'1px solid black',height:'100%',
    backgroundColor:'transparent',marginLeft:'8px',overflowY:'auto',overflowX:'hidden'}">
      <a-row :gutter="24">
        <a-col :span="6">
          <div class="grid-content">组件 A</div>
        </a-col>
        <a-col :span="18">
          <div class="grid-content">组件 B</div>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.grid-content {
  box-sizing: border-box;
  background: #3574d3;
  border: 1px solid red;
  min-height: 150px;
  margin: 1px;
}

.diagramContainer .diagramTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}
</style>