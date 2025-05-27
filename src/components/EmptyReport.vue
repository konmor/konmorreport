<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref} from 'vue'
import A from '@/test/A.vue'
import Filter from '@/components/Filter.vue'
import {getUuid} from 'ant-design-vue/es/vc-notification/HookNotification'
// 1. 引入echarts
import * as echarts from "echarts"
import {barTemplate} from '@/composable/ChartTemplate.ts'
import {Modal,} from 'ant-design-vue'
import useNavigator from "@/composable/useNavigator.ts";
import B from "@/test/B.vue";
import type {EChartsType} from "echarts";
import type {ECBasicOption} from "echarts/types/dist/shared";
import Icon from "@ant-design/icons-vue";
import Left from "@/assets/icon/Left.vue";
import Center from "@/assets/icon/Center.vue";
import Right from "@/assets/icon/Right.vue";


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

let chartArray: EChartsType[] = [];

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

    chartArray.push(myEcharts);

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
    chartArray.push(myEcharts);

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element);
    observerArray.push(observer);
  }


  // 代码调试，后续删除 todo
  // 开始渲染图表
  // let container = document.getElementById('chartContainer');
  let container = chartContainer.value;
  // 2.初始化echarts 挂载的位置
  let myEcharts = echarts.init(container); // 参数是dom节点
  tempChart = myEcharts;
  // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
  myEcharts.setOption(tempChartOption)

  let observer = new ResizeObserver(() => {
    if (myEcharts) myEcharts.resize()
  })
  tempObserver = observer;
  observer.observe(container as Element);

})

onUnmounted(() => {
  observerArray.forEach(item => {
    if (item) item.disconnect()
  })

  if(tempObserver!=null){
    tempObserver.disconnect();
  }
})

let chartContainer = ref();
let tempChart: EChartsType;
let tempObserver: ResizeObserver;

let tempChartOption: ECBasicOption = reactive<ECBasicOption>({
  // 标题属性
  title: {
    text: '測試',
    left: 'left',
    show: true
  },
  grid: {
    top: 38,
  },
  tooltip: {
    show: true,
    // item 数据图像触发显示 axis 坐标范围内都会触发
    trigger: 'item',

    // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
    // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    data: ['张三', '李四', '王五', '福六'],
    type: 'category', // 'category' 类目轴，适用于离散的类目数据。 这个时默认值
  },
  yAxis: {},
  series: [
    {
      // 关键数据内容
      name: '薪水',
      type: 'bar', // 表示什么数据类型展示，这里表示使用type ：bar = 柱状图
      data: [6300, 5200, 3200, 600],
    },
    {
      // 关键数据内容
      name: '到手薪资',
      type: 'bar', // 表示什么数据类型展示，这里表示使用type ：bar = 柱状图
      data: [6000, 4800, 3100, 600],
    },
  ],
});

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
      // 关闭数据（、sql）选择框
      selectData.open = false;
      // 打开图表配置模态框
      chartData.open = true;

      // 保证已经渲染完毕
      nextTick(() => {
        // 开始渲染图表
        // let container = document.getElementById('chartContainer');
        let container = chartContainer.value;
        // 2.初始化echarts 挂载的位置
        let myEcharts = echarts.init(container); // 参数是dom节点
        tempChart = myEcharts;
        // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
        myEcharts.setOption(tempChartOption)

        let observer = new ResizeObserver(() => {
          if (myEcharts) myEcharts.resize()
        })
        tempObserver = observer;
        observer.observe(container as Element);
      })


    }
  },
  selected: '',
  data: sqlArray != null && sqlArray.length > 0 ? sqlArray.map(item => {
    return {value: item?.key, label: item?.label}
  }) : [{label: '测试选项-1', value: 'key1'}],
  showError: false,
});


const chartData = reactive<{ open: boolean, ok: (reject: any) => void }>({
  open: false,
  ok: (reject: any) => {
    chartData.open = false;
  },
});

