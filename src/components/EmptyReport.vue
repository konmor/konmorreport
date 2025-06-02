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
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref} from 'vue'
import Filter from '@/components/Filter.vue'
import {getUuid} from 'ant-design-vue/es/vc-notification/HookNotification'
// 1. 引入echarts
import * as echarts from 'echarts'
import {barTemplate} from '@/composable/ChartTemplate.ts'
import {Modal} from 'ant-design-vue'
import useNavigator from '@/composable/useNavigator.ts'
import B from '@/test/B.vue'
import type {EChartsType} from 'echarts'
import type {ECBasicOption} from 'echarts/types/dist/shared'
import {UpOutlined, DownOutlined, SettingOutlined} from "@ant-design/icons-vue";
import Left from '@/assets/icon/Left.vue'
import Center from '@/assets/icon/Center.vue'
import Right from '@/assets/icon/Right.vue'
import TopLeft from '@/assets/icon/legend/TopLeft.vue'
import TopCenter from '@/assets/icon/legend/TopCenter.vue'
import TopRight from '@/assets/icon/legend/TopRight.vue'
import LeftCenter from '@/assets/icon/legend/LeftCenter.vue'
import RightCenter from '@/assets/icon/legend/RightCenter.vue'
import BottomLeft from '@/assets/icon/legend/BottomLeft.vue'
import BotomCenter from '@/assets/icon/legend/BotomCenter.vue'
import BottomRight from '@/assets/icon/legend/BottomRight.vue'
import Position from '@/assets/icon/legend/Position.vue'
import PerfectScrollbar from "perfect-scrollbar";

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

const {sqlArray, refreshDatasourceList} = useNavigator()
refreshDatasourceList()

const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  console.log('chart add', event, event.item.__draggable_context.element.meta)
  console.log(items)
  // 添加元素后展示模态框
  // 一 选择数据源
  selectData.open = true
  // 二 开始配置
}

let chartArray: EChartsType[] = []

const change = function change(event: Event) {
  // 监听添加事件
  if ('added' in event) {
    window.console.log(event['added'])
    let id = event['added'].element.id
    let container = document.getElementById(id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test2'))

    chartArray.push(myEcharts)

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element)
    observerArray.push(observer)
  }
}

let observerArray: ResizeObserver[] = []
let configScrollbar: PerfectScrollbar;
onMounted(() => {
  // 渲染图表
  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test1'))
    chartArray.push(myEcharts)

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element)
    observerArray.push(observer)
  }

  // 代码调试，后续删除 todo
  // 开始渲染图表
  // let container = document.getElementById('chartContainer');
  let container = chartContainer.value
  // 2.初始化echarts 挂载的位置
  let myEcharts = echarts.init(container) // 参数是dom节点
  tempChart = myEcharts
  // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
  myEcharts.setOption(tempChartOption)

  let observer = new ResizeObserver(() => {
    if (myEcharts) myEcharts.resize()
  })
  tempObserver = observer
  observer.observe(container as Element);
})

onUnmounted(() => {
  observerArray.forEach((item) => {
    if (item) item.disconnect()
  })

  if (tempObserver != null) {
    tempObserver.disconnect()
  }
})

let chartContainer = ref()
let tempChart: EChartsType
let tempObserver: ResizeObserver

/**
 * legend
 * 当标题展示时 grid.top 7%  标题打开、
 */
let tempTopConfig = reactive({
  titleTop: '2',
  legendTop: '2',
  gridTop: '2%',
})

let xAxisConfigShow = ref('');
let yAxisConfigShow = ref('');

let legendPosition = ref('topCenter');

let xAxisNameShow = ref(false);
let yAxisNameShow = ref(false);

let allSeriesEqual = ref(false);

let allSeriesConfigShow = ref([]);

let seriesLabelShow = ref<Record<string, 'show'|'hover'|''>>({});

const seriesLabelControl = (item) => {
  if (seriesLabelShow.value[item.id] != null && seriesLabelShow.value[item.id] .length > 0) {
    if (seriesLabelShow.value[item.id]  == 'hover') {
      item.emphasis.label.show = true;
      item.label.show = false;
    } else if (seriesLabelShow.value[item.id]  == 'show') {
      item.emphasis.label.show = true;
      item.label.show = true;
    }
  } else {
    item.emphasis.label.show = false;
    item.label.show = false;
  }
  let temp = {id: item.id, label: {show: item.label.show}, emphasis: {label: {show: item.emphasis.label.show}}};
  tempChart.setOption({
    series: temp,
  })
};

let orient = ref(''); //horizontal vertical

function transferDataToArray(){
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

  return data.map(item => [item.userName, item.salary1, item.salary2,
    item.salary3, item.salary4]);
}

let dimensions = ['userName', 'salary1', 'salary2', 'salary3', 'salary4'];

