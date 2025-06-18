<script setup lang="ts">

import {themArray} from "@/echartsThem/registerThem.ts";
import LeftCenter from "@/assets/icon/legend/LeftCenter.vue";
import TopCenter from "@/assets/icon/legend/TopCenter.vue";
import Position from "@/assets/icon/legend/Position.vue";
import RightCenter from "@/assets/icon/legend/RightCenter.vue";
import Right from "@/assets/icon/Right.vue";
import BottomCenter from "@/assets/icon/legend/BottomCenter.vue";
import BottomLeft from "@/assets/icon/legend/BottomLeft.vue";
import Left from "@/assets/icon/Left.vue";
import {BarChartOutlined, LineChartOutlined} from "@ant-design/icons-vue";
import TopLeft from "@/assets/icon/legend/TopLeft.vue";
import BottomRight from "@/assets/icon/legend/BottomRight.vue";
import Center from "@/assets/icon/Center.vue";
import TopRight from "@/assets/icon/legend/TopRight.vue";
import {nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch} from "vue";
import * as echarts from "echarts";
import draggable from 'vuedraggable'
import {getColor} from "echarts/types/src/chart/candlestick/candlestickVisual";

interface GridPosition {
  [key: string]: { top: number; left: number; right: number; bottom: number }
}

// 特之配置组件 如 主题、堆叠 等配置
interface ComponentPosition {
  currentStatus: string
  position: { top: number; left: number; right: number; bottom: number } | undefined
  allStatus: GridPosition
}
let {getChartConfig,setChartConfig,chartOption, chartContainer, clearCurrentConfig} =
    defineProps(['getChartConfig','setChartConfig', 'chartOption', 'chartContainer', 'clearCurrentConfig']);

let chartConfig:any;

const chartConfigConstParams = {
  titleGridPosition: {
    left: {top: 2.5, left: 0, right: 0, bottom: 0},
    right: {top: 2.5, left: 0, right: 0, bottom: 0},
    center: {top: 2.5, left: 0, right: 0, bottom: 0},
  } as GridPosition,
  legendGridPosition: {
    topLeft: {top: 2.5, left: 0, right: 0, bottom: 0},
    topCenter: {top: 2.5, left: 0, right: 0, bottom: 0},
    topRight: {top: 2.5, left: 0, right: 0, bottom: 0},
    leftCenter: {top: 0, left: 7, right: 0, bottom: 0},
    rightCenter: {top: 0, left: 0, right: 7, bottom: 0},
    bottomLeft: {top: 0, left: 0, right: 0, bottom: 3.5},
    bottomRight: {top: 0, left: 0, right: 0, bottom: 3.5},
    bottomCenter: {top: 0, left: 0, right: 0, bottom: 3.5},
  } as GridPosition,
  xAxisNamePosition: {
    start: {top: 0, left: 3, right: 0, bottom: 0},
    end: {top: 0, left: 0, right: 3, bottom: 0},
    topCenter: {top: 2.5, left: 0, right: 0, bottom: 0},
    bottomCenter: {top: 0, left: 0, right: 0, bottom: 2.5},
  } as GridPosition,
  yAxisNamePosition: {
    leftTop: {top: 2.5, left: 0, right: 0, bottom: 0},
    leftCenter: {top: 0, left: 0, right: 0, bottom: 0},
    leftBottom: {top: 0, left: 0, right: 0, bottom: 2.5},
    rightTop: {top: 2.5, left: 0, right: 0, bottom: 0},
    rightCenter: {top: 0, left: 0, right: 0, bottom: 0},
    rightBottom: {top: 0, left: 0, right: 0, bottom: 2.5},
  } as GridPosition,
  zoomPosition: {
    right: {top: 0, left: 0, right: 3, bottom: 0},
    bottom: {top: 0, left: 0, right: 0, bottom: 7},
  } as GridPosition,
}

let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  currentThem: 'customized', // 当前主题
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色
  pileActiveKey: '', // 展开堆叠折叠面板
  stackItems: [[]] as Array<Array<{ id: string, name: string, color: string }>>, // 堆叠的内容[[{name,id,color}]]
  legendPosition: 'topCenter', // 图例的位置
  xAxisActiveKey: '', // 展开x轴折叠面板
  xAxisNameShow: false, // x轴名称显示开关
  xAxisIntervalChecked: false, // 标签是否固定间隔

  yAxisActiveKey: '',
  yAxisNameShow: false,
  yAxisIntervalChecked: false,

  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容
  seriesLabelShow: {} as Record<string, 'show' | 'hover' | ''>, // key 是该系列的id，value是 'show' | 'hover' | ''

  vertical: false, // 是否条形图
  zoomShow: [], // string[] 缩放组件控制器显示隐藏控制
  xZoomShow: false, // x轴缩放组件显示隐藏控制
  yZoomShow: false, // y轴缩放组件显示隐藏控制
  xZoom: [],
  yZoom: [],
  xZoomRange: [0, 100],
  yZoomRange: [0, 100],
  currentGridPosition:
      {top: 7, left: 0.5, right: 0.5, bottom: 0.5},

  currentTitlePosition: {
    currentStatus: 'left',
    position: undefined,
    allStatus: chartConfigConstParams.titleGridPosition,
  } as ComponentPosition,

  currentLegendPosition: {
    currentStatus: 'topCenter',
    position: undefined,
    allStatus: chartConfigConstParams.legendGridPosition,
  } as ComponentPosition,

  currentXAxisNamePosition: {
    currentStatus: 'bottomCenter',
    position: undefined,
    allStatus: chartConfigConstParams.xAxisNamePosition,
  } as ComponentPosition,

  currentYAxisNamePosition: {
    currentStatus: 'leftTop',
    position: undefined,
    allStatus: chartConfigConstParams.yAxisNamePosition,
  } as ComponentPosition,

  currentXZoomPosition: {
    currentStatus: 'bottom',
    position: undefined,
    allStatus: chartConfigConstParams.zoomPosition,
  } as ComponentPosition,

  currentYZoomPosition: {
    currentStatus: 'right',
    position: undefined,
    allStatus: chartConfigConstParams.zoomPosition,
  } as ComponentPosition,

});

