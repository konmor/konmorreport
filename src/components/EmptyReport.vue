<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import {
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue'
import Filter from '@/components/Filter.vue'
import {getUuid} from 'ant-design-vue/es/vc-notification/HookNotification'
import * as echarts from 'echarts'
import {barTemplate} from '@/composable/ChartTemplate.ts'
import useNavigator from '@/composable/useNavigator.ts'
import type {EChartsType} from 'echarts'
import type {ECBasicOption} from 'echarts/types/dist/shared'
import BarConfig from "@/components/chart/BarConfig.vue";


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

const {sqlArray, refreshDatasourceList} = useNavigator()
refreshDatasourceList()

const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  // console.log('chart add', event, event.item.__draggable_context.element.meta)
  // console.log(items)
  // 添加元素后展示模态框
  // 一 选择数据源
  sqlSelectorModal.open = true
  // 二 开始配置 配置内容由 selectData.open 点击ok后的模态框决定
}

let allChartsInstance: EChartsType[] = [];
// 容器大小变化的监听者，数组
let allResizeObserver: ResizeObserver[] = []
// 配置图表时临时变量，临时渲染容器、临时echarts实例、临时监听器
let tempChartContainer = ref()
let tempChart: EChartsType;
const getTempChart = ()=>{return tempChart};
const setTempChart = (value:EChartsType)=>{
  if(tempChart) {
    tempChart.dispose()
  }
  tempChart = value
};
let tempObserver: ResizeObserver

// 使用change事件，监听添加事件。似乎echarts有bug，仅change事件【added】能够拿到echarts clone后的对象
const change = function change(event: Event) {
  // 监听添加事件
  if ('added' in event) {
    // window.console.log(event['added'])
    let id = event['added'].element.id;
    let newContainer = document.getElementById(id)
    // 2.初始化echarts 挂载的位置
    let newEchartsInstance = echarts.init(newContainer) // 参数是dom节点
    // 3. 设置默认数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    newEchartsInstance.setOption(barTemplate('test2'));

    // 放入allChartsInstance容器中
    allChartsInstance.push(newEchartsInstance);

    let observer = new ResizeObserver(() => {
      if (newEchartsInstance) newEchartsInstance.resize()
    })
    observer.observe(newContainer as Element)
    allResizeObserver.push(observer);
  }
}
// 将对象数据转换为数组数据
function transferDataToArray() {
  let data = [
    {
      userName: '张三',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三a',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三b',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三c',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三d',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三e',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '王五fffdasfsafsfdasfsafa',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '李四',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六a',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六b',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六c',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },

    {
      userName: '福六d',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六e',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六f',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六h',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六i',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
  ]

  return data.map((item) => [item.userName, item.salary1, item.salary2, item.salary3, item.salary4])
}
// 维度
let dimensions = ['userName', 'salary1', 'salary2', 'salary3', 'salary4']

let tempChartOption: ECBasicOption = reactive<ECBasicOption>({
  // 标题属性
  title: {
    text: '測試',
    left: 'left',
    show: true,
    top: '0.5%',
  },
  grid: {
    top: '7%',
    right: '0.5%',
    left: '0.5%',
    bottom: '0.5%',
    show: true,
    containLabel: true,
  },
  tooltip: {
    show: true,
    // item 数据图像触发显示 axis 坐标范围内都会触发
    trigger: 'axis',
    // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
    // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
    axisPointer: {
      type: 'cross',
    },
  },
  legend: {
    show: true,
    orient: 'horizontal', // vertical | horizontal
    top: '3%',
    left: 'center',
    type: 'scroll',
    tooltip: {
      show: true,
    },
    emphasis: {
      show: true,
    },
    formatter: function (name: string) {
      return echarts.format.truncateText(name, 84, '14px Microsoft Yahei', '…')
    },
  },
  dataset: {
    dimensions: dimensions,
    source: transferDataToArray(),
  },
  xAxis: {
    type: 'category',
    name: undefined,
    nameLocation: 'center', // start end center/middle
    nameGap: 36,
    position: 'bottom', // bottom top 坐标轴的位置
    // 标签是否展示, 宽度、距离
    axisLabel: {
      show: true,
      width: 48,
      rotate: 0,
      margin: 18,
      overflow: 'truncate',
      ellipsis: '…',
      interval: 'auto', // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
      /*      formatter: function (value: string, index: number) {
        return value
      },*/
    },
    tooltip: {
      show: true, // 配合 axisLabel.overflow
    },

    // 刻度线
    boundaryGap: true,
    axisTick: {
      // 对齐刻度线 在 boundaryGap:true,  条件下
      // true 对齐，false 不对齐
      alignWithLabel: true,
      show: true,
    },

    // 分割线
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid', // dotted dashed solid
        width: 1,
      },
    },
  },
  yAxis: {
    type: 'value',
    name: undefined,
    nameLocation: 'end', // start end center/middle
    nameGap: 36,
    position: 'left', // left right 坐标轴的位置

    // 标签是否展示, 宽度、距离
    axisLabel: {
      show: true,
      width: 48,
      rotate: 0,
      margin: 8,
      overflow: 'truncate',
      ellipsis: '…',
      interval: 'auto', // 类目轴有效
      /*      formatter: function (value: string, index: number) {
        return value
      },*/
    },
    tooltip: {
      show: true, // 配合 axisLabel.overflow
    },

    // 刻度线
    // type = value 时 boundaryGap 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效
    boundaryGap: ['0%', '0%'],

    // 分割线
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid', // dotted dashed solid
        width: 2,
      },
    },
  },
  series: [
    {
      id: '1',
      type: 'bar',
      name: dimensions[1],
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group1',
      stackStrategy: 'samesign',
      /**
       * 'samesign' 只在要堆叠的值与当前累积的堆叠值具有相同的正负符号时才堆叠。
       * 'all' 堆叠所有的值，不管当前或累积的堆叠值的正负符号是什么。
       * 'positive' 只堆积正值。
       * 'negative' 只堆叠负值。
       */
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '2',
      name: dimensions[2],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group2',
      stackStrategy: 'samesign',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '3',
      name: dimensions[3],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '4',
      name: dimensions[4],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
  ],
  dataZoom: [
    {
      id: 'x0Inside',
      type: 'inside',
      disabled: true,
      start: 0,
      end: 100,
      xAxisIndex: [0],
    },
    {
      id: 'x0Slider',
      type: 'slider',
      show: false,
      xAxisIndex: [0],
      bottom: '2%'
    },
    {
      id: 'y0Inside',
      type: 'inside',
      disabled: true,
      start: 0,
      end: 100,
      yAxisIndex: [0],
    },
    {
      id: 'y0Slider',
      type: 'slider',
      show: false,
      yAxisIndex: [0],
    },
  ],
})