let tempChartOption: ECBasicOption = reactive<ECBasicOption>({
  // 标题属性
  title: {
    text: '測試',
    left: 'left',
    show: true,
    top: '2',
  },
  grid: {
    top: '8%',
    right: '2',
    left: '2',
    bottom: '90',
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
    top: '3.5%',
    left: 'center',
    type: 'scroll',
    tooltip: {
      show: true,
    },
    emphasis: {
      show: true,
    },
    animation: true,
    formatter: function (name: string) {
      return echarts.format.truncateText(name, 84, '14px Microsoft Yahei', '…')
    },
  },
  dataset: {
    dimensions: dimensions,
    source: transferDataToArray() ,
  },
  xAxis: {

    type: 'category',
    name: undefined,
    nameLocation: 'center', // start end center/middle
    nameGap: '8',
    position: 'bottom', // bottom top 坐标轴的位置

    // 标签是否展示, 宽度、距离
    axisLabel: {
      show: true,
      width: 100,
      rotate: 0,
      margin: 18,
      overflow: 'truncate',
      ellipsis: '…',
      interval: 'auto', // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
      formatter: function (value: string, index: number) {
        return value
      },
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
    nameGap: '8',
    position: 'left', // left right 坐标轴的位置

    // 标签是否展示, 宽度、距离
    axisLabel: {
      show: true,
      width: 100,
      rotate: 0,
      margin: 8,
      overflow: 'truncate',
      ellipsis: '…',
      interval: 'auto', // 类目轴有效
      formatter: function (value: string, index: number) {
        return value
      },
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
        rotate: 90, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        }
      },
    },
    {
      id:'2',
      name:dimensions[2],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '8',
      stack: 'group2',
      stackStrategy: 'samesign',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 90, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        }
      },
    },
    {id:'3',name:dimensions[3],type: 'bar', barMaxWidth: '50', barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 90, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        }
      },},
    {id:'4',name:dimensions[4],type: 'bar', barMaxWidth: '50', barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 90, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        }
      },},
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 30,
      xAxisIndex: [0],
    },
    {
      type: 'slider',
      xAxisIndex: [0],
    },
    {
      type: 'inside',
      start: 0,
      end: 100,
      yAxisIndex: [0],
    },
    {
      type: 'slider',
      yAxisIndex: [0],
    }
  ]
})

const calculatePositionConfig = () => {
  let option: {
    legend: {
      show?: boolean
      top?: string
      left?: string
      right?: string
      bottom?: string
      orient?: 'horizontal' | 'vertical'
    }
    grid: {
      top?: string
      right?: string
      left?: string
      bottom?: string
    }
    title: {
      show?: boolean
      top?: string
      right?: string
      left?: string
      bottom?: string
    }
  } = {
    legend: {},
    grid: {},
    title: {},
  }

  let titleShow: boolean = tempChartOption.title.show
  let legendShow: boolean = tempChartOption.legend.show

  // topLeft 、topCenter、topRight、
  // leftCenter、rightCenter
  // bottomLeft、bottomCenter、bottomRight
  if (titleShow) {
    if (legendShow) {
      if (legendPosition.value.startsWith('top')) {
        option.grid.top = '8%'
        option.grid.left = '2'
        option.grid.right = '2'
        option.grid.bottom = '2%'

        option.legend.top = '3.5%'
        option.legend.bottom = undefined

        option.title.top = '2'

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left'
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center'
        } else {
          option.legend.left = 'right'
        }
      } else if (legendPosition.value.startsWith('bottom')) {
        option.grid.top = '5%'
        option.grid.left = '2'
        option.grid.right = '2'
        option.grid.bottom = '4.5%'

        option.legend.top = undefined
        option.legend.bottom = '2'

        option.title.top = '2'

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left'
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center'
        } else {
          option.legend.left = 'right'
        }
      } else if (legendPosition.value == 'leftCenter') {
        option.grid.top = '5%'
        option.grid.left = '9%'
        option.grid.right = '2'
        option.grid.bottom = '2%'

        option.legend.left = 'left'
        option.legend.top = '3.5%'
        option.legend.bottom = undefined

        option.title.top = '2'
      } else if (legendPosition.value == 'rightCenter') {
        option.grid.top = '5%'
        option.grid.left = '2'
        option.grid.right = '9%'
        option.grid.bottom = '2%'

        option.legend.left = 'right'
        option.legend.top = '3.5%'
        option.legend.bottom = undefined

        option.title.top = '2'
      } else {
        console.error('图表定位发生错误')
      }
    } else {
      option.grid.top = '5%'
      option.grid.left = '2'
      option.grid.right = '2'
      option.grid.bottom = '2%'

      option.legend.left = undefined
      option.legend.top = undefined
      option.legend.bottom = undefined

      option.title.top = '2'
    }
  } else {
    if (legendShow) {
      option.title.top = undefined
      if (legendPosition.value.startsWith('top')) {
        option.grid.top = '5%'
        option.grid.left = '2'
        option.grid.right = '2'
        option.grid.bottom = '2%'

        option.legend.top = '2'
        option.legend.bottom = undefined

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left'
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center'
        } else {
          option.legend.left = 'right'
        }
      } else if (legendPosition.value.startsWith('bottom')) {
        option.grid.top = '2%'
        option.grid.left = '2'
        option.grid.right = '2'
        option.grid.bottom = '4.5%'

        option.legend.top = undefined
        option.legend.bottom = '2'

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left'
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center'
        } else {
          option.legend.left = 'right'
        }
      } else if (legendPosition.value == 'leftCenter') {
        option.grid.top = '2%'
        option.grid.left = '9%'
        option.grid.right = '2'
        option.grid.bottom = '2%'

        option.legend.left = 'left'
        option.legend.top = '2%'
        option.legend.bottom = undefined
      } else if (legendPosition.value == 'rightCenter') {
        option.grid.top = '2%'
        option.grid.left = '2'
        option.grid.right = '9%'
        option.grid.bottom = '2%'

        option.legend.left = 'right'
        option.legend.top = '2%'
        option.legend.bottom = undefined
      } else {
        console.error('图表定位发生错误')
      }
    } else {
      option.grid.top = '2%'
      option.grid.left = '2'
      option.grid.right = '2'
      option.grid.bottom = '2%'

      option.legend.left = undefined
      option.legend.top = undefined
      option.legend.bottom = undefined

      option.title.top = undefined
    }
  }
  return option
}