onBeforeUnmount(() => {
  if (chartArray != null && chartArray.length > 0) {
    chartArray.forEach(item => {
      if (item) item.dispose()
    })

  }

  if (tempChart) {
    tempChart.dispose()
  }
})

</script>

<template>
  <a-layout :style="{ height: '100%',width: '100%'}">
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

    <a-layout-content
        :style="{
        border: '1px solid black',
        height: '100%',
        width: '100%',
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
          class="chartIconContainer"
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
      <a-modal open="true" @ok="chartData.ok" ok-text="确认"
               cancel-text="取消" :style="{backgroundColor:'transparent'}"
               width="100%"
               wrap-class-name="full-modal">
        <template #title><span>配置图表</span></template>

        <a-layout :style="{height: '100%',width: '100%',backgroundColor:'transparent'}">
          <a-layout-sider :style="{height: '100%',width: '100%',backgroundColor:'transparent'}">hello</a-layout-sider>

          <a-layout>
            <a-layout-header
                :style="{backgroundColor:'transparent',border:'1px solid black',height:'15%'}">
              <div>hello world</div>
            </a-layout-header>
            <a-layout-content
                :style="{height: '100%',width: '100%',backgroundColor:'transparent',border:'1px solid black'}">

              <div id="chartContainer" ref="chartContainer" :style="{height:'100%'}"></div>
            </a-layout-content>
          </a-layout>


          <a-layout-sider
              :style="{height: '100%',backgroundColor:'transparent',borderBottom:'1px solid black',borderTop:'1px solid black'}"
              width="240px">

            <div class="chart-group">
              <a-input v-show="false" v-model:value="tempChartOption.title.id" placeholder="组件唯一id"></a-input>

              <div class="chart-item">
                <span class="label-right" style="width: 48px;">标题</span>
                <div
                    :style="{display:'flex',alignItems:'center',height:'28px',width:'140px',lineHeight:'28px',justifyContent:'space-between'}">
                  <a-switch v-model:checked="tempChartOption.title.show"
                            @change="()=>{
                              if(tempChartOption.title.show){
                                tempChart.setOption({title:{show:tempChartOption.title.show},grid:{top:48}});
                              }else {
                                tempChart.setOption({title:{show:tempChartOption.title.show},grid:{top:20}});
                              }
                            }"></a-switch>
                  <a-radio-group v-model:value="tempChartOption.title.left" :disabled="!tempChartOption.title.show"
                                 button-style="solid"
                                 size="small"
                                 @change="tempChart.setOption({title:{left:tempChartOption.title.left}})">
                    <a-radio-button value="left">
                      <Left/>
                    </a-radio-button>
                    <a-radio-button value="center">
                      <Center/>
                    </a-radio-button>
                    <a-radio-button value="right">
                      <Right/>
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>

              <div class="chart-item" style="margin-top:2px ">
                <span class="label-right" style="width: 24px;">名称</span>
                <a-input v-model:value="tempChartOption.title.text" placeholder="图表名称" allow-clear
                         :disabled="!tempChartOption.title.show"
                         size="small" :style="{width:'140px',height:'28px',fontSize:'12px'}"
                         @change="tempChart.setOption({title:{text:tempChartOption.title.text}})"></a-input>
              </div>

            </div>


          </a-layout-sider>
        </a-layout>
      </a-modal>

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

.chartIconContainer .chart {
  border: black 1px solid;
  margin: 1px;
}

:global(.full-modal .ant-modal) {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

:global(.full-modal .ant-modal-content) {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  padding: 20px 0 20px 24px;
}

:global(.full-modal .ant-modal-body) {
  flex: 1;

}

:deep(.ant-form .ant-form-item) {
  margin-bottom: 0;
  height: 32px;
  line-height: 32px;
}

.chart-group {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.chart-group .chart-item {
  display: flex;
  align-items: center;
  height: 32px;
  justify-content: space-between;
}

.chart-group .chart-item .label-right {
  font-size: 12px;
  height: 14px;
  line-height: 14px;
}

</style>
