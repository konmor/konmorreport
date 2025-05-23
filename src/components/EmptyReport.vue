<script lang="ts">
export default {
  name: "EmptyReport",
}
</script>
<script setup lang="ts">
import Diagram from "@/components/Diagram.vue";
import draggable from "vuedraggable";
import {reactive} from "vue";

function generateRandomBrightColor() {
  var r = Math.floor(Math.random() * 256) + 50; // 控制增加的值为50
  var g = Math.floor(Math.random() * 256) + 50;
  var b = Math.floor(Math.random() * 256) + 50;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

const testDown = (event: MouseEvent) => {
  console.log('testDown', event);
}
const testUp = (event: MouseEvent) => {
  console.log('testUp', event);
}
const testMove = (event: MouseEvent) => {
  console.log('testMove', event);
}
const items = reactive<{ value: number, x?: number, y?: number, xSpan?: number, ySpan?: number }[]>([]);

for (let i = 0; i < 500; i++) {
  if (i == 1) {
    items.push({value: i, x: 2, y: 1, xSpan: 5, ySpan: 1});
  } else {
    items.push({value: i});
  }
}
</script>

<template>
  <a-layout :style="{height:'100%'}">
    <a-layout-sider :style="{border:'1px solid black',height:'100%',backgroundColor:'transparent'}">
      <div class="diagramContainer">
        <span class="diagramTitle">图表</span>
        <!--        <Diagram @mousedown="testDown($event)" @mouseup="testUp($event)" @mousemove="testMove($event)"/>-->
        <Diagram/>
      </div>
    </a-layout-sider>
    <a-layout-content :style="
    {
      border:'1px solid black',
      height:'100%',
      backgroundColor:'transparent',
      marginLeft:'8px',
      overflowY:'auto',
      overflowX:'hidden',

      /*alignContent:'center'*/}"
    >

      <draggable :style="{
         display:'grid',
          gridTemplateColumns:'repeat(24,1fr)',
          gridAutoRows:'3em',
          justifyContent:'center',
          }"
                 class="chartContainer"
                 :list="items"
                 :group="{name:'outerContainer',pull:false,put:false,}"
                 tag="div">
        <template #item="{element}">
          <div v-if="element.value==1"
               :style="{gridRow:`${element.x} / ${element.xSpan}`,gridColumn:`${element.y} / ${element.ySpan}`
          }">{{ element.value }}
          </div>
          <div v-else>{{ element.value }}</div>

        </template>

      </draggable>
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