const tempChartModal = reactive<{ open: boolean; ok: (reject: any) => void ,cancel: () => void }>({
  open: false,
  ok: (reject: any) => {
    tempChartModal.open = false;

    // 配置好之后从 temChart 中获取数据，并渲染给最后一个 chartArray 中的chart
    allChartsInstance[allChartsInstance.length-1].setOption(tempChart.getOption(),true);
    tempChart.dispose();
  },
  cancel:()=>{
    tempChartModal.open = false;
  }
});

const sqlSelectorModal = reactive<{
  open: boolean,
  ok: (reject: any) => void,
  cancel: () => void,
  selected: string,
  data: any[],
  showError: boolean,
}>({
  open: false,
  ok: (reject: any) => {
    if (sqlSelectorModal.selected == null) {
      sqlSelectorModal.showError = true
    } else {
      // 关闭数据（、sql）选择框
      sqlSelectorModal.open = false
      // 打开图表配置模态框
      tempChartModal.open = true

      // 保证已经渲染完毕
      nextTick(() => {
        // 开始渲染图表
        // let container = document.getElementById('chartContainer');
        let container = tempChartContainer.value
        // 2.初始化echarts 挂载的位置
        let newEchartsInstance = echarts.init(container)
        tempChart = newEchartsInstance; // 交给外部临时变量
        // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
        newEchartsInstance.setOption(tempChartOption)

        let observer = new ResizeObserver(() => {
          if (newEchartsInstance) newEchartsInstance.resize()
        })
        tempObserver = observer;
        observer.observe(container as Element)

      })
    }
  },
  cancel:()=>{
    sqlSelectorModal.open = false;
  },
  selected: '',
  data:
      sqlArray != null && sqlArray.length > 0
          ? sqlArray.map((item) => {
            return {value: item?.key, label: item?.label}
          })
          : [{label: '测试选项-1', value: 'key1'}],
  showError: false,
})