const selectData = reactive<{
  open: boolean
  ok: (reject: any) => void
  selected: string
  data: any[]
  showError: boolean
}>({
  open: false,
  ok: (reject: any) => {
    if (selectData.selected == null) {
      selectData.showError = true
    } else {
      // 关闭数据（、sql）选择框
      selectData.open = false
      // 打开图表配置模态框
      chartData.open = true

      // 保证已经渲染完毕
      nextTick(() => {
        // 开始渲染图表
        // let container = document.getElementById('chartContainer');
        let container = chartContainer.value
        // 2.初始化echarts 挂载的位置
        let myEcharts = echarts.init(container) // 参数是dom节点
        tempChart = myEcharts
        // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
        myEcharts.setOption(tempChartOption)

        let observer = new ResizeObserver(() => {
          if (myEcharts) myEcharts.resize()
        })
        tempObserver = observer
        observer.observe(container as Element)
      })
    }
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

const chartData = reactive<{ open: boolean; ok: (reject: any) => void }>({
  open: false,
  ok: (reject: any) => {
    chartData.open = false
  },
})

onBeforeUnmount(() => {
  if (chartArray != null && chartArray.length > 0) {
    chartArray.forEach((item) => {
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
          v-model:open="selectData.open"
          title="请选择需要渲染的数据！"
          @ok="selectData.ok"
          ok-text="确认"
          cancel-text="取消"
      >
        <a-select
            v-model:value="selectData.selected"
            placeholder="请选择数据!"
            :options="selectData.data"
            :style="{ width: '60%' }"
            allowClear
        >
        </a-select>
        <span :style="{ marginLeft: '10px' }" v-if="selectData.showError">
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
      <a-modal
          open="true"
          @ok="chartData.ok"
          ok-text="确认"
          cancel-text="取消"
          :style="{ backgroundColor: 'transparent' }"
          width="100%"
          wrap-class-name="full-modal"
      >
        <template #title><span>配置图表</span></template>

        <a-layout :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }">
          <a-layout-sider :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }"
          >hello
          </a-layout-sider>

          <a-layout>
            <a-layout-header
                :style="{ backgroundColor: 'transparent', border: '1px solid black', height: '15%' }"
            >
              <div>hello world</div>
            </a-layout-header>
            <a-layout-content
                :style="{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                border: '1px solid black',
              }"
            >
              <div id="chartContainer" ref="chartContainer" :style="{ height: '100%' }"></div>
            </a-layout-content>
          </a-layout>

          <a-layout-sider
              :style="{
              height: '100%',
              maxHeight: '100%',
              backgroundColor: 'transparent',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
              overflowY: 'auto', // abc todo
            }"
              width="240px" class="viewConfig">
            <!--            标题控制-->
            <div class="chart-group">
              <a-input
                  v-show="false"
                  size="small"
                  v-model:value="tempChartOption.title.id"
                  placeholder="组件唯一id"
              ></a-input>

              <div class="chart-item">
                <span class="label-left" style="width: 48px">标题</span>
                <div class="component-right">
                  <a-switch
                      size="small"
                      v-model:checked="tempChartOption.title.show"
                      @change="
                      () => {
                        let option = calculatePositionConfig()
                        option.title.show = tempChartOption.title.show
                        tempChart.setOption(option)
                      }
                    "
                  ></a-switch>
                  <a-radio-group
                      v-model:value="tempChartOption.title.left"
                      :disabled="!tempChartOption.title.show"
                      button-style="solid"
                      size="small"
                      @change="tempChart.setOption({ title: { left: tempChartOption.title.left } })"
                  >
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

              <div class="chart-item" style="margin-top: 2px">
                <span class="label-left" style="width: 24px">名称</span>
                <div class="component-right">
                  <a-input
                      v-model:value="tempChartOption.title.text"
                      placeholder="图表名称"
                      allow-clear
                      :disabled="!tempChartOption.title.show"
                      size="small"
                      :style="{ width: '100%', fontSize: '12px',height:'22px' }"

                      @change="tempChart.setOption({ title: { text: tempChartOption.title.text } })"
                  ></a-input>
                </div>
              </div>
            </div>

            <div class="chart-group">
              <div class="chart-item">
                <span class="label-left" style="width: 36px">指示器</span>
                <div class="component-right">
                  <a-tooltip title="鼠标挪入图表中可查看效果！">
                    <a-radio-group
                        size="small"
                        button-style="solid"
                        v-model:value="tempChartOption.tooltip.axisPointer.type"
                        @change="
                        tempChart.setOption({
                          tooltip: {
                            axisPointer: { type: tempChartOption.tooltip.axisPointer.type },
                          },
                        })
                      "
                    >
                      <a-radio-button value="cross"
                      ><span style="font-size: 12px">交叉</span></a-radio-button
                      >
                      <a-radio-button value="shadow"
                      ><span style="font-size: 12px">阴影</span></a-radio-button
                      >
                      <a-radio-button value="line"
                      ><span style="font-size: 12px">竖线</span></a-radio-button
                      >
                    </a-radio-group>
                  </a-tooltip>
                </div>
              </div>
            </div>
            <div class="chart-group">
              <div class="chart-item">
                <span class="label-left" style="width: 24px">图例</span>
                <div class="component-right">
                  <a-switch
                      size="small"
                      v-model:checked="tempChartOption.legend.show"
                      @change="
                      () => {
                        let option = calculatePositionConfig()
                        option.legend.show = tempChartOption.legend.show
                        tempChart.setOption(option)
                      }
                    "
                  ></a-switch>
                </div>
              </div>

              <div class="legend-position">
                <span
                    class="label-left"
                    style="
                    width: 24px;
                    font-size: 12px;
                    height: 14px;
                    line-height: 14px;
                    align-self: flex-start;
                  "
                >位置</span
                >
                <div class="legend-position-container">
                  <a-radio-group
                      class="legend-position-control"
                      size="small"
                      button-style="solid"
                      v-model:value="legendPosition"
                      :disabled="!tempChartOption.legend.show"
                      @change="
                      () => {
                        let option = calculatePositionConfig()
                        option.legend.orient = 'horizontal'
                        if (legendPosition == 'leftCenter' || legendPosition == 'rightCenter') {
                          option.legend.orient = 'vertical'
                        }
                        tempChart.setOption(option)
                      }
                    "
                  >
                    <a-radio-button class="btn top left" value="topLeft">
                      <TopLeft/>
                    </a-radio-button>
                    <a-radio-button class="btn top center" value="topCenter">
                      <TopCenter/>
                    </a-radio-button>
                    <a-radio-button class="btn top right" value="topRight">
                      <TopRight/>
                    </a-radio-button>
                    <a-radio-button class="btn middle left" value="leftCenter">
                      <LeftCenter/>
                    </a-radio-button>
                    <a-radio-button class="btn middle center" disabled>
                      <Position/>
                    </a-radio-button>
                    <a-radio-button class="btn middle right" value="rightCenter">
                      <RightCenter/>
                    </a-radio-button>
                    <a-radio-button class="btn bottom left" value="bottomLeft">
                      <BottomLeft/>
                    </a-radio-button>
                    <a-radio-button class="btn bottom center" value="bottomCenter">
                      <BotomCenter/>
                    </a-radio-button>
                    <a-radio-button class="btn bottom right" value="bottomRight">
                      <BottomRight/>
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>
            </div>

            <div class="chart-group">
              <a-collapse v-model:activeKey="xAxisConfigShow" expand-icon-position="end"
                          :style="{border:'none',backgroundColor:'transparent',margin:'0',padding:'0'}"
              >
                <a-collapse-panel key="1" header="X轴" :style="{border:'none',margin:'0',padding:'0',fontSize:'13px'}">
                  <div class="chart-item">
                    <span class="label-left" style="width: 24px">名称</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="xAxisNameShow"
                          @change="()=>{
                            if(xAxisNameShow){
                              if(tempChartOption.xAxis.name!=undefined){
                                tempChart.setOption({xAxis:{name:tempChartOption.xAxis.name}})
                              }else {
                                tempChartOption.xAxis.name = tempChartOption.dataset.dimensions[0];
                                tempChart.setOption({xAxis:{name:tempChartOption.xAxis.name}})
                              }
                            } else {
                              tempChartOption.xAxis.name = undefined;
                              tempChart.setOption({xAxis:{name:undefined}})
                            }
                          }"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left"></span>
                    <div class="component-right">
                      <a-input
                          size="small"
                          :style="{ width: '100%', fontSize: '12px',height:'22px' }"
                          allow-clear
                          :disabled="!xAxisNameShow"
                          v-model:value="tempChartOption.xAxis.name"
                          @change="tempChart.setOption({xAxis:{name:tempChartOption.xAxis.name}})"
                      ></a-input>
                    </div>

                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">名称位置</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          :disabled="!xAxisNameShow"
                          v-model:value="tempChartOption.xAxis.nameLocation"
                          @change="tempChart.setOption({xAxis:{nameLocation:tempChartOption.xAxis.nameLocation}})"
                      >
                        <a-radio-button value="start"
                        ><span style="font-size: 12px">左边</span></a-radio-button
                        >
                        <a-radio-button value="center"
                        ><span style="font-size: 12px">中间</span></a-radio-button
                        >
                        <a-radio-button value="end"
                        ><span style="font-size: 12px">右边</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">离坐标轴</span>
                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="8"
                          :style="{ width: '100%', fontSize: '12px' }"
                          :disabled="!xAxisNameShow"
                          v-model:value="tempChartOption.xAxis.nameGap"
                          addon-after="px"
                          @change="tempChart.setOption({xAxis:{nameGap:tempChartOption.xAxis.nameGap}})"
                      >
                      </a-input-number>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 2px">
                    <span class="label-left" style="width: 60px">坐标轴位置</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          v-model:value="tempChartOption.xAxis.position"
                          @change="tempChart.setOption({xAxis:{position:tempChartOption.xAxis.position}})"
                      >
                        <a-radio-button value="top"
                        ><span style="font-size: 12px">顶部</span></a-radio-button
                        >
                        <a-radio-button value="bottom"
                        ><span style="font-size: 12px">底部</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 12px;border-top: 1px solid #e8e8e8;">
                    <span class="label-left" style="width: 60px">标签</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="tempChartOption.xAxis.axisLabel.show"
                          @change="tempChart.setOption({xAxis:{axisLabel:{show:tempChartOption.xAxis.axisLabel.show}}})"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">长度</span>
                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="48"
                          max="200"
                          :style="{ width: '100%', fontSize: '12px' }"
                          v-model:value="tempChartOption.xAxis.axisLabel.width"
                          addon-after="px"
                          @change="tempChart.setOption({xAxis:{axisLabel:{width:tempChartOption.xAxis.axisLabel.width}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      >
                      </a-input-number>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">角度</span>
                    <div class="component-right">
                      <a-slider
                          v-model:value="tempChartOption.xAxis.axisLabel.rotate"
                          :min="-90"
                          :max="90"
                          :style="{ width: '100%' }"
                          @change="tempChart.setOption({xAxis:{axisLabel:{rotate:tempChartOption.xAxis.axisLabel.rotate}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      ></a-slider>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">离坐标轴</span>
                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="8"
                          :style="{ width: '100%', fontSize: '12px' }"
                          v-model:value="tempChartOption.xAxis.axisLabel.margin"
                          addon-after="px"
                          @change="tempChart.setOption({xAxis:{axisLabel:{margin:tempChartOption.xAxis.axisLabel.margin}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      >
                      </a-input-number>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">溢出处理</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          v-model:value="tempChartOption.xAxis.axisLabel.overflow"
                          @change="tempChart.setOption({xAxis:{axisLabel:{overflow:tempChartOption.xAxis.axisLabel.overflow}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      >
                        <a-radio-button value="truncate"
                        ><span style="font-size: 12px">截断</span></a-radio-button
                        >
                        <a-radio-button value="break"
                        ><span style="font-size: 12px">换行</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div
                      class="chart-item"
                      v-show="tempChartOption.xAxis.axisLabel.overflow == 'truncate'"
                  >
                    <span class="label-left" style="width: 60px">截断提示</span>
                    <div class="component-right">
                      <a-input
                          size="small"
                          :style="{ width: '100%', fontSize: '12px',height:'22px' }"
                          v-model:value="tempChartOption.xAxis.axisLabel.ellipsis"
                          @change="tempChart.setOption({xAxis:{axisLabel:{ellipsis:tempChartOption.xAxis.axisLabel.ellipsis}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      >
                      </a-input>
                    </div>
                  </div>

                  <div class="chart-item">
                    <a-radio-group
                        size="small"
                        :style="{height:'28px',lineHeight:'28px'}"
                        v-model:value="tempChartOption.xAxis.axisLabel.interval"
                        @change="tempChart.setOption({xAxis:{axisLabel:{interval:tempChartOption.xAxis.axisLabel.interval}}})"
                        :disabled="!tempChartOption.xAxis.axisLabel.show"
                    >
                      <a-radio value="auto"><span style="font-size: 12px;height: 28px;line-height: 28px;">自适应</span>
                      </a-radio>
                      <a-radio :value="0"><span style="font-size: 12px;height: 14px;line-height: 14px">全部标签</span>
                      </a-radio>
                    </a-radio-group>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">对齐刻度线</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          v-model:value="tempChartOption.xAxis.axisTick.alignWithLabel"
                          @change="tempChart.setOption({xAxis:{axisTick:{alignWithLabel:tempChartOption.xAxis.axisTick.alignWithLabel}}})"
                          :disabled="!tempChartOption.xAxis.axisLabel.show"
                      >
                        <a-radio :value="true"><span style="font-size: 12px">是</span></a-radio>
                        <a-radio :value="false"><span style="font-size: 12px">否</span></a-radio>
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 12px;border-top: 1px solid #e8e8e8;">
                    <span class="label-left" style="width: 60px">分割线</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="tempChartOption.xAxis.splitLine.show"
                          @change="tempChart.setOption({xAxis:{splitLine:{show:tempChartOption.xAxis.splitLine.show}}})"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <a-select
                        size="small"
                        v-model:value="tempChartOption.xAxis.splitLine.lineStyle.type"
                        @change="tempChart.setOption({xAxis:{splitLine:{lineStyle:{type:tempChartOption.xAxis.splitLine.lineStyle.type}}}})"
                        :disabled="!tempChartOption.xAxis.splitLine.show"
                    >
                      <a-select-option value="solid"><span style="font-size: 12px">实线</span></a-select-option>
                      <a-select-option value="dashed"><span style="font-size: 12px">虚线</span></a-select-option>
                      <a-select-option value="dotted"><span style="font-size: 12px">点线</span></a-select-option>
                    </a-select>

                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="1"
                          :style="{ width: '100%',fontSize: '12px' }"
                          v-model:value="tempChartOption.xAxis.splitLine.lineStyle.width"
                          addon-after="px"
                          @change="tempChart.setOption({xAxis:{splitLine:{lineStyle:{width:tempChartOption.xAxis.splitLine.lineStyle.width}}}})"
                          :disabled="!tempChartOption.xAxis.splitLine.show"
                      ></a-input-number>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>

            <div class="chart-group">
              <a-collapse v-model:activeKey="yAxisConfigShow" expand-icon-position="end"
                          :style="{border:'none',backgroundColor:'transparent',margin:'0',padding:'0'}"
              >
                <a-collapse-panel key="1" header="Y轴" :style="{border:'none',margin:'0',padding:'0',fontSize:'13px'}">
                  <div class="chart-item">
                    <span class="label-left" style="width: 24px">名称</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="yAxisNameShow"
                          @change="()=>{
                            if(yAxisNameShow){
                                tempChart.setOption({yAxis:{name:tempChartOption.yAxis.name}})
                            } else {
                              tempChartOption.yAxis.name = undefined;
                              tempChart.setOption({yAxis:{name:undefined}})
                            }
                          }"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left"></span>
                    <div class="component-right">
                      <a-input
                          size="small"
                          :style="{ width: '100%',  fontSize: '12px',height:'22px' }"
                          allow-clear
                          :disabled="!yAxisNameShow"
                          v-model:value="tempChartOption.yAxis.name"
                          @change="tempChart.setOption({yAxis:{name:tempChartOption.yAxis.name}})"
                      ></a-input>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">名称位置</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          :disabled="!yAxisNameShow"
                          v-model:value="tempChartOption.yAxis.nameLocation"
                          @change="tempChart.setOption({yAxis:{nameLocation:tempChartOption.yAxis.nameLocation}})"
                      >
                        <a-radio-button value="start"
                        ><span style="font-size: 12px">下</span></a-radio-button
                        >
                        <a-radio-button value="center"
                        ><span style="font-size: 12px">中</span></a-radio-button
                        >
                        <a-radio-button value="end"
                        ><span style="font-size: 12px">上</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">离坐标轴</span>

                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="8"
                          :style="{ width: '100%', fontSize: '12px' }"
                          :disabled="!yAxisNameShow"
                          v-model:value="tempChartOption.yAxis.nameGap"
                          addon-after="px"
                          @change="tempChart.setOption({yAxis:{nameGap:tempChartOption.yAxis.nameGap}})"
                      >
                      </a-input-number>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 2px">
                    <span class="label-left" style="width: 60px">坐标轴位置</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          v-model:value="tempChartOption.yAxis.position"
                          @change="tempChart.setOption({yAxis:{position:tempChartOption.yAxis.position}})"
                      >
                        <a-radio-button value="left"
                        ><span style="font-size: 12px">左侧</span></a-radio-button
                        >
                        <a-radio-button value="right"
                        ><span style="font-size: 12px">右侧</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 12px;border-top: 1px solid #e8e8e8;">
                    <span class="label-left" style="width: 60px">标签</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="tempChartOption.yAxis.axisLabel.show"
                          @change="tempChart.setOption({yAxis:{axisLabel:{show:tempChartOption.yAxis.axisLabel.show}}})"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">长度</span>
                    <div class="component-right">
                      <a-tooltip title="最大值200 最小值 48">
                        <a-input-number
                            size="small"
                            min="48"
                            max="200"
                            :style="{ width: '100%', fontSize: '12px' }"
                            v-model:value="tempChartOption.yAxis.axisLabel.width"
                            addon-after="px"
                            @change="tempChart.setOption({yAxis:{axisLabel:{width:tempChartOption.yAxis.axisLabel.width}}});"
                            :disabled="!tempChartOption.yAxis.axisLabel.show"
                        >
                        </a-input-number>
                      </a-tooltip>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">角度</span>
                    <div class="component-right">
                      <a-slider
                          v-model:value="tempChartOption.yAxis.axisLabel.rotate"
                          :min="-90"
                          :max="90"
                          :style="{ width: '100%' }"
                          @change="tempChart.setOption({yAxis:{axisLabel:{rotate:tempChartOption.yAxis.axisLabel.rotate}}})"
                          :disabled="!tempChartOption.yAxis.axisLabel.show"
                      ></a-slider>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">离坐标轴</span>
                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="8"
                          :style="{ width: '100%', fontSize: '12px' }"
                          v-model:value="tempChartOption.yAxis.axisLabel.margin"
                          addon-after="px"
                          @change="tempChart.setOption({yAxis:{axisLabel:{margin:tempChartOption.yAxis.axisLabel.margin}}})"
                          :disabled="!tempChartOption.yAxis.axisLabel.show"
                      >
                      </a-input-number>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 60px">溢出处理</span>
                    <div class="component-right">
                      <a-radio-group
                          size="small"
                          button-style="solid"
                          v-model:value="tempChartOption.yAxis.axisLabel.overflow"
                          @change="tempChart.setOption({yAxis:{axisLabel:{overflow:tempChartOption.yAxis.axisLabel.overflow}}})"
                          :disabled="!tempChartOption.yAxis.axisLabel.show"
                      >
                        <a-radio-button value="truncate"
                        ><span style="font-size: 12px">截断</span></a-radio-button
                        >
                        <a-radio-button value="break"
                        ><span style="font-size: 12px">换行</span></a-radio-button
                        >
                      </a-radio-group>
                    </div>
                  </div>

                  <div
                      class="chart-item"
                      v-show="tempChartOption.yAxis.axisLabel.overflow == 'truncate'"
                  >
                    <span class="label-left" style="width: 60px">截断提示</span>
                    <div class="component-right">
                      <a-input
                          size="small"
                          :style="{ width: '100%', fontSize: '12px' ,height:'22px'}"
                          v-model:value="tempChartOption.yAxis.axisLabel.ellipsis"
                          @change="tempChart.setOption({yAxis:{axisLabel:{ellipsis:tempChartOption.yAxis.axisLabel.ellipsis}}})"
                          :disabled="!tempChartOption.yAxis.axisLabel.show"
                      >
                      </a-input>
                    </div>
                  </div>

                  <div class="chart-item" style="margin-top: 12px;border-top: 1px solid #e8e8e8;">
                    <span class="label-left" style="width: 60px">分割线</span>
                    <div class="component-right">
                      <a-switch
                          size="small"
                          v-model:checked="tempChartOption.yAxis.splitLine.show"
                          @change="tempChart.setOption({yAxis:{splitLine:{show:tempChartOption.yAxis.splitLine.show}}})"
                      ></a-switch>
                    </div>
                  </div>

                  <div class="chart-item">
                    <a-select
                        size="small"
                        v-model:value="tempChartOption.yAxis.splitLine.lineStyle.type"
                        @change="tempChart.setOption({yAxis:{splitLine:{lineStyle:{type:tempChartOption.yAxis.splitLine.lineStyle.type}}}})"
                        :disabled="!tempChartOption.yAxis.splitLine.show"
                    >
                      <a-select-option value="solid"><span style="font-size: 12px">实线</span></a-select-option>
                      <a-select-option value="dashed"><span style="font-size: 12px">虚线</span></a-select-option>
                      <a-select-option value="dotted"><span style="font-size: 12px">点线</span></a-select-option>
                    </a-select>

                    <div class="component-right">
                      <a-input-number
                          size="small"
                          min="1"
                          :style="{ width: '100%',fontSize: '12px' }"
                          v-model:value="tempChartOption.yAxis.splitLine.lineStyle.width"
                          addon-after="px"
                          @change="tempChart.setOption({yAxis:{splitLine:{lineStyle:{width:tempChartOption.yAxis.splitLine.lineStyle.width}}}})"
                          :disabled="!tempChartOption.yAxis.splitLine.show"
                      ></a-input-number>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>

            <div class="chart-group">
              <div class="chart-item" style="margin-bottom:8px ">
                <span class="label-left" style="width: 48px">数据系列</span>
                <div class="component-right">
                  <a-checkbox v-model:value="allSeriesEqual"><span style="font-size: 12px">各系列一致</span>
                  </a-checkbox>
                </div>
              </div>
              <a-collapse v-model:activeKey="allSeriesConfigShow" expand-icon-position="end"
                          :style="{border:'none',backgroundColor:'transparent',margin:'0',padding:'0'}">

                <a-collapse-panel :style="{border:'none',marginTop:'8px',padding:'0',fontSize:'13px'}"
                                  v-for="(item ,index) in tempChartOption.series"
                                  :header="item.name"
                                  :key="item.id || index">

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">系列名称</span>

                    <div class="component-right">
                      <a-input v-model:value="item.name" size="small"
                               :style="{width:'100%',fontSize:'12px',height:'22px'}"
                               @change="()=>{tempChart.setOption({series:[{id:item.id,name:item.name}]})}">

                      </a-input>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">系列类型</span>

                    <div class="component-right">
                      <a-select v-model:value="item.type" size="small" @change="(value:string)=>{
                        tempChart.setOption({series:{id:item.id,type:value}})
                      }">
                        <a-select-option value="bar">
                          <span class="label-normal">柱状图</span>
                        </a-select-option>
                        <a-select-option value="line">
                          <span class="label-normal">折线图</span>
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">数据标签</span>

                    <div class="component-right">
                      <a-radio-group v-model:value="seriesLabelShow[item.id]"
                                     size="small"
                                     @change="seriesLabelControl(item)">
                        <a-radio-button value='show'><span class="label-normal">常显示</span></a-radio-button>
                        <a-radio-button value="hover"><span class="label-normal">悬停</span></a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">标签位置</span>

                    <div class="component-right">
                      <a-select v-model:value="item.label.position"
                                size="small"
                                @change="tempChart.setOption({series:[{id:item.id,label:{position:item.label.position}}]})"
                                :disabled="seriesLabelShow == null || seriesLabelShow[item.id] =='' ">
                        <a-select-option value='top'><span class="label-normal">顶部</span></a-select-option>
                        <a-select-option value="inside"><span class="label-normal">内中</span></a-select-option>
                        <a-select-option value="insideBottom"><span class="label-normal">内下</span></a-select-option>
                        <a-select-option value="insideTop"><span class="label-normal">内上</span></a-select-option>
                      </a-select>

                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">角度</span>

                    <div class="component-right">
                      <a-slider
                          v-model:value="item.label.rotate"
                          :min="-90"
                          :max="90"
                          :style="{ width: '100%' }"
                          @change="tempChart.setOption({series:{id:item.id,label:{rotate:item.label.rotate}}})"
                          :disabled="seriesLabelShow ==null || seriesLabelShow[item.id] =='' ">
                      </a-slider>
                    </div>
                  </div>

                  <div class="chart-item">
                    <span class="label-left" style="width: 48px">高亮状态</span>

                    <div class="component-right">
                      <a-radio-group v-model:value="item.emphasis.focus"
                                     size="small"
                                     @change="tempChart.setOption({series:{id:item.id,emphasis:{focus:item.emphasis.focus}}})">
                        <a-radio-button value='none'><span class="label-normal">无</span></a-radio-button>
                        <a-radio-button value="series"><span class="label-normal">系列</span></a-radio-button>
                        <a-radio-button value="self"><span class="label-normal">自身</span></a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>

                </a-collapse-panel>
              </a-collapse>
            </div>

            <div class="chart-group">
              <div class="chart-item">
                <span class="label-left" style="width: 48px">横(纵)向</span>
                <div class="content-right">
                  <a-checkbox v-model:checked="orient" value="vertical">条形图</a-checkbox>
                </div>
              </div>
            </div>
          </a-layout-sider>
        </a-layout>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.legend-position {
  display: flex;
  align-items: center;
  height: 72px;
  justify-content: space-between;
  margin-top: 2px;
}

.legend-position .legend-position-container {
  width: 140px;
  display: flex;
  align-items: center;
  height: 72px;
}

.legend-position .legend-position-container .legend-position-control {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 140px;
  height: 72px;
}

/* 控制按钮位置 */
.legend-position .legend-position-container .legend-position-control .btn {
  line-height: 24px;
  height: 24px;
  width: 100%;
  border-radius: 0;
}

.legend-position .legend-position-container .legend-position-control .left {
  padding-left: 6px;
  margin-left: 1px;
}

.legend-position .legend-position-container .legend-position-control .center {
  text-align: center;
}

.legend-position .legend-position-container .legend-position-control .right {
  padding-left: 20px;
}

.legend-position .legend-position-container .legend-position-control .btn.top.left {
  border-top-left-radius: 4px;
  margin-left: 0;
}

.legend-position .legend-position-container .legend-position-control .btn.top.right {
  border-top-right-radius: 4px;
}

.legend-position .legend-position-container .legend-position-control .btn.bottom.left {
  border-bottom-left-radius: 4px;
}

.legend-position .legend-position-container .legend-position-control .btn.bottom.right {
  border-bottom-right-radius: 4px;
}

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

:deep(.ant-collapse .ant-collapse-item .ant-collapse-header) {
  margin: 0;
  padding: 0;
}

:deep(.ant-collapse .ant-collapse-item  .ant-collapse-content) {
  border: none;
}


:deep(.ant-collapse .ant-collapse-item  .ant-collapse-content .ant-collapse-content-box) {
  padding: 0;

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

.label-left, .label-normal {
  font-size: 12px;
  height: 14px;
  line-height: 14px;
}

.component-right {
  width: 140px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.viewConfig::-webkit-scrollbar {
  width: 4px;
}

.viewConfig::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.viewConfig::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}
</style>
