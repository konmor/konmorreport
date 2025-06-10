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
import {BarChartOutlined, LineChartOutlined} from '@ant-design/icons-vue'
// 1. 引入echarts
import * as echarts from 'echarts'

import {barTemplate} from '@/composable/ChartTemplate.ts'
import {Modal} from 'ant-design-vue'
import useNavigator from '@/composable/useNavigator.ts'
import B from '@/test/B.vue'
import type {EChartsType} from 'echarts'
import type {ECBasicOption} from 'echarts/types/dist/shared'
import {UpOutlined, DownOutlined, SettingOutlined} from '@ant-design/icons-vue'
import Left from '@/assets/icon/Left.vue'
import Center from '@/assets/icon/Center.vue'
import Right from '@/assets/icon/Right.vue'
import TopLeft from '@/assets/icon/legend/TopLeft.vue'
import TopCenter from '@/assets/icon/legend/TopCenter.vue'
import TopRight from '@/assets/icon/legend/TopRight.vue'
import LeftCenter from '@/assets/icon/legend/LeftCenter.vue'
import RightCenter from '@/assets/icon/legend/RightCenter.vue'
import BottomLeft from '@/assets/icon/legend/BottomLeft.vue'
import BottomCenter from '@/assets/icon/legend/BottomCenter.vue'
import BottomRight from '@/assets/icon/legend/BottomRight.vue'
import Position from '@/assets/icon/legend/Position.vue'
import PerfectScrollbar from 'perfect-scrollbar'
import {themArray} from '@/echartsThem/registerThem.ts'

// 主题是否展开
let pileOpen = ref('')
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
  // 二 开始配置 配置内容由 selectData.open 点击ok后的模态框决定
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
  myEcharts.setOption(toRaw(tempChartOption))

  let observer = new ResizeObserver(() => {
    if (myEcharts) myEcharts.resize()
  })
  tempObserver = observer
  observer.observe(container as Element)

  // 堆叠配置 待删除
  let colors = currentColors.value
  // 4 * 8 32 3*8 = 24
  for (let i = 0; i < dimensions.length - 1; i++) {
    stackItems[i] = [{name: dimensions[i + 1], id: i + 1, color: colors[i]}]
  }
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

let xAxisConfigShow = ref('')
let yAxisConfigShow = ref('')

let legendPosition = ref('topCenter')

let xAxisNameShow = ref(false)
let yAxisNameShow = ref(false)

let allSeriesEqual = ref(false)

let allSeriesConfigShow = ref([])

let seriesLabelShow = ref<Record<string, 'show' | 'hover' | ''>>({})

const seriesLabelControl = (item) => {
  if (seriesLabelShow.value[item.id] != null && seriesLabelShow.value[item.id]) {
    item.emphasis.label.show = true
    item.label.show = true
  } else {
    item.emphasis.label.show = false
    item.label.show = false
  }
  let temp = {
    id: item.id,
    label: {show: item.label.show},
    emphasis: {label: {show: item.emphasis.label.show}},
  }
  tempChart.setOption({
    series: temp,
  })
}

let vertical = ref(false) //horizontal vertical
let zoomShow = ref<string[]>([])
let xZoomShow = ref<boolean>(false)
let yZoomShow = ref<boolean>(false)

let xZoom = ref<string[]>([])

let yZoom = ref<string[]>([])

let xZoomRange = ref<[number, number]>([0, 100])

let yZoomRange = ref<[number, number]>([0, 100])

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

let yAxisInterval = ref(false)
let xAxisInterval = ref(false)

let dimensions = ['userName', 'salary1', 'salary2', 'salary3', 'salary4']

const changeAllType = (value: string) => {
  let option = []
  for (let i = 0; i < tempChartOption.series.length; i++) {
    option.push({id: tempChartOption.series[i].id, type: value})
    tempChartOption.series[i].type = value
  }
  tempChart.setOption({series: option})
}

const changAllLabelControl = (item) => {
  let checked = seriesLabelShow.value[item.id]
  let emphasisLabelShow = false
  let labelShow = false

  if (seriesLabelShow.value[item.id] != null && seriesLabelShow.value[item.id]) {
    emphasisLabelShow = true
    labelShow = true
  }

  let option = []
  for (let i = 0; i < tempChartOption.series.length; i++) {
    option.push({
      id: tempChartOption.series[i].id,
      label: {show: labelShow},
      emphasis: {label: {show: emphasisLabelShow}},
    })

    tempChartOption.series[i].emphasis.label.show = emphasisLabelShow
    tempChartOption.series[i].label.show = labelShow
    seriesLabelShow.value[tempChartOption.series[i].id] = checked
  }
  tempChart.setOption({series: option})
}

