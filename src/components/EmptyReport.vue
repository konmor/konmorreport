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
import * as echarts from 'echarts'
import {barTemplate} from '@/composable/ChartTemplate.ts'
import {Modal} from 'ant-design-vue'
import useNavigator from '@/composable/useNavigator.ts'
import B from '@/test/B.vue'
import type {EChartsType} from 'echarts'
import type {ECBasicOption} from 'echarts/types/dist/shared'
import Icon from '@ant-design/icons-vue'
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
  observer.observe(container as Element)
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

let legendPosition = ref('topCenter')


let tempChartOption: ECBasicOption = reactive<ECBasicOption>({
  // 标题属性
  title: {
    text: '測試',
    left: 'left',
    show: true,
    top: '2'
  },
  grid: {
    top: '8%',
    right: '2',
    left: '2',
    bottom: '2%',
    show: true,
    containLabel: true
  },
  tooltip: {
    show: true,
    // item 数据图像触发显示 axis 坐标范围内都会触发
    trigger: 'axis',
    // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
    // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    show: true,
    orient: 'horizontal', // vertical | horizontal
    top: '3.5%',
    left: 'center',
    type: 'scroll',
    tooltip: {
      show: true
    },
    emphasis: {
      show: true
    },
    animation: true,
    formatter: function (name:string) {
      return echarts.format.truncateText(name, 84, '14px Microsoft Yahei', '…');
    }
  },
  dataset: {
    dimensions: ['userName', 'salary1', 'salary2', 'salary3', 'salary4'],
    source: [
      {
        userName: '张三',
        salary1: 6300,
        salary2: 5200,
        salary3: 3200,
        salary4: 600
      },
      {
        userName: '王五',
        salary1: 6300,
        salary2: 5200,
        salary3: 3200,
        salary4: 600
      },
      {
        userName: '李四',
        salary1: 6300,
        salary2: 5200,
        salary3: 3200,
        salary4: 600
      },
      {
        userName: '福六',
        salary1: 6300,
        salary2: 5200,
        salary3: 3200,
        salary4: 600
      }
    ]
  },
  xAxis: {
    type: 'category',
    name:'x轴名称',
    nameLocation:'center', // start end center/middle
    nameGap:'8',
    position: 'bottom', // bottom top 坐标轴的位置

    // 标签是否展示, 宽度、距离
    axisLabel: {
      show: true,
      width: 100,
      rotate: 0,
      margin: 18,
      overflow: 'truncate',
      interval:0, // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
      formatter: function (value:string, index:number) {
        return value + 'kg';
        },
    },
    tooltip: {
      show: true // 配合 axisLabel.overflow
    },

    // 刻度线
    boundaryGap: true,
    axisTick: {
      // 对齐刻度线 在 boundaryGap:true,  条件下
      // true 对齐，false 不对齐
      alignWithLabel: true,
      show: true
    },

    // 分割线
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dotted',  // dotted dashed solid
        width:3
      }
    }

  },
  yAxis: {},
  series: [{type: 'bar',}, {type: 'bar'}, {type: 'bar'}, {type: 'bar'}]
})

