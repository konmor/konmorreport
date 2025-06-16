<script setup lang="ts">

import {nextTick, onMounted, onUnmounted, reactive, watch} from "vue";
import {themArray} from "@/echartsThem/registerThem.ts";
import * as echarts from "echarts";
import Center from "@/assets/icon/Center.vue";
import Left from "@/assets/icon/Left.vue";
import Right from "@/assets/icon/Right.vue";
import RightCenter from "@/assets/icon/legend/RightCenter.vue";
import Position from "@/assets/icon/legend/Position.vue";
import TopCenter from "@/assets/icon/legend/TopCenter.vue";
import TopLeft from "@/assets/icon/legend/TopLeft.vue";
import TopRight from "@/assets/icon/legend/TopRight.vue";
import BottomCenter from "@/assets/icon/legend/BottomCenter.vue";
import LeftCenter from "@/assets/icon/legend/LeftCenter.vue";
import BottomLeft from "@/assets/icon/legend/BottomLeft.vue";
import BottomRight from "@/assets/icon/legend/BottomRight.vue";

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
    defineProps(['getChartConfig','setChartConfig', 'chartOption', 'chartContainer','clearCurrentConfig']);
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
    leftCenter: {top: 0, left: 5, right: 0, bottom: 0},
    rightCenter: {top: 0, left: 0, right: 5, bottom: 0},
    bottomLeft: {top: 0, left: 0, right: 0, bottom: 3.5},
    bottomRight: {top: 0, left: 0, right: 0, bottom: 3.5},
    bottomCenter: {top: 0, left: 0, right: 0, bottom: 3.5},
  } as GridPosition,
};


let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  currentThem: 'customized', // 当前主题
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色

  legendPosition: 'topCenter', // 图例的位置

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
  currentGridPosition:
      {top: 3, left: 0, right: 0, bottom: 0},

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
  titleSwitchChange :() => {
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

}

const chartConfigStyle = reactive({

});



//
// grid的变化
watch(chartConfigControl.currentGridPosition, (grid) => {
  chartConfig.setOption({
    series: {
      id:'1',
      top: grid.top + '%',
      left: grid.left + '%',
      right: grid.right + '%',
      bottom: grid.bottom + '%',
    },
  })
})


onMounted(()=>{
  // 初始化
  // chartConfigFunction.initStackItems();

  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(()=>{
    // 初始化堆叠配置
    chartConfig = getChartConfig();
    console.log('chartOption',chartOption);
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
               }
              } = {
                legend: {
                  show: chartOption.legend.show,
                }
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
                }
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