const changeAllLabelPosition = (item) => {
  let position = item.label.position
  let option = []
  for (let i = 0; i < tempChartOption.series.length; i++) {
    option.push({
      id: tempChartOption.series[i].id,
      label: {position: position},
    })

    tempChartOption.series[i].label.position = position
  }
  tempChart.setOption({series: option})
}

const changeAllRotate = (item) => {
  let rotate = item.label.rotate
  let option = []
  for (let i = 0; i < tempChartOption.series.length; i++) {
    option.push({
      id: tempChartOption.series[i].id,
      label: {rotate: rotate},
    })

    tempChartOption.series[i].label.rotate = rotate
  }
  tempChart.setOption({series: option})
}

const changeAllSeriesEmphasis = (item) => {
  let focus = item.emphasis.focus
  let option = []
  for (let i = 0; i < tempChartOption.series.length; i++) {
    option.push({
      id: tempChartOption.series[i].id,
      emphasis: {focus: focus},
    })
    tempChartOption.series[i].emphasis.focus = focus
  }
  tempChart.setOption({series: option})
}

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





let stackItems = reactive([[]])

watch(stackItems, (items) => {
  let option = {series: []}
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    if (item.length != 0) {
      //
      let stack = 'group' + i
      for (let j = 0; j < item.length; j++) {
        option.series.push({id: item[j].id, name: item[j].name, stack: stack})
      }
    }
  }
  tempChart.setOption(option)
  if (vertical.value) {
    stackContainerStyle.value.width = stackItems.length * 22.4 + 'px'
    stackContainerStyle.value.height = '18px'
  } else {
    stackContainerStyle.value.width = '18px'
    stackContainerStyle.value.height = stackItems.length * 22.4 + 'px'
  }
})

let stackContainerStyle = ref({
  width: '18px',
  height: stackItems.length * 22.4 + 'px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
})

let stackItemStyle = ref({
  height: '1.6em',
  width: '1em',
})

let stackContainersStyle = ref({
  display: 'flex',
  flexDirection: 'row',
  overflow: 'auto',
})

watch(vertical, () => {
  if (vertical.value) {
    stackContainerStyle.value = {
      width: stackItems.length * 22.4 + 'px',
      height: '18px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    }
    stackItemStyle.value.width = '1.6em'
    stackItemStyle.value.height = '1em'
    stackContainersStyle.value.flexDirection = 'column'
  } else {
    stackContainerStyle.value = {
      width: '18px',
      height: stackItems.length * 22.4 + 'px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }
    stackItemStyle.value.width = '1em'
    stackItemStyle.value.height = '1.6em'

    stackContainersStyle.value.flexDirection = 'row'
  }
})

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
        // 堆叠配置
        let colors = currentColors.value
        // 4 * 8 32 3*8 = 24
        for (let i = 0; i < dimensions.length - 1; i++) {
          stackItems[i] = [{name: dimensions[i + 1], id: i + 1, color: colors[i]}]
        }
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


let currentColors = ref(themArray.find((item) => item.themeName == currentThem.value).theme.color)

watch(currentThem, (them) => {
  currentColors.value = themArray.find((item) => item.themeName == them).theme.color

  for (let i = 0; i < stackItems.length; i++) {
    let stackItem = stackItems[i]
    if (stackItem.length > 0) {
      for (let j = 0; j < stackItem.length; j++) {
        stackItem[j].color = currentColors.value[parseInt(stackItem[j].id) - 1]
      }
    }
  }
})



const chartData = reactive<{ open: boolean; ok: (reject: any) => void }>({
  open: false,
  ok: (reject: any) => {
    chartData.open = false;

    // 配置好之后从 temChart 中获取数据，并渲染给最后一个 chartArray 中的chart
    chartArray[chartArray.length-1].setOption(tempChart.getOption(),true);
    tempChart.dispose();
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
      <!--        :open="chartData.open"-->
      <a-modal
          :open="chartData.open"
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
              width="240px"
              class="viewConfig"
          >

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

.stackContainer {
  border: #e8e8e8 1px solid;
  padding: 1px;
  margin: 1px;
  border-radius: 3px;
}

.stackContainer .stackItem {
  border: 1px #eee solid;
  border-radius: 3px;
  cursor: move;
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

:deep(.ant-collapse .ant-collapse-item .ant-collapse-content) {
  border: none;
}

:deep(.ant-collapse .ant-collapse-item .ant-collapse-content .ant-collapse-content-box) {
  padding: 0;
}

:deep(.ant-input-number-group-wrapper .ant-input-number-group .ant-input-number-group-addon) {
  font-size: 12px;
  height: 14px;
  line-height: 14px;
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

.label-left,
.label-normal {
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

.pileContainers::-webkit-scrollbar {
  height: 4px;
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
</style>