const chartConfigFunction = {
  changeThem: (themName: string) => {
    if(chartConfig==null){
      chartConfig = getChartConfig();
    }
    // let crtOption = chartConfig.getOption();
    chartConfig.dispose();
    // 赋新值
    chartConfig = echarts.init(chartContainer, themName) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    chartConfig.setOption(chartOption);

    setChartConfig(chartConfig); // 传递给父级
    chartConfigControl.currentThem = themName // 当前主题
  },
  openAndCloseComponent: (
      currentComponentPosition: ComponentPosition,
      show: boolean,
  ) => {
    let top = 0
    let left = 0
    let right = 0
    let bottom = 0;
    let currentStatus = currentComponentPosition.currentStatus;
    if (show) {
      top += currentComponentPosition.allStatus[currentStatus].top
      left += currentComponentPosition.allStatus[currentStatus].left
      right += currentComponentPosition.allStatus[currentStatus].right
      bottom += currentComponentPosition.allStatus[currentStatus].bottom
    } else {
      top -= currentComponentPosition.allStatus[currentStatus].top
      left -= currentComponentPosition.allStatus[currentStatus].left
      right -= currentComponentPosition.allStatus[currentStatus].right
      bottom -= currentComponentPosition.allStatus[currentStatus].bottom
    }
    return {top, left, right, bottom}
  },
  changeGridPosition: (top: number, left: number, right: number, bottom: number) => {
    chartConfigControl.currentGridPosition.top += top
    chartConfigControl.currentGridPosition.left += left
    chartConfigControl.currentGridPosition.right += right
    chartConfigControl.currentGridPosition.bottom += bottom
  },
  changeComponentPosition: (
      crtPosition: ComponentPosition,
      changeStatus: string,
  ) => {
    let top = 0,left = 0,right = 0,bottom = 0;
    let currentStatus = crtPosition.currentStatus;
    if (crtPosition.position != undefined) {
      top = -crtPosition.position.top
      left = -crtPosition.position.left
      right = -crtPosition.position.right
      bottom = -crtPosition.position.bottom
    } else {
      top = -crtPosition.allStatus[currentStatus].top
      left = -crtPosition.allStatus[currentStatus].left
      right = -crtPosition.allStatus[currentStatus].right
      bottom = -crtPosition.allStatus[currentStatus].bottom
    }

    top += crtPosition.allStatus[changeStatus].top
    left += crtPosition.allStatus[changeStatus].left
    right += crtPosition.allStatus[changeStatus].right
    bottom += crtPosition.allStatus[changeStatus].bottom

    crtPosition.currentStatus = changeStatus;
    return {top, left, right, bottom}
  },
  // 变更所有系列的类型，如柱状图全部变为折线图
  changeAllSeriesType: (value: string) => {
    let option = [];
    for (let i = 0; i < chartOption.series.length; i++) {
      if(value == 'bar'){
        option.push({
          id: chartOption.series[i].id,
          barMaxWidth: '50',
          barMinWidth: '1',
          type: value});

        chartOption.series[i].type = value
        chartOption.series[i].barMaxWidth = '50'
        chartOption.series[i].barMinWidth = '1'
      }else {
        option.push({
          id: chartOption.series[i].id,
          type: value});

        chartOption.series[i].type = value
      }
    }
    chartConfig.setOption({series: option})
  },
  changAllSeriesLabelControl: (item: { id: string }) => {

    let seriesLabelShow = chartConfigControl.seriesLabelShow;
    let checked = seriesLabelShow[item.id];
    let emphasisLabelShow = false
    let labelShow = false

    if (seriesLabelShow[item.id] != null && seriesLabelShow[item.id]) {
      emphasisLabelShow = true
      labelShow = true
    }

    let option = []
    for (let i = 0; i < chartOption.series.length; i++) {
      option.push({
        id: chartOption.series[i].id,
        label: {show: labelShow},
        emphasis: {label: {show: emphasisLabelShow}},
      })

      chartOption.series[i].emphasis.label.show = emphasisLabelShow
      chartOption.series[i].label.show = labelShow
      seriesLabelShow[chartOption.series[i].id] = checked
    }
    chartConfig.setOption({series: option})
  },
  seriesLabelControl: (item: any) => {
    let seriesLabelShow = chartConfigControl.seriesLabelShow;
    if (seriesLabelShow[item.id] != null && seriesLabelShow[item.id]) {
      item.emphasis.label.show = true
      item.label.show = true
    } else {
      item.emphasis.label.show = false
      item.label.show = false
    }
    let option = {
      id: item.id,
      label: {show: item.label.show},
      emphasis: {label: {show: item.emphasis.label.show}},
    }
    chartConfig.setOption({
      series: option,
    })
  },

  changeAllLabelPosition: (item: any) => {
    let position = item.label.position
    let option = []
    for (let i = 0; i < chartOption.series.length; i++) {
      option.push({
        id: chartOption.series[i].id,
        label: {position: position},
      })

      chartOption.series[i].label.position = position
    }
    chartConfig.setOption({series: option})
  },

  changeAllRotate: (item: any) => {
    let rotate = item.label.rotate
    let option = []
    for (let i = 0; i < chartOption.series.length; i++) {
      option.push({
        id: chartOption.series[i].id,
        label: {rotate: rotate},
      })

      chartOption.series[i].label.rotate = rotate
    }
    chartConfig.setOption({series: option})
  },

  changeAllSeriesEmphasis: (item: any) => {
    let focus = item.emphasis.focus
    let option = []
    for (let i = 0; i < chartOption.series.length; i++) {
      option.push({
        id: chartOption.series[i].id,
        emphasis: {focus: focus},
      })
      chartOption.series[i].emphasis.focus = focus
    }
    chartConfig.setOption({series: option})
  },
  initStackItems: () => {
    for (let i = 0; i < chartOption.series.length; i++) {
      let seriesItem = chartOption.series[i];
      chartConfigControl.stackItems[i] = [
        {
          id: seriesItem.id,
          name: seriesItem.name,
          color: chartConfigFunction.getColor(i)
        }
      ]
    }

    chartConfigStyle.stackContainerStyle.height = chartConfigControl.stackItems.length * 22.4 + 'px';
  },
  titleSwitchChange: () => {
    // 设置选项
    let option = { title: { show: chartOption.title.show },legend:{top:'3%'}};

    if( (!chartOption.title.show) && chartOption.legend.show && chartConfigControl.legendPosition.startsWith('top')){
      option.legend.top = '0.5%'
    }
    chartConfig.setOption(option);

    // grid 布局
    let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
        chartConfigControl.currentTitlePosition,
        chartOption.title.show
    )

    chartConfigFunction.changeGridPosition(top, left, right, bottom );
  },
  getColor:(index:number)=>{
    let i = index % chartConfigControl.currentColors.length;
    return chartConfigControl.currentColors[i];
  }
};

const chartConfigStyle = reactive({
  stackContainersStyle: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
  },
  stackContainerStyle: {
    width: '18px',
    height: '32px', // 高度使用默认的高度后续会更改
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  stackItemStyle: {
    height: '1.6em',
    width: '1em',
  }
});


// grid的变化
watch(chartConfigControl.currentGridPosition, (grid) => {
  chartConfig.setOption({
    grid: {
      top: grid.top + '%',
      left: grid.left + '%',
      right: grid.right + '%',
      bottom: grid.bottom + '%',
    },
  })
})

// 主题切换
watch(() => chartConfigControl.currentThem, (them) => {
  chartConfigControl.currentColors = themArray.find((item) => item.themeName == them)!.theme.color

  for (let i = 0; i < chartConfigControl.stackItems.length; i++) {
    let stackItem = chartConfigControl.stackItems[i]
    if (stackItem.length > 0) {
      for (let j = 0; j < stackItem.length; j++) {
        let index = (parseInt(stackItem[j].id) - 1) % chartConfigControl.currentColors.length;
        // todo
        stackItem[j].color = chartConfigControl.currentColors[index]
      }
    }
  }
})

// series 变化

watch(()=>chartOption.series,(value)=>{
  // series 发生变化则重新初始化堆叠内容
  chartConfigFunction.initStackItems();
})

