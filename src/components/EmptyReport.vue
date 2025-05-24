<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import { reactive } from 'vue'
import A from '@/test/A.vue'
import Filter from '@/components/Filter.vue'

function generateRandomBrightColor() {
  var r = Math.floor(Math.random() * 256) + 50 // 控制增加的值为50
  var g = Math.floor(Math.random() * 256) + 50
  var b = Math.floor(Math.random() * 256) + 50
  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}

const items = reactive<{ value: number | any; index: number; xSpan?: number; ySpan?: number }[]>([
  {
    value: 1,
    index: 1,
    xSpan: 9,
    ySpan: 5,
  },
  {
    value: 'radarChart',
    index: 4,
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    index: 4,
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'dotChart',
    index: 4,
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'pieChart',
    index: 4,
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 0,
    index: 0,
    xSpan: 4,
    ySpan: 4,
  },
  {
    value: 2,
    index: 2,
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 4,
    index: 4,
    xSpan: 3,
    ySpan: 3,
  },
  {
    value: 'radarChart',
    index: 4,
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    index: 4,
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 3,
    index: 3,
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 5,
    index: 5,
    xSpan: 1,
    ySpan: 1,
  },
])

const endTest = (event: Event) => {
  console.log('chart end', event, items)
}
const moveTest = (event: Event) => {
  console.log('chart move', event)
}
const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  //   console.log('chart add', event.item.__draggable_context.element.meta);
  console.log(items)
}

const log = function log(event: Event) {
  window.console.log(event)
}
</script>

<template>
  <a-layout :style="{ height: '100%' }">
    <a-layout-sider
      :style="{ border: '1px solid black', height: '100%', backgroundColor: 'transparent' ,overflowY:'auto'}"
    >
      <div class="diagramContainer">
        <span class="diagramTitle">图表</span>
        <!--        <Diagram @mousedown="testDown($event)" @mouseup="testUp($event)" @mousemove="testMove($event)"/>-->
        <Diagram />
      </div>

      <div class="filterContainer">
        <span class="filterTitle">过滤器</span>
        <Filter />
      </div>
    </a-layout-sider>
    <a-layout-content
      :style="{
        border: '1px solid black',
        height: '100%',
        backgroundColor: 'transparent',
        marginLeft: '8px',
        overflowY: 'auto',
        overflowX: 'hidden',

        /*alignContent:'center'*/
      }"
    >
      <draggable
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(24,1fr)',
          gridAutoRows: '3em',
          justifyContent: 'center',
          gridAutoFlow: 'row dense',
        }"
        class="chartContainer"
        :list="items"
        :group="{ name: 'outerContainer', pull: false, put: true }"
        animation="500"
        @end="endTest"
        @move="moveTest"
        @add="addTest"
        @change="log"
        item-key="value"
        tag="div"
      >
        <template #item="{ element }">
          <div
            :style="{
              gridRowStart: `span ${element.xSpan}`,
              gridColumnStart: `span ${element.ySpan}`,
              backgroundColor: generateRandomBrightColor(),
            }"
            class="chart"
            @click="element.xSpan++;element.ySpan++"
          >
            {{ element.value }}
          </div>
        </template>
      </draggable>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.diagramContainer .diagramTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

.filterContainer .filterTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

.chartContainer .chart {
  border: black 1px solid;
  margin: 1px;
}
</style>
