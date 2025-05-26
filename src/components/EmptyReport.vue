<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import {onMounted, onUnmounted, reactive} from 'vue'
import A from '@/test/A.vue'
import Filter from '@/components/Filter.vue'
import {getUuid} from 'ant-design-vue/es/vc-notification/HookNotification'
// 1. 引入echarts
import * as echarts from "echarts"
import {barTemplate} from '@/composable/ChartTemplate.ts'
import {Modal,} from 'ant-design-vue'
import useNavigator from "@/composable/useNavigator.ts";


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

const {sqlArray, refreshDatasourceList} = useNavigator();
refreshDatasourceList();


const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  console.log('chart add', event, event.item.__draggable_context.element.meta);
  console.log(items);
  // 添加元素后展示模态框
  // 一 选择数据源
  selectData.open = true;
  // 二 开始配置

}

const change = function change(event: Event) {
  // 监听添加事件
  if ('added' in event) {
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


onMounted(() => {

  // 渲染图表
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

  // 渲染

})

onUnmounted(() => {
  observerArray.forEach(item => {
    if (item) item.disconnect()
  })
})

const selectData = reactive<{
  open: boolean,
  ok: (reject: any) => void,
  selected: string,
  data: any[],
  showError: boolean,
}>({
  open: false,
  ok: (reject: any) => {
    if (selectData.selected == null) {
      selectData.showError = true;
    } else {
      selectData.open = false;
    }
  },
  selected: '',
  data: sqlArray != null && sqlArray.length > 0 ? sqlArray.map(item => {
    return {value: item?.key, label: item?.label}
  }) : [{label: '测试选项-1', value: 'key1'}],
  showError: false,
});


</script>

<template>
  <a-layout :style="{ height: '100%' }">
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

      <!-- 图形配置模态框-->
      <a-modal>

      </a-modal>

    </a-layout-content>
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
        <Diagram/>
      </div>

      <div class="filterContainer">
        <span class="filterTitle">过滤器</span>
        <Filter/>
      </div>

      <!-- 图表绑定的数据 选择择模态框-->
      <a-modal v-model:open="selectData.open" title="请选择需要渲染的数据！" @ok="selectData.ok" ok-text="确认"
               cancel-text="取消">
        <a-select
            v-model:value="selectData.selected"
            placeholder="请选择数据!"
            :options="selectData.data"
            :style="{width: '60%'}"
            allowClear
        >
        </a-select>
        <span :style="{marginLeft: '10px'}" v-if="selectData.showError">
        <CloseCircleOutlined :style="{color: 'red'}"/>
        请选择正确的数据！
        </span>
      </a-modal>
    </a-layout-sider>
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