onMounted(() => {
  // 渲染图表
  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test1'))
    allChartsInstance.push(myEcharts)

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element)
    allResizeObserver.push(observer)
  }

  // 代码调试，后续删除 todo
  // 开始渲染图表
 /* // let container = document.getElementById('chartContainer');
  let container = tempChartContainer.value
  // 2.初始化echarts 挂载的位置
  let myEcharts = echarts.init(container) // 参数是dom节点
  tempChart = myEcharts
  // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
  myEcharts.setOption(toRaw(tempChartOption))

  let observer = new ResizeObserver(() => {
    if (myEcharts) myEcharts.resize()
  })
  tempObserver = observer
  observer.observe(container as Element)

  // // 堆叠配置 待删除
  // let colors = currentColors.value
  // // 4 * 8 32 3*8 = 24
  // for (let i = 0; i < dimensions.length - 1; i++) {
  //   stackItems[i] = [{name: dimensions[i + 1], id: i + 1, color: colors[i]}]
  // }*/
})

onUnmounted(() => {
  allResizeObserver.forEach((item) => {
    if (item) item.disconnect()
  })

  if (tempObserver != null) {
    tempObserver.disconnect()
  }
})

onBeforeUnmount(() => {
  if (allChartsInstance != null && allChartsInstance.length > 0) {
    allChartsInstance.forEach((item) => {
      if (item) item.dispose()
    })
  }

  if (tempChart) {
    tempChart.dispose()
  }
})

</script>

<template>
  <a-layout :style="{ height: '100%', width: '100%' }">
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
      <a-modal
          v-model:open="sqlSelectorModal.open"
          title="请选择需要渲染的数据！"
          @ok="sqlSelectorModal.ok"
          ok-text="确认"
          cancel-text="取消"
      >
        <a-select
            v-model:value="sqlSelectorModal.selected"
            placeholder="请选择数据!"
            :options="sqlSelectorModal.data"
            :style="{ width: '60%' }"
            allowClear
        >
        </a-select>
        <span :style="{ marginLeft: '10px' }" v-if="sqlSelectorModal.showError">
          <CloseCircleOutlined :style="{ color: 'red' }"/>
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
      <!-- v-if 控制销毁模态框以及模态框中的组件-->
      <a-modal
          v-if="tempChartModal.open"
          :open="tempChartModal.open"
          @ok="tempChartModal.ok"
          ok-text="确认"
          cancel-text="取消"
          :style="{ backgroundColor: 'transparent' }"
          width="100%"
          wrap-class-name="full-modal"
      >
        <template #title><span>配置图表</span></template>

        <a-layout :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }">
          <!-- 配置模态框 左侧字段选择区域-->
          <a-layout-sider :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }">
            hello
          </a-layout-sider>
          <!-- 配置模态框 中间-->
          <a-layout>
            <!-- 配置模态框 中间 维度配置区域-->
            <a-layout-header
                :style="{ backgroundColor: 'transparent', border: '1px solid black', height: '15%' }"
            >
              <div>hello world</div>
            </a-layout-header>

            <!-- 配置模态框 中间 图表渲染区域-->
            <a-layout-content
                :style="{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                border: '1px solid black',
              }"
            >
              <div id="tempChartContainer" ref="tempChartContainer" :style="{ height: '100%' }"></div>
            </a-layout-content>
          </a-layout>

          <!-- 配置模态框 中间 图表各类配置区域-->
          <a-layout-sider
              :style="{
              height: '100%',
              maxHeight: '100%',
              backgroundColor: 'transparent',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
              overflowY: 'auto', // abc todo
            }"
              width="240px"
              class="viewConfig"
          >
          <BarConfig :getChartConfig="getTempChart"
                     :setChartConfig ="setTempChart"
                     :chartOption="tempChartOption"
                     :chartContainer="tempChartContainer"></BarConfig>
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
  overflow: hidden;
}

:global(.full-modal .ant-modal-content) {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  padding: 20px 0 20px 24px;
  overflow: hidden;
}

:global(.full-modal .ant-modal-body) {
  flex: 1;
  overflow: hidden;
}

.viewConfig::-webkit-scrollbar {
  width: 4px;
}

.pileContainers::-webkit-scrollbar-thumb,
.viewConfig::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.pileContainers::-webkit-scrollbar-track,
.viewConfig::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.pileContainers::-webkit-scrollbar {
  height: 4px;
}

</style>
