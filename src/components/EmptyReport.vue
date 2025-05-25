<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import { onMounted, onUnmounted, reactive } from 'vue'
import A from '@/test/A.vue'
import Filter from '@/components/Filter.vue'
import { getUuid } from 'ant-design-vue/es/vc-notification/HookNotification'
// 1. 引入echarts
import * as echarts from "echarts"
import { barTemplate } from '@/composable/ChartTemplate.ts'

function generateRandomBrightColor() {
  var r = Math.floor(Math.random() * 256) + 50 // 控制增加的值为50
  var g = Math.floor(Math.random() * 256) + 50
  var b = Math.floor(Math.random() * 256) + 50
  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}

const items = reactive<{ value: number | any; id: string; xSpan?: number; ySpan?: number }[]>([
  {
    value: 1,
    id: getUuid(),
    xSpan: 9,
    ySpan: 5,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'dotChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 0,
    id: getUuid(),
    xSpan: 4,
    ySpan: 4,
  },
  {
    value: 2,
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 4,
    id: getUuid(),
    xSpan: 3,
    ySpan: 3,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 3,
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 5,
    id: getUuid(),
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
  console.log('chart add', event, event.item.__draggable_context.element.meta);
  console.log(items);
}

const change = function change(event: Event) {
  if('added' in event){
    window.console.log(event['added'])
    let id = event['added'].element.id;
    let container = document.getElementById(id);
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container); // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test2'))

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element);
    observerArray.push(observer);
  }
}

let observerArray: ResizeObserver[] = [];


onMounted(()=>{

  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id);
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container); // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test1'))


    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element);
    observerArray.push(observer);
  }
})

onUnmounted(()=>{
  observerArray.forEach(item=>{
    if(item)item.disconnect()
  })
})
</script>

<template>
  <a-layout :style="{ height: '100%' }">
    <a-layout-sider
      :style="{
        border: '1px solid black',
        height: '100%',
        backgroundColor: 'transparent',
        overflowY: 'auto',
      }"
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
        @change="change"
        item-key="id"
        tag="div"
      >
        <template #item="{ element }">
          <div
            :id="element.id"
            :ref="element.id"
            :style="{
              gridRowStart: `span ${element.xSpan}`,
              gridColumnStart: `span ${element.ySpan}`,
              /*backgroundColor: generateRandomBrightColor(),*/
            }"
            class="chart"
            @click="
              () => {
                element.xSpan++
                element.ySpan++
              }
            "
          >
            <!--            {{ element.value }}-->
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