const calculatePositionConfig = () => {
  let option:
      {
        legend:
            {
              show?: boolean,
              top?: string,
              left?: string,
              right?: string,
              bottom?: string,
              orient?: 'horizontal' | 'vertical',
            },
        grid: {
          top?: string,
          right?: string,
          left?: string,
          bottom?: string,
        },
        title: {
          show?: boolean,
          top?: string,
          right?: string,
          left?: string,
          bottom?: string,
        }
      }
      =
      {
        legend: {},
        grid: {},
        title: {}
      };

  let titleShow: boolean = tempChartOption.title.show;
  let legendShow: boolean = tempChartOption.legend.show;

  // topLeft 、topCenter、topRight、
  // leftCenter、rightCenter
  // bottomLeft、bottomCenter、bottomRight
  if (titleShow) {
    if (legendShow) {
      if (legendPosition.value.startsWith('top')) {

        option.grid.top = '8%';
        option.grid.left = '2';
        option.grid.right = '2';
        option.grid.bottom = '2%';

        option.legend.top = '3.5%'
        option.legend.bottom = undefined;

        option.title.top = '2'

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left';
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center';
        } else {
          option.legend.left = 'right';
        }


      } else if (legendPosition.value.startsWith('bottom')) {

        option.grid.top = '5%';
        option.grid.left = '2';
        option.grid.right = '2';
        option.grid.bottom = '4.5%';

        option.legend.top = undefined;
        option.legend.bottom = '2';

        option.title.top = '2'

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left';
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center';
        } else {
          option.legend.left = 'right';
        }

      } else if (legendPosition.value == 'leftCenter') {

        option.grid.top = '5%';
        option.grid.left = '9%';
        option.grid.right = '2';
        option.grid.bottom = '2%';

        option.legend.left = 'left';
        option.legend.top = '3.5%'
        option.legend.bottom = undefined;

        option.title.top = '2'

      } else if (legendPosition.value == 'rightCenter') {

        option.grid.top = '5%';
        option.grid.left = '2';
        option.grid.right = '9%';
        option.grid.bottom = '2%';

        option.legend.left = 'right';
        option.legend.top = '3.5%'
        option.legend.bottom = undefined;

        option.title.top = '2'
      } else {
        console.error('图表定位发生错误')
      }
    } else {
      option.grid.top = '5%';
      option.grid.left = '2';
      option.grid.right = '2';
      option.grid.bottom = '2%';

      option.legend.left = undefined;
      option.legend.top = undefined;
      option.legend.bottom = undefined;

      option.title.top = '2'
    }
  } else {
    if (legendShow) {
      option.title.top = undefined;
      if (legendPosition.value.startsWith('top')) {

        option.grid.top = '5%';
        option.grid.left = '2';
        option.grid.right = '2';
        option.grid.bottom = '2%';

        option.legend.top = '2'
        option.legend.bottom = undefined;

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left';
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center';
        } else {
          option.legend.left = 'right';
        }


      } else if (legendPosition.value.startsWith('bottom')) {

        option.grid.top = '2%';
        option.grid.left = '2';
        option.grid.right = '2';
        option.grid.bottom = '4.5%';

        option.legend.top = undefined;
        option.legend.bottom = '2';

        if (legendPosition.value.endsWith('Left')) {
          option.legend.left = 'left';
        } else if (legendPosition.value.endsWith('Center')) {
          option.legend.left = 'center';
        } else {
          option.legend.left = 'right';
        }

      } else if (legendPosition.value == 'leftCenter') {

        option.grid.top = '2%';
        option.grid.left = '9%';
        option.grid.right = '2';
        option.grid.bottom = '2%';

        option.legend.left = 'left';
        option.legend.top = '2%'
        option.legend.bottom = undefined;

      } else if (legendPosition.value == 'rightCenter') {

        option.grid.top = '2%';
        option.grid.left = '2';
        option.grid.right = '9%';
        option.grid.bottom = '2%';

        option.legend.left = 'right';
        option.legend.top = '2%'
        option.legend.bottom = undefined;

      } else {
        console.error('图表定位发生错误')
      }

    } else {
      option.grid.top = '2%';
      option.grid.left = '2';
      option.grid.right = '2';
      option.grid.bottom = '2%';

      option.legend.left = undefined;
      option.legend.top = undefined;
      option.legend.bottom = undefined;

      option.title.top = undefined;
    }
  }
  return option;
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
              backgroundColor: 'transparent',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
            }"
              width="240px"
          >
            <!--            标题控制-->
            <div class="chart-group">
              <a-input
                  v-show="false"
                  v-model:value="tempChartOption.title.id"
                  placeholder="组件唯一id"
              ></a-input>

              <div class="chart-item">
                <span class="label-left" style="width: 48px">标题</span>
                <div
                    :style="{
                    display: 'flex',
                    alignItems: 'center',
                    height: '28px',
                    width: '140px',
                    lineHeight: '28px',
                    justifyContent: 'space-between',
                  }"
                >
                  <a-switch
                      v-model:checked="tempChartOption.title.show"
                      @change="
                      () => {
                        let option = calculatePositionConfig();
                        option.title.show = tempChartOption.title.show;
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
                <a-input
                    v-model:value="tempChartOption.title.text"
                    placeholder="图表名称"
                    allow-clear
                    :disabled="!tempChartOption.title.show"
                    size="small"
                    :style="{ width: '140px', height: '28px', fontSize: '12px' }"
                    @change="tempChart.setOption({ title: { text: tempChartOption.title.text } })"
                ></a-input>
              </div>
            </div>

            <div class="chart-group">
              <div class="chart-item">
                <span class="label-left" style="width: 72px">坐标轴指示器</span>
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
                    <a-radio-button value="cross"><span>交叉</span></a-radio-button>
                    <a-radio-button value="shadow"><span>阴影</span></a-radio-button>
                    <a-radio-button value="line"><span>竖线</span></a-radio-button>
                  </a-radio-group>
                </a-tooltip>
              </div>
            </div>
            <div class="chart-group">
              <div class="chart-item">
                <span class="label-left" style="width: 24px">图例</span>
                <div
                    :style="{
                    width: '140px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }"
                >
                  <a-switch
                      v-model:checked="tempChartOption.legend.show"
                      @change="
                      () => {
                        let option = calculatePositionConfig();
                        option.legend.show = tempChartOption.legend.show;
                        tempChart.setOption(option);
                      }
                    "
                  ></a-switch>
                </div>
              </div>

              <div
                  class="legend-position">
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
                      @change="()=>{
                        let option = calculatePositionConfig();
                        option.legend.orient = 'horizontal';
                        if(legendPosition == 'leftCenter' || legendPosition == 'rightCenter'){
                          option.legend.orient = 'vertical';
                        }
                        tempChart.setOption(option);
                    }"
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

.label-left {
  font-size: 12px;
  height: 14px;
  line-height: 14px;
}
</style>