// 堆叠变化
watch(chartConfigControl.stackItems, (items: Array<Array<{ id: string, name: string, color: string }>>) => {
  let option: { series: Array<any> } = {series: []};
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    if (item.length != 0) {
      let stack = 'group' + i
      for (let j = 0; j < item.length; j++) {
        option.series.push({id: item[j].id, name: item[j].name, stack: stack})
      }
    }
  }

  chartConfig.setOption(option);

  if (chartConfigControl.vertical) {
    chartConfigStyle.stackContainerStyle.width = chartConfigControl.stackItems.length * 22.4 + 'px'
    chartConfigStyle.stackContainerStyle.height = '18px'
  } else {
    chartConfigStyle.stackContainerStyle.width = '18px'
    chartConfigStyle.stackContainerStyle.height = chartConfigControl.stackItems.length * 22.4 + 'px'
  }
})
// 条形图和柱状图的切换
watch(() => chartConfigControl.vertical, () => {
  if (chartConfigControl.vertical) {
    chartConfigStyle.stackContainerStyle = {
      width: chartConfigControl.stackItems.length * 22.4 + 'px',
      height: '18px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    }
    chartConfigStyle.stackItemStyle.width = '1.6em'
    chartConfigStyle.stackItemStyle.height = '1em'
    chartConfigStyle.stackContainersStyle.flexDirection = 'column'
  } else {
    chartConfigStyle.stackContainerStyle = {
      width: '18px',
      height: chartConfigControl.stackItems.length * 22.4 + 'px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }
    chartConfigStyle.stackItemStyle.width = '1em'
    chartConfigStyle.stackItemStyle.height = '1.6em'

    chartConfigStyle.stackContainersStyle.flexDirection = 'row'
  }
})

onMounted(()=>{
  // 初始化堆叠配置
  chartConfigFunction.initStackItems();
  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(()=>{
    // 初始化堆叠配置
    chartConfig = getChartConfig();
  })
})

onUnmounted(()=>{
  clearCurrentConfig();
})
</script>

<template>
  <!--主题-->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.themActiveKey"
      expand-icon-position="end"
      :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
        key="them"
        header="主题"
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <div
          class="chart-item color-items"
          v-for="(item, index) in themArray"
          :key="index"
          :style="{
            backgroundColor: item.theme.backgroundColor,
            paddingLeft: '6px',
            paddingRight: '6px',
            borderRadius: '3px',
            marginTop: '5px',
            border: '1px solid #eee',
            cursor: 'pointer',
          }"
          @click="chartConfigFunction.changeThem(item.themeName)"
        >
          <div
            v-for="(colorItem, colorIndex) in item.theme.color.length > 7
              ? 7
              : item.theme.color.length"
            class="color-item"
            :key="colorIndex"
            :style="{
              backgroundColor: item.theme.color[colorIndex],
              height: '20px',
              width: '20px',
              borderRadius: '3px',
            }"
          ></div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <!-- 堆叠 -->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.pileActiveKey"
      expand-icon-position="end"
      :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
        key="them"
        header="堆叠"
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <div class="stackContainers" :style="chartConfigStyle.stackContainersStyle">
          <draggable
            v-for="item in chartConfigControl.stackItems"
            :style="chartConfigStyle.stackContainerStyle"
            class="stackContainer"
            :list="item"
            :group="{ name: 'outerPile', pull: true, put: true }"
            animation="800"
            item-key="id"
            tag="div"
          >
            <template #item="{ element }">
              <div
                :id="element.id"
                :style="{
                  backgroundColor: element.color,
                  height: chartConfigStyle.stackItemStyle.height,
                  width: chartConfigStyle.stackItemStyle.width,
                }"
                class="stackItem"
              ></div>
            </template>
          </draggable>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <!-- 标题-->
  <div class="chart-group">
    <a-input
      v-show="false"
      size="small"
      v-model:value="chartOption.title.id"
      placeholder="组件唯一id"
    ></a-input>

    <!--标题开关以及位置-->
    <div class="chart-item">
      <span class="label-left" style="width: 48px">标题</span>
      <div class="component-right">
        <a-switch
          size="small"
          v-model:checked="chartOption.title.show"
          @change="chartConfigFunction.titleSwitchChange()"
        ></a-switch>
        <a-radio-group
          v-model:value="chartOption.title.left"
          :disabled="!chartOption.title.show"
          button-style="solid"
          size="small"
          @change="
            () => {
              // 1. 设置图表配置
              let option = { title: { left: chartOption.title.left } }
              chartConfig.setOption(option)

              //2. 计算该组件需要的grid调整的空间
              let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                chartConfigControl.currentTitlePosition,
                chartOption.title.left,
              )

              // 3. 调整grid的位置
              chartConfigFunction.changeGridPosition(top, left, right, bottom)
            }
          "
        >
          <a-radio-button value="left">
            <Left />
          </a-radio-button>
          <a-radio-button value="center">
            <Center />
          </a-radio-button>
          <a-radio-button value="right">
            <Right />
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <!--标题名称-->
    <div class="chart-item" style="margin-top: 2px">
      <span class="label-left" style="width: 24px">名称</span>
      <div class="component-right">
        <a-input
          v-model:value="chartOption.title.text"
          placeholder="图表名称"
          allow-clear
          :disabled="!chartOption.title.show"
          size="small"
          :style="{ width: '100%', fontSize: '12px', height: '22px' }"
          @change="chartConfig.setOption({ title: { text: chartOption.title.text } })"
        ></a-input>
      </div>
    </div>
  </div>

  <!-- 鼠标指示器 -->
  <div class="chart-group">
    <!--指示器类型-->
    <div class="chart-item">
      <span class="label-left" style="width: 36px">指示器</span>
      <div class="component-right">
        <a-tooltip title="鼠标挪入图表中可查看效果！">
          <a-radio-group
            size="small"
            button-style="solid"
            v-model:value="chartOption.tooltip.axisPointer.type"
            @change="
              chartConfig.setOption({
                tooltip: {
                  axisPointer: { type: chartOption.tooltip.axisPointer.type },
                },
              })
            "
          >
            <a-radio-button value="cross"><span style="font-size: 12px">交叉</span></a-radio-button>
            <a-radio-button value="shadow"
              ><span style="font-size: 12px">阴影</span></a-radio-button
            >
            <a-radio-button value="line"><span style="font-size: 12px">竖线</span></a-radio-button>
          </a-radio-group>
        </a-tooltip>
      </div>
    </div>
  </div>

  <!--图例控制-->
  <div class="chart-group">
    <!-- 图例开关控件-->
    <div class="chart-item">
      <span class="label-left" style="width: 24px">图例</span>
      <div class="component-right">
        <a-switch
          size="small"
          v-model:checked="chartOption.legend.show"
          @change="
            () => {
              // 1. 计算该组件（图例）需要grid让出的空间
              let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
                chartConfigControl.currentLegendPosition,
                chartOption.legend.show,
              )
              // 2. 调整grid，让x-y坐标系 让出位置
              chartConfigFunction.changeGridPosition(top, left, right, bottom)
              // 3. 设置图例、以及设置缩放组件的布局。
              let option:{
               legend:{
                 show?:boolean,
                 top?: string
               },
               dataZoom:Array<{id:string,top?:string,left?:string}>
              } = {
                legend: {
                  show: chartOption.legend.show,
                },
                dataZoom: [
                  {
                    id: 'x0Slider',
                    top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                  },
                  {
                    id: 'y0Slider',
                    left: 101 - chartConfigControl.currentGridPosition.right + '%',
                  },
                ],
              }
              //当只有图例时，图例的顶部空间仅保留 0.5%
              if (
                !chartOption.title.show &&
                chartOption.legend.show &&
                chartConfigControl.legendPosition.startsWith('top')
              ) {
                option.legend.top = '0.5%'
              }
              chartConfig.setOption(option)
            }
          "
        ></a-switch>
      </div>
    </div>
    <!-- 图例位置控件-->
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
          v-model:value="chartConfigControl.legendPosition"
          :disabled="!chartOption.legend.show"
          @change="
            () => {
              // 计算图例位置
              let thisPosition: {
                top: string | undefined
                left: string | undefined
                right: string | undefined
                bottom: string | undefined
              } = {
                top: '3%',
                left: 'center',
                right: undefined,
                bottom: undefined,
              }

              // top 和 bottom
              if (chartConfigControl.legendPosition.startsWith('bottom')) {
                thisPosition.top = undefined
                thisPosition.bottom = '1%'
              }

              // left
              if (
                chartConfigControl.legendPosition.endsWith('Left') ||
                chartConfigControl.legendPosition == 'leftCenter'
              ) {
                thisPosition.left = 'left'
              } else if (
                chartConfigControl.legendPosition.endsWith('Right') ||
                chartConfigControl.legendPosition == 'rightCenter'
              ) {
                thisPosition.left = 'right'
              }

              if (
                !chartOption.title.show &&
                chartOption.legend.show &&
                chartConfigControl.legendPosition.startsWith('top')
              ) {
                thisPosition.top = '0.5%'
              }
              // 1. 计算该组件所需grid让出的空间
              let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                chartConfigControl.currentLegendPosition,
                chartConfigControl.legendPosition,
              )
              // 2. 调整grid
              chartConfigFunction.changeGridPosition(top, left, right, bottom)
              // 3. 设置图例配置到图表,还包含了缩放组件的布局位置
              let option = {
                legend: {
                  orient:
                    chartConfigControl.legendPosition == 'leftCenter' ||
                    chartConfigControl.legendPosition == 'rightCenter'
                      ? 'vertical'
                      : 'horizontal',
                  top: thisPosition.top,
                  left: thisPosition.left,
                  bottom: thisPosition.bottom,
                },
                dataZoom: [
                  {
                    id: 'x0Slider',
                    top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                  },
                  {
                    id: 'y0Slider',
                    left: 101 - chartConfigControl.currentGridPosition.right + '%',
                  },
                ],
              }
              chartConfig.setOption(option)
            }
          "
        >
          <a-radio-button class="btn top left" value="topLeft">
            <TopLeft />
          </a-radio-button>
          <a-radio-button class="btn top center" value="topCenter">
            <TopCenter />
          </a-radio-button>
          <a-radio-button class="btn top right" value="topRight">
            <TopRight />
          </a-radio-button>
          <a-radio-button class="btn middle left" value="leftCenter">
            <LeftCenter />
          </a-radio-button>
          <a-radio-button class="btn middle center" disabled>
            <Position />
          </a-radio-button>
          <a-radio-button class="btn middle right" value="rightCenter">
            <RightCenter />
          </a-radio-button>
          <a-radio-button class="btn bottom left" value="bottomLeft">
            <BottomLeft />
          </a-radio-button>
          <a-radio-button class="btn bottom center" value="bottomCenter">
            <BottomCenter />
          </a-radio-button>
          <a-radio-button class="btn bottom right" value="bottomRight">
            <BottomRight />
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
  </div>

  <!--x轴配置-->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.xAxisActiveKey"
      expand-icon-position="end"
      :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
        key="1"
        header="X轴"
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <!--名称开关-->
        <div class="chart-item">
          <span class="label-left" style="width: 24px">名称</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartConfigControl.xAxisNameShow"
              @change="
                () => {
                  // 1. 计算该组件所需grid让出的空间
                  let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
                    chartConfigControl.currentXAxisNamePosition,
                    chartConfigControl.xAxisNameShow,
                  )
                  // 2. 调整grid
                  chartConfigFunction.changeGridPosition(top, left, right, bottom)

                  if (!chartConfigControl.xAxisNameShow) {
                    chartOption.xAxis.name = undefined
                  } else {
                    if (chartOption.xAxis.name == undefined) {
                      chartOption.xAxis.name = chartOption.dataset.dimensions[0]
                    }
                  }

                  // 3. 设置x轴名称配置，同时调整缩略组件的布局
                  let option = {
                    xAxis: {
                      name: chartOption.xAxis.name,
                      nameLocation: chartOption.xAxis.nameLocation,
                    },
                    dataZoom: [
                      {
                        id: 'x0Slider',
                        top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                      },
                      {
                        id: 'y0Slider',
                        left: 101 - chartConfigControl.currentGridPosition.right + '%',
                      },
                    ],
                  }

                  chartConfig.setOption(option)
                }
              "
            ></a-switch>
          </div>
        </div>
        <!--名称输入内容-->
        <div class="chart-item">
          <span class="label-left"></span>
          <div class="component-right">
            <a-input
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              allow-clear
              :disabled="!chartConfigControl.xAxisNameShow"
              v-model:value="chartOption.xAxis.name"
              @change="chartConfig.setOption({ xAxis: { name: chartOption.xAxis.name } })"
            ></a-input>
          </div>
        </div>
        <!--名称位置-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">名称位置</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              :disabled="!chartConfigControl.xAxisNameShow"
              v-model:value="chartOption.xAxis.nameLocation"
              @change="
                () => {
                  let changeStatus = chartOption.xAxis.nameLocation

                  if (chartOption.xAxis.nameLocation == 'center') {
                    if (chartOption.xAxis.position == 'top') {
                      changeStatus = 'topCenter'
                    } else {
                      changeStatus = 'bottomCenter'
                    }
                  }
                  // 1. 计算名称不同位置时所需的grid空间
                  let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                    chartConfigControl.currentXAxisNamePosition,
                    changeStatus,
                  )
                  // 2. 调整grid空间
                  chartConfigFunction.changeGridPosition(top, left, right, bottom)

                  chartConfig.setOption({
                    xAxis: { nameLocation: chartOption.xAxis.nameLocation },
                    dataZoom: [
                      {
                        id: 'x0Slider',
                        top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                      },
                      {
                        id: 'y0Slider',
                        left: 101 - chartConfigControl.currentGridPosition.right + '%',
                      },
                    ],
                  })
                }
              "
            >
              <a-radio-button value="start"
                ><span style="font-size: 12px">左边</span></a-radio-button
              >
              <a-radio-button value="center"
                ><span style="font-size: 12px">中间</span></a-radio-button
              >
              <a-radio-button value="end"><span style="font-size: 12px">右边</span></a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <!--离坐标轴的距离-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">离坐标轴</span>
          <div class="component-right">
            <a-input-number
              size="small"
              min="8"
              :style="{ width: '100%', fontSize: '12px' }"
              :disabled="!chartConfigControl.xAxisNameShow"
              v-model:value="chartOption.xAxis.nameGap"
              addon-after="px"
              @change="chartConfig.setOption({ xAxis: { nameGap: chartOption.xAxis.nameGap } })"
            >
            </a-input-number>
          </div>
        </div>
        <!--坐标轴位置-->
        <div class="chart-item" style="margin-top: 2px">
          <span class="label-left" style="width: 60px">坐标轴位置</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              v-model:value="chartOption.xAxis.position"
              @change="
                () => {
                  if (chartConfigControl.xAxisNameShow) {
                    let changeStatus = chartOption.xAxis.nameLocation

                    if (chartOption.xAxis.nameLocation == 'center') {
                      if (chartOption.xAxis.position == 'top') {
                        changeStatus = 'topCenter'
                      } else {
                        changeStatus = 'bottomCenter'
                      }
                    }

                    // 1. 计算不同坐标轴位置在图标上的所需空间
                    let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                      chartConfigControl.currentXAxisNamePosition,
                      changeStatus,
                    )
                    // 2. 调整grid空间
                    chartConfigFunction.changeGridPosition(top, left, right, bottom)

                    let option = {
                      xAxis: { position: chartOption.xAxis.position },
                      dataZoom: [
                        {
                          id: 'x0Slider',
                          top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                        },
                        {
                          id: 'y0Slider',
                          left: 101 - chartConfigControl.currentGridPosition.right + '%',
                        },
                      ],
                    }
                    chartConfig.setOption(option)
                    } else {
                      let option = {
                      xAxis: { position: chartOption.xAxis.position },
                      }
                      chartConfig.setOption(option);
                  }
                }
              "
            >
              <a-radio-button value="top"><span style="font-size: 12px">顶部</span></a-radio-button>
              <a-radio-button value="bottom"
                ><span style="font-size: 12px">底部</span></a-radio-button
              >
            </a-radio-group>
          </div>
        </div>
        <!--标签开关-->
        <div class="chart-item" style="margin-top: 12px; border-top: 1px solid #e8e8e8">
          <span class="label-left" style="width: 60px">标签</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartOption.xAxis.axisLabel.show"
              @change="
                chartConfig.setOption({
                  xAxis: { axisLabel: { show: chartOption.xAxis.axisLabel.show } },
                })
              "
            ></a-switch>
          </div>
        </div>
        <!--标签角度-->
        <div class="chart-item">
          <span class="label-left" style="width: 60px">角度</span>
          <div class="component-right">
            <a-slider
              v-model:value="chartOption.xAxis.axisLabel.rotate"
              :min="-90"
              :max="90"
              :style="{ width: '100%' }"
              :dots="true"
              :step="15"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { rotate: chartOption.xAxis.axisLabel.rotate },
                  },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
            ></a-slider>
          </div>
        </div>
        <!--标签离坐标轴的距离-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">离坐标轴</span>
          <div class="component-right">
            <a-input-number
              size="small"
              min="8"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.xAxis.axisLabel.margin"
              addon-after="px"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { margin: chartOption.xAxis.axisLabel.margin },
                  },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
            >
            </a-input-number>
          </div>
        </div>
        <!--标签最大长度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">最大长度</span>
          <div class="component-right">
            <a-input-number
              size="small"
              min="48"
              max="200"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.xAxis.axisLabel.width"
              addon-after="px"
              @change="
                chartConfig.setOption({
                  xAxis: { axisLabel: { width: chartOption.xAxis.axisLabel.width } },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
            >
            </a-input-number>
          </div>
        </div>
        <!--标签超过长度时的溢出处理 截断或者换行-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">超长后</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              v-model:value="chartOption.xAxis.axisLabel.overflow"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { overflow: chartOption.xAxis.axisLabel.overflow },
                  },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
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
        <!--标签接端：截断后呈现什么值-->
        <div class="chart-item" v-show="chartOption.xAxis.axisLabel.overflow == 'truncate'">
          <span class="label-left" style="width: 60px">截断提示</span>
          <div class="component-right">
            <a-input
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              v-model:value="chartOption.xAxis.axisLabel.ellipsis"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { ellipsis: chartOption.xAxis.axisLabel.ellipsis },
                  },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
            >
            </a-input>
          </div>
        </div>

        <!--标签显示配置：自动显示还是间隔多少个显示-->
        <div class="chart-item">
          <div style="display: flex; justify-content: flex-start; align-items: center">
            <a-checkbox
              :disabled="!chartOption.xAxis.axisLabel.show"
              v-model:checked="chartConfigControl.xAxisIntervalChecked"
              @change="
                () => {
                  if (chartConfigControl.xAxisIntervalChecked) {
                    chartOption.xAxis.axisLabel.interval = 0
                    chartConfig.setOption({
                      xAxis: {
                        axisLabel: { interval: 0 },
                      },
                    })
                  } else {
                    chartConfig.setOption({
                      xAxis: {
                        axisLabel: { interval: 'auto' },
                      },
                    })
                  }
                }
              "
            >
            </a-checkbox>
            <span class="label-normal" style="margin-left: 8px">间隔</span>
          </div>

          <div class="component-right">
            <a-input-number
              size="small"
              min="0"
              max="5"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.xAxis.axisLabel.interval"
              addon-after="个标签"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { interval: chartOption.xAxis.axisLabel.interval },
                  },
                })
              "
              :disabled="
                !chartOption.xAxis.axisLabel.show || !chartConfigControl.xAxisIntervalChecked
              "
            ></a-input-number>
          </div>
        </div>

        <!--标签对齐刻度线-->
        <div class="chart-item">
          <span class="label-left" style="width: 60px">对齐刻度线</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              v-model:value="chartOption.xAxis.axisTick.alignWithLabel"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    axisTick: {
                      alignWithLabel: chartOption.xAxis.axisTick.alignWithLabel,
                    },
                  },
                })
              "
              :disabled="!chartOption.xAxis.axisLabel.show"
            >
              <a-radio :value="true"><span style="font-size: 12px">是</span></a-radio>
              <a-radio :value="false"><span style="font-size: 12px">否</span></a-radio>
            </a-radio-group>
          </div>
        </div>
        <!--x轴的分割线开关-->
        <div class="chart-item" style="margin-top: 12px; border-top: 1px solid #e8e8e8">
          <span class="label-left" style="width: 60px">分割线</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartOption.xAxis.splitLine.show"
              @change="
                chartConfig.setOption({
                  xAxis: { splitLine: { show: chartOption.xAxis.splitLine.show } },
                })
              "
            ></a-switch>
          </div>
        </div>
        <!--x轴的分割线类型 以及 分割线粗细-->
        <div class="chart-item">
          <a-select
            size="small"
            v-model:value="chartOption.xAxis.splitLine.lineStyle.type"
            @change="
              chartConfig.setOption({
                xAxis: {
                  splitLine: {
                    lineStyle: { type: chartOption.xAxis.splitLine.lineStyle.type },
                  },
                },
              })
            "
            :disabled="!chartOption.xAxis.splitLine.show"
          >
            <a-select-option value="solid"
              ><span style="font-size: 12px">实线</span></a-select-option
            >
            <a-select-option value="dashed"
              ><span style="font-size: 12px">虚线</span></a-select-option
            >
            <a-select-option value="dotted"
              ><span style="font-size: 12px">点线</span></a-select-option
            >
          </a-select>

          <div class="component-right">
            <a-input-number
              size="small"
              min="1"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.xAxis.splitLine.lineStyle.width"
              addon-after="px"
              @change="
                chartConfig.setOption({
                  xAxis: {
                    splitLine: {
                      lineStyle: {
                        width: chartOption.xAxis.splitLine.lineStyle.width,
                      },
                    },
                  },
                })
              "
              :disabled="!chartOption.xAxis.splitLine.show"
            ></a-input-number>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <!--y轴配置-->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.yAxisActiveKey"
      expand-icon-position="end"
      :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
        key="1"
        header="Y轴"
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <!--y轴名称开关-->
        <div class="chart-item">
          <span class="label-left" style="width: 24px">名称</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartConfigControl.yAxisNameShow"
              @change="
                () => {
                  // 1. 计算该组件所需grid让出的空间
                  let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
                    chartConfigControl.currentYAxisNamePosition,
                    chartConfigControl.yAxisNameShow,
                  )
                  // 2. 调整grid位置
                  chartConfigFunction.changeGridPosition(top, left, right, bottom)

                  if (!chartConfigControl.yAxisNameShow) {
                    chartOption.yAxis.name = undefined
                  }

                  // 3. 设置y轴名称到图表
                  chartConfig.setOption({
                    yAxis: {
                      name: chartOption.yAxis.name,
                      nameLocation: chartOption.yAxis.nameLocation,
                    },
                    dataZoom: [
                      {
                        id: 'x0Slider',
                        top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                      },
                      {
                        id: 'y0Slider',
                        left: 101 - chartConfigControl.currentGridPosition.right + '%',
                      },
                    ],
                  })
                }
              "
            ></a-switch>
          </div>
        </div>

        <!--y轴名称-->
        <div class="chart-item">
          <span class="label-left"></span>
          <div class="component-right">
            <a-input
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              allow-clear
              :disabled="!chartConfigControl.yAxisNameShow"
              v-model:value="chartOption.yAxis.name"
              @change="chartConfig.setOption({ yAxis: { name: chartOption.yAxis.name } })"
            ></a-input>
          </div>
        </div>

        <!--y轴名称位置-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">名称位置</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              :disabled="!chartConfigControl.yAxisNameShow"
              v-model:value="chartOption.yAxis.nameLocation"
              @change="
                () => {
                  let changeStatus = ''
                  if (chartOption.yAxis.position == 'left') {
                    if (chartOption.yAxis.nameLocation == 'start') {
                      changeStatus = 'leftBottom'
                    } else if (chartOption.yAxis.nameLocation == 'center') {
                      changeStatus = 'leftCenter'
                    } else {
                      changeStatus = 'leftTop'
                    }
                  } else {
                    if (chartOption.yAxis.nameLocation == 'start') {
                      changeStatus = 'rightBottom'
                    } else if (chartOption.yAxis.nameLocation == 'center') {
                      changeStatus = 'rightCenter'
                    } else {
                      changeStatus = 'rightTop'
                    }
                  }

                  // 1.
                  let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                    chartConfigControl.currentYAxisNamePosition,
                    changeStatus,
                  )
                  // 2.
                  chartConfigFunction.changeGridPosition(top, left, right, bottom)
                  // 3.
                  chartConfig.setOption({
                    yAxis: { nameLocation: chartOption.yAxis.nameLocation },
                    dataZoom: [
                      {
                        id: 'x0Slider',
                        top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                      },
                      {
                        id: 'y0Slider',
                        left: 101 - chartConfigControl.currentGridPosition.right + '%',
                      },
                    ],
                  })
                }
              "
            >
              <a-radio-button value="start"><span style="font-size: 12px">下</span></a-radio-button>
              <a-radio-button value="center"
                ><span style="font-size: 12px">中</span></a-radio-button
              >
              <a-radio-button value="end"><span style="font-size: 12px">上</span></a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <!--y轴名称位置-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">离坐标轴</span>

          <div class="component-right">
            <a-input-number
              size="small"
              min="8"
              :style="{ width: '100%', fontSize: '12px' }"
              :disabled="!chartConfigControl.yAxisNameShow"
              v-model:value="chartOption.yAxis.nameGap"
              addon-after="px"
              @change="chartConfig.setOption({ yAxis: { nameGap: chartOption.yAxis.nameGap } })"
            >
            </a-input-number>
          </div>
        </div>
        <!--y轴 坐标轴位置-->
        <div class="chart-item" style="margin-top: 2px">
          <span class="label-left" style="width: 60px">坐标轴位置</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              v-model:value="chartOption.yAxis.position"
              @change="
                () => {
                  let changeStatus = ''
                  if (chartOption.yAxis.position == 'left') {
                    if (chartOption.yAxis.nameLocation == 'start') {
                      changeStatus = 'leftBottom'
                    } else if (chartOption.yAxis.nameLocation == 'center') {
                      changeStatus = 'leftCenter'
                    } else {
                      changeStatus = 'leftTop'
                    }
                  } else {
                    if (chartOption.yAxis.nameLocation == 'start') {
                      changeStatus = 'rightBottom'
                    } else if (chartOption.yAxis.nameLocation == 'center') {
                      changeStatus = 'rightCenter'
                    } else {
                      changeStatus = 'rightTop'
                    }
                  }
                  // 1.
                  let { top, left, right, bottom } = chartConfigFunction.changeComponentPosition(
                    chartConfigControl.currentYAxisNamePosition,
                    changeStatus,
                  )
                  // 2.
                  chartConfigFunction.changeGridPosition(top, left, right, bottom)

                  // 3.
                  chartConfig.setOption({
                    yAxis: { position: chartOption.yAxis.position },
                    dataZoom: [
                      {
                        id: 'x0Slider',
                        top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                      },
                      {
                        id: 'y0Slider',
                        left: 101 - chartConfigControl.currentGridPosition.right + '%',
                      },
                    ],
                  })
                }
              "
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

        <!--y轴 标签-->
        <div class="chart-item" style="margin-top: 12px; border-top: 1px solid #e8e8e8">
          <span class="label-left" style="width: 60px">标签</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartOption.yAxis.axisLabel.show"
              @change="
                chartConfig.setOption({
                  yAxis: { axisLabel: { show: chartOption.yAxis.axisLabel.show } },
                })
              "
            ></a-switch>
          </div>
        </div>
        <!--y轴 标签的角度-->
        <div class="chart-item">
          <span class="label-left" style="width: 60px">角度</span>
          <div class="component-right">
            <a-slider
              v-model:value="chartOption.yAxis.axisLabel.rotate"
              :min="-90"
              :max="90"
              :dots="true"
              :step="15"
              :style="{ width: '100%' }"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    axisLabel: { rotate: chartOption.yAxis.axisLabel.rotate },
                  },
                })
              "
              :disabled="!chartOption.yAxis.axisLabel.show"
            ></a-slider>
          </div>
        </div>
        <!--y轴 标签离坐标轴的距离-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">离坐标轴</span>
          <div class="component-right">
            <a-input-number
              size="small"
              min="8"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.yAxis.axisLabel.margin"
              addon-after="px"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    axisLabel: { margin: chartOption.yAxis.axisLabel.margin },
                  },
                })
              "
              :disabled="!chartOption.yAxis.axisLabel.show"
            >
            </a-input-number>
          </div>
        </div>

        <!--y轴 标签长度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">最大长度</span>
          <div class="component-right">
            <a-tooltip title="最大值200 最小值 48">
              <a-input-number
                size="small"
                min="48"
                max="200"
                :style="{ width: '100%', fontSize: '12px' }"
                v-model:value="chartOption.yAxis.axisLabel.width"
                addon-after="px"
                @change="
                  chartConfig.setOption({
                    yAxis: {
                      axisLabel: { width: chartOption.yAxis.axisLabel.width },
                    },
                  })
                "
                :disabled="!chartOption.yAxis.axisLabel.show"
              >
              </a-input-number>
            </a-tooltip>
          </div>
        </div>

        <!--y轴 标签超过最大长度时，溢出处理-->
        <div class="chart-item">
          <span class="label-left" style="width: 36px">超长后</span>
          <div class="component-right">
            <a-radio-group
              size="small"
              button-style="solid"
              v-model:value="chartOption.yAxis.axisLabel.overflow"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    axisLabel: { overflow: chartOption.yAxis.axisLabel.overflow },
                  },
                })
              "
              :disabled="!chartOption.yAxis.axisLabel.show"
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

        <!--y轴 标签超过最大长度时，截断提示-->
        <div class="chart-item" v-show="chartOption.yAxis.axisLabel.overflow == 'truncate'">
          <span class="label-left" style="width: 60px">截断提示</span>
          <div class="component-right">
            <a-input
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              v-model:value="chartOption.yAxis.axisLabel.ellipsis"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    axisLabel: { ellipsis: chartOption.yAxis.axisLabel.ellipsis },
                  },
                })
              "
              :disabled="!chartOption.yAxis.axisLabel.show"
            >
            </a-input>
          </div>
        </div>

        <!--y轴 标签超过最大长度时，截断提示-->
        <div class="chart-item">
          <div style="display: flex; justify-content: flex-start; align-items: center">
            <a-checkbox
              v-model:checked="chartConfigControl.yAxisIntervalChecked"
              :disabled="!chartOption.yAxis.axisLabel.show"
              @change="
                () => {
                  if (chartConfigControl.yAxisIntervalChecked) {
                    chartOption.yAxis.axisLabel.interval = 0
                    chartConfig.setOption({
                      yAxis: {
                        axisLabel: { interval: 0 },
                      },
                    })
                  } else {
                    chartConfig.setOption({
                      yAxis: {
                        axisLabel: { interval: 'auto' },
                      },
                    })
                  }
                }
              "
            >
            </a-checkbox>
            <span class="label-normal" style="margin-left: 8px; margin-left: 8px">间隔</span>
          </div>

          <div class="component-right">
            <a-input-number
              size="small"
              min="0"
              max="5"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.yAxis.axisLabel.interval"
              addon-after="个标签"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    axisLabel: { interval: chartOption.yAxis.axisLabel.interval },
                  },
                })
              "
              :disabled="
                !chartOption.yAxis.axisLabel.show || !chartConfigControl.yAxisIntervalChecked
              "
            ></a-input-number>
          </div>
        </div>

        <!--y轴 分割线开关-->
        <div class="chart-item" style="margin-top: 12px; border-top: 1px solid #e8e8e8">
          <span class="label-left" style="width: 60px">分割线</span>
          <div class="component-right">
            <a-switch
              size="small"
              v-model:checked="chartOption.yAxis.splitLine.show"
              @change="
                chartConfig.setOption({
                  yAxis: { splitLine: { show: chartOption.yAxis.splitLine.show } },
                })
              "
            ></a-switch>
          </div>
        </div>

        <!--y轴 分割线类型、以及分割线宽度-->
        <div class="chart-item">
          <a-select
            size="small"
            v-model:value="chartOption.yAxis.splitLine.lineStyle.type"
            @change="
              chartConfig.setOption({
                yAxis: {
                  splitLine: {
                    lineStyle: { type: chartOption.yAxis.splitLine.lineStyle.type },
                  },
                },
              })
            "
            :disabled="!chartOption.yAxis.splitLine.show"
          >
            <a-select-option value="solid"
              ><span style="font-size: 12px">实线</span></a-select-option
            >
            <a-select-option value="dashed"
              ><span style="font-size: 12px">虚线</span></a-select-option
            >
            <a-select-option value="dotted"
              ><span style="font-size: 12px">点线</span></a-select-option
            >
          </a-select>

          <div class="component-right">
            <a-input-number
              size="small"
              min="1"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.yAxis.splitLine.lineStyle.width"
              addon-after="px"
              @change="
                chartConfig.setOption({
                  yAxis: {
                    splitLine: {
                      lineStyle: {
                        width: chartOption.yAxis.splitLine.lineStyle.width,
                      },
                    },
                  },
                })
              "
              :disabled="!chartOption.yAxis.splitLine.show"
            ></a-input-number>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <!--数据系列-->
  <div class="chart-group">
    <!--数据系列配置一致-->
    <div class="chart-item" style="margin-bottom: 8px">
      <span class="label-left" style="width: 48px">数据系列</span>
      <div class="component-right">
        <a-checkbox
          v-model:checked="chartConfigControl.allSeriesEqual"
          @change="
            () => {
                chartConfigControl.allSeriesConfigShow.length = 0;
                chartConfigControl.allSeriesConfigShow[0] = chartOption.series[0].id||'0'
              if (chartConfigControl.allSeriesEqual) {

              } else {
                chartConfigControl.allSeriesConfigShow = []
              }
            }
          "
          ><span style="font-size: 12px">各系列一致</span>
        </a-checkbox>
      </div>
    </div>

    <a-collapse
      v-model:activeKey="chartConfigControl.allSeriesConfigShow"
      expand-icon-position="end"
      :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
        :style="{ border: 'none', marginTop: '8px', padding: '0', fontSize: '12px' }"
        v-for="(item, index) in chartOption.series"
        :key="item.id || index"
      >
        <template #header>
          <div :style="{ display: 'flex', justifyContent: 'space-between' }">
            <span>
              {{ item.name }}
            </span>
            <span v-if="item.type == 'bar'">
              <BarChartOutlined :style="{ color: chartConfigFunction.getColor(index) }" />
            </span>
            <span v-else-if="item.type == 'line'">
              <LineChartOutlined :style="{ color: chartConfigFunction.getColor(index) }" />
            </span>
          </div>
        </template>

        <!--系列名称-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">系列名称</span>

          <div class="component-right">
            <a-input
              v-model:value="item.name"
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              @change="
                () => {
                  chartConfig.setOption({ series: [{ id: item.id, name: item.name }] })
                }
              "
            >
            </a-input>
          </div>
        </div>

        <!--系列类型-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">系列类型</span>

          <div class="component-right">
            <a-select
              v-model:value="item.type"
              size="small"
              @change="
                (value: string) => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllSeriesType(value)
                  } else {
                    let option:{
                      series: {
                        id: string,
                        type: string,
                        barMaxWidth?:string
                        barMinWidth?:string }
                        } = { series: { id: item.id, type: value } }
                    if(value =='bar'){
                      option.series.barMaxWidth = '50'
                      option.series.barMinWidth = '1'
                    }
                    chartConfig.setOption(option);
                  }
                }
              "
            >
              <a-select-option value="bar">
                <span class="label-normal">柱状图</span>
              </a-select-option>
              <a-select-option value="line">
                <span class="label-normal">折线图</span>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!--数据的标签显示开关，以及显示位置-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">数据标签</span>

          <div class="component-right">
            <a-checkbox
              v-model:checked="chartConfigControl.seriesLabelShow[item.id]"
              @change="
                () => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changAllSeriesLabelControl(item)
                  } else {
                    chartConfigFunction.seriesLabelControl(item)
                  }
                }
              "
            >
              <span class="label-normal">显示</span>
            </a-checkbox>

            <a-select
              v-model:value="item.label.position"
              size="small"
              @change="
                () => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllLabelPosition(item)
                  } else {
                    chartConfig.setOption({
                      series: [{ id: item.id, label: { position: item.label.position } }],
                    })
                  }
                }
              "
              :disabled="
                chartConfigControl.seriesLabelShow[item.id] == null ||
                chartConfigControl.seriesLabelShow[item.id] == ''
              "
            >
              <a-select-option value="top"><span class="label-normal">顶部</span></a-select-option>
              <a-select-option value="inside"
                ><span class="label-normal">内中</span></a-select-option
              >
              <a-select-option value="insideBottom"
                ><span class="label-normal">内下</span></a-select-option
              >
              <a-select-option value="insideTop"
                ><span class="label-normal">内上</span></a-select-option
              >
            </a-select>
          </div>
        </div>

        <!--标签的旋转角度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">角度</span>

          <div class="component-right">
            <a-slider
              v-model:value="item.label.rotate"
              :min="-90"
              :max="90"
              :dots="true"
              :step="15"
              :style="{ width: '100%' }"
              @change="
                () => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllRotate(item)
                  } else {
                    chartConfig.setOption({
                      series: { id: item.id, label: { rotate: item.label.rotate } },
                    })
                  }
                }
              "
              :disabled="
                chartConfigControl.seriesLabelShow[item.id] == null ||
                chartConfigControl.seriesLabelShow[item.id] == ''
              "
            >
            </a-slider>
          </div>
        </div>

        <!--系列的高亮状态-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">高亮状态</span>

          <div class="component-right">
            <a-radio-group
              v-model:value="item.emphasis.focus"
              size="small"
              @change="
                () => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllSeriesEmphasis(item)
                  } else {
                    chartConfig.setOption({
                      series: { id: item.id, emphasis: { focus: item.emphasis.focus } },
                    })
                  }
                }
              "
            >
              <a-radio-button value="none"><span class="label-normal">无</span></a-radio-button>
              <a-radio-button value="series"><span class="label-normal">系列</span></a-radio-button>
              <a-radio-button value="self"><span class="label-normal">自身</span></a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <!--  条形图-->
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left" style="width: 48px">条形图</span>
      <div class="component-right">
        <a-checkbox
          v-model:checked="chartConfigControl.vertical"
          value="vertical"
          @change="
            () => {
              if (chartConfigControl.vertical) {
                chartOption.xAxis.type = 'value'
                chartOption.yAxis.type = 'category'
                chartConfig.setOption({
                  xAxis: { type: 'value', axisLabel: chartOption.xAxis.axisLabel },
                  yAxis: { type: 'category', axisLabel: chartOption.yAxis.axisLabel },
                })

                // 重新设置下截断和换行
                chartConfig.setOption({
                  xAxis: {
                    axisLabel: { overflow: chartOption.xAxis.axisLabel.overflow },
                  },
                })
              } else {
                chartOption.xAxis.type = 'category'
                chartOption.yAxis.type = 'value'
                chartConfig.setOption({
                  xAxis: { type: 'category', axisLabel: chartOption.xAxis.axisLabel },
                  yAxis: { type: 'value', axisLabel: chartOption.yAxis.axisLabel },
                })
              }
            }
          "
          ><span class="label-normal">切换</span></a-checkbox
        >
      </div>
    </div>
  </div>
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left" style="width: 48px">缩放组件</span>
      <div class="component-right">
        <a-checkbox-group v-model:value="chartConfigControl.zoomShow">
          <a-checkbox
            value="x"
            @change="
              (v: any) => {
                chartConfigControl.xZoomShow = v.target.checked
              }
            "
            ><span class="label-normal">横向</span></a-checkbox
          >
          <a-checkbox
            value="y"
            @change="
              (v: any) => {
                chartConfigControl.yZoomShow = v.target.checked
              }
            "
            ><span class="label-normal">纵向</span></a-checkbox
          >
        </a-checkbox-group>
      </div>
    </div>

    <div class="chart-item" v-show="chartConfigControl.xZoomShow">
      <span class="label-left" style="width: 48px">横向</span>
      <div class="component-right">
        <a-checkbox-group v-model:value="chartConfigControl.xZoom">
          <a-checkbox
            value="inside"
            @change="
              (v: any) => {
                let x0InsideDisabled = !v.target.checked

                let option = [
                  {
                    id: 'x0Inside',
                    disabled: x0InsideDisabled,
                  },
                ]
                for (let i = 0; i < chartOption.dataZoom.length; i++) {
                  if (chartOption.dataZoom[i].id == 'x0Inside') {
                    chartOption.dataZoom[i].disabled = x0InsideDisabled
                    break
                  }
                }
                chartConfig.setOption({ dataZoom: option })
              }
            "
            ><span class="label-normal">内置</span></a-checkbox
          >
          <a-checkbox
            value="slider"
            @change="
              (v: any) => {
                let x0SliderShow = v.target.checked

                // 1.
                let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
                  chartConfigControl.currentXZoomPosition,
                  x0SliderShow,
                )

                //2.
                chartConfigFunction.changeGridPosition(top, left, right, bottom)

                let option = [
                  {
                    id: 'x0Slider',
                    show: x0SliderShow,
                    top: 101 - chartConfigControl.currentGridPosition.bottom + '%',
                  },
                ]

                for (let i = 0; i < chartOption.dataZoom.length; i++) {
                  if (chartOption.dataZoom[i].id == 'x0Slider') {
                    chartOption.dataZoom[i].show = x0SliderShow
                    break
                  }
                }
                //3.
                chartConfig.setOption({ dataZoom: option })
              }
            "
            ><span class="label-normal">滑块</span></a-checkbox
          >
        </a-checkbox-group>
      </div>
    </div>

    <div class="chart-item" v-show="chartConfigControl.xZoomShow">
      <span class="label-left" style="width: 48px">范围</span>
      <div class="component-right">
        <a-slider
          v-model:value="chartConfigControl.xZoomRange"
          range
          :style="{ width: '100%' }"
          :dots="true"
          :step="5"
          @change="
            () => {
              let option = {
                id: 'x0Inside',
                start: chartConfigControl.xZoomRange[0],
                end: chartConfigControl.xZoomRange[1],
              }
              chartConfig.setOption({ dataZoom: option })

              for (let i = 0; i < chartOption.dataZoom.length; i++) {
                if (chartOption.dataZoom[i].id == 'x0Inside') {
                  chartOption.dataZoom[i].start = chartConfigControl.xZoomRange[0]
                  chartOption.dataZoom[i].end = chartConfigControl.xZoomRange[1]
                  break
                }
              }
            }
          "
        ></a-slider>
      </div>
    </div>

    <div class="chart-item" v-show="chartConfigControl.yZoomShow">
      <span class="label-left" style="width: 48px">纵向</span>
      <div class="component-right">
        <a-checkbox-group v-model:value="chartConfigControl.yZoom">
          <a-checkbox
            value="inside"
            @change="
              (v: any) => {
                let y0InsideDisabled = !v.target.checked
                let option = [
                  {
                    id: 'y0Inside',
                    disabled: y0InsideDisabled,
                  },
                ]
                chartConfig.setOption({ dataZoom: option })
                for (let i = 0; i < chartOption.dataZoom.length; i++) {
                  if (chartOption.dataZoom[i].id == 'y0Inside') {
                    chartOption.dataZoom[i].disabled = y0InsideDisabled
                    break
                  }
                }
              }
            "
            ><span class="label-normal">内置</span></a-checkbox
          >
          <a-checkbox
            value="slider"
            @change="
              (v: any) => {
                let y0SliderShow = v.target.checked
                let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
                  chartConfigControl.currentYZoomPosition,
                  y0SliderShow,
                )
                chartConfigFunction.changeGridPosition(top, left, right, bottom)

                let option = [
                  {
                    id: 'y0Slider',
                    show: y0SliderShow,
                    left: 101 - chartConfigControl.currentGridPosition.right + '%',
                  },
                ]

                chartConfig.setOption({ dataZoom: option })

                for (let i = 0; i < chartOption.dataZoom.length; i++) {
                  if (chartOption.dataZoom[i].id == 'y0Slider') {
                    chartOption.dataZoom[i].show = y0SliderShow
                    break
                  }
                }
              }
            "
            ><span class="label-normal">滑块</span></a-checkbox
          >
        </a-checkbox-group>
      </div>
    </div>

    <div class="chart-item" v-show="chartConfigControl.yZoomShow">
      <span class="label-left" style="width: 48px">范围</span>
      <div class="component-right">
        <a-slider
          v-model:value="chartConfigControl.yZoomRange"
          range
          :style="{ width: '100%' }"
          :dots="true"
          :step="5"
          @change="
            () => {
              let option = {
                id: 'y0Inside',
                start: chartConfigControl.yZoomRange[0],
                end: chartConfigControl.yZoomRange[1],
              }
              chartConfig.setOption({ dataZoom: option })

              for (let i = 0; i < chartOption.dataZoom.length; i++) {
                if (chartOption.dataZoom[i].id == 'y0Inside') {
                  chartOption.dataZoom[i].start = chartConfigControl.yZoomRange[0]
                  chartOption.dataZoom[i].end = chartConfigControl.yZoomRange[1]
                  break
                }
              }
            }
          "
        ></a-slider>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>