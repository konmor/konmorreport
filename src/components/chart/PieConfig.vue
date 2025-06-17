<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, watch } from 'vue'
import { themArray } from '@/echartsThem/registerThem.ts'
import * as echarts from 'echarts'
import Center from '@/assets/icon/Center.vue'
import Left from '@/assets/icon/Left.vue'
import Right from '@/assets/icon/Right.vue'
import RightCenter from '@/assets/icon/legend/RightCenter.vue'
import Position from '@/assets/icon/legend/Position.vue'
import TopCenter from '@/assets/icon/legend/TopCenter.vue'
import TopLeft from '@/assets/icon/legend/TopLeft.vue'
import TopRight from '@/assets/icon/legend/TopRight.vue'
import BottomCenter from '@/assets/icon/legend/BottomCenter.vue'
import LeftCenter from '@/assets/icon/legend/LeftCenter.vue'
import BottomLeft from '@/assets/icon/legend/BottomLeft.vue'
import BottomRight from '@/assets/icon/legend/BottomRight.vue'
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons-vue'

interface GridPosition {
  [key: string]: { top: number; left: number; right: number; bottom: number }
}

// 特之配置组件 如 主题、堆叠 等配置
interface ComponentPosition {
  currentStatus: string
  position: { top: number; left: number; right: number; bottom: number } | undefined
  allStatus: GridPosition
}

let { getChartConfig, setChartConfig, chartOption, chartContainer, clearCurrentConfig } =
  defineProps([
    'getChartConfig',
    'setChartConfig',
    'chartOption',
    'chartContainer',
    'clearCurrentConfig',
  ])
let chartConfig: any

const chartConfigConstParams = {
  titleGridPosition: {
    left: { top: 2.5, left: 0, right: 0, bottom: 0 },
    right: { top: 2.5, left: 0, right: 0, bottom: 0 },
    center: { top: 2.5, left: 0, right: 0, bottom: 0 },
  } as GridPosition,
  legendGridPosition: {
    topLeft: { top: 2.5, left: 0, right: 0, bottom: 0 },
    topCenter: { top: 2.5, left: 0, right: 0, bottom: 0 },
    topRight: { top: 2.5, left: 0, right: 0, bottom: 0 },
    leftCenter: { top: 0, left: 5, right: 0, bottom: 0 },
    rightCenter: { top: 0, left: 0, right: 5, bottom: 0 },
    bottomLeft: { top: 0, left: 0, right: 0, bottom: 3.5 },
    bottomRight: { top: 0, left: 0, right: 0, bottom: 3.5 },
    bottomCenter: { top: 0, left: 0, right: 0, bottom: 3.5 },
  } as GridPosition,
}

let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  currentThem: 'customized', // 当前主题
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色

  legendPosition: 'topCenter', // 图例的位置

  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容

  seriesEndAngleShow: { '1': false } as Record<string, boolean>,

  roseType: false as string | boolean,
  roseTypeCheckBoxGroup: [] as Array<string>,
  roseTypeArea: false,

  // label 要显示的内容
  labelContent: [] as string[],
  radius: [0, 80] as Array<number>,

  emphasisShow:true,

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
  currentGridPosition: { top: 3, left: 0, right: 0, bottom: 0 },
})
const chartConfigFunction = {
  changeThem: (themName: string) => {
    if (chartConfig == null) {
      chartConfig = getChartConfig()
    }
    // let crtOption = chartConfig.getOption();
    chartConfig.dispose()
    // 赋新值
    chartConfig = echarts.init(chartContainer, themName) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    chartConfig.setOption(chartOption)

    setChartConfig(chartConfig) // 传递给父级
    chartConfigControl.currentThem = themName // 当前主题
  },
  openAndCloseComponent: (currentComponentPosition: ComponentPosition, show: boolean) => {
    let top = 0
    let left = 0
    let right = 0
    let bottom = 0
    let currentStatus = currentComponentPosition.currentStatus
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
    return { top, left, right, bottom }
  },
  changeGridPosition: (top: number, left: number, right: number, bottom: number) => {
    chartConfigControl.currentGridPosition.top += top
    chartConfigControl.currentGridPosition.left += left
    chartConfigControl.currentGridPosition.right += right
    chartConfigControl.currentGridPosition.bottom += bottom
  },
  changeComponentPosition: (crtPosition: ComponentPosition, changeStatus: string) => {
    let top = 0,
      left = 0,
      right = 0,
      bottom = 0
    let currentStatus = crtPosition.currentStatus
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

    crtPosition.currentStatus = changeStatus
    return { top, left, right, bottom }
  },
  titleSwitchChange: () => {
    // 设置选项
    let option = { title: { show: chartOption.title.show }, legend: { top: '3%' } }

    if (
      !chartOption.title.show &&
      chartOption.legend.show &&
      chartConfigControl.legendPosition.startsWith('top')
    ) {
      option.legend.top = '0.5%'
    }
    chartConfig.setOption(option)

    // grid 布局
    let { top, left, right, bottom } = chartConfigFunction.openAndCloseComponent(
      chartConfigControl.currentTitlePosition,
      chartOption.title.show,
    )

    chartConfigFunction.changeGridPosition(top, left, right, bottom)
  },

  labelFormatter: (item: any) => {
    let formatter: string | undefined = undefined

    let nameField = chartOption.dataset.dimensions[0]
    let valueField = chartOption.dataset.dimensions[1]

    if (chartConfigControl.labelContent.length == 1) {
      if (chartConfigControl.labelContent[0] == 'value') {
        // '{@product}, {@2015} : {d}%',
        formatter = `{@${nameField}}, {@${valueField}}`
      } else {
        formatter = `{@${nameField}}: {d}%`
      }
    } else if (chartConfigControl.labelContent.length == 2) {
      formatter = `{@${nameField}}, {@${valueField}} : {d}%`
    }

    chartConfig.setOption({
      series: { id: item.id, label: { formatter: formatter } },
    })
  },
}

const chartConfigStyle = reactive({})

//
// grid的变化
watch(chartConfigControl.currentGridPosition, (grid) => {
  chartConfig.setOption({
    series: {
      id: '1',
      top: grid.top + '%',
      left: grid.left + '%',
      right: grid.right + '%',
      bottom: grid.bottom + '%',
    },
  })
})

onMounted(() => {
  // 初始化
  // chartConfigFunction.initStackItems();

  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(() => {
    // 初始化堆叠配置
    chartConfig = getChartConfig()
  })
})

onUnmounted(() => {
  clearCurrentConfig()
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
              let option: {
                legend: {
                  show?: boolean
                  top?: string
                }
              } = {
                legend: {
                  show: chartOption.legend.show,
                },
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

  <!--  提示-->
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left" style="width: 24px">提示</span>
      <div class="component-right">
        <a-checkbox
          v-model:checked="chartOption.tooltip.show"
          @change="
            () => {
              chartConfig.setOption({
                tooltip: {
                  show: chartOption.tooltip.show,
                },
              })
            }
          "
        >
        </a-checkbox>
      </div>
    </div>
  </div>

<!--  数据系列-->
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left" style="width: 48px">数据系列</span>
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
            <PieChartOutlined />
          </div>
        </template>

        <!--        系列名称-->
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

        <!-- 是否顺时针排布饼图-->
        <div class="chart-item">
          <a-tooltip title="饼图按照顺时针方向排布">
            <span class="label-left" style="width: 48px">顺时针</span>
          </a-tooltip>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.clockwise"
              @change="
                chartConfig.setOption({ series: [{ id: item.id, clockwise: item.clockwise }] })
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!--角度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">起始角度</span>
          <div class="component-right">
            <a-slider
              v-model:value="item.startAngle"
              :min="0"
              :max="360"
              :dots="true"
              :step="10"
              :style="{ width: '100%' }"
              @change="
                () => {
                  chartConfig.setOption({
                    series: { id: item.id, startAngle: item.startAngle },
                  })
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!--终止角度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">终止角度</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="chartConfigControl.seriesEndAngleShow[item.id]"
              @change="
                (v: any) => {
                  if (v.target.checked) {
                    item.endAngle = 270
                    chartConfig.setOption({
                      series: { id: item.id, endAngle: item.endAngle },
                    })
                  }else{
                    item.endAngle='auto';
                    chartConfig.setOption({
                      series: { id: item.id, endAngle: item.endAngle },
                    })
                  }
                }
              "
            >
            </a-checkbox>

            <a-slider
              v-model:value="item.endAngle"
              :min="0"
              :max="360"
              :dots="true"
              :step="10"
              :style="{ width: '100%' }"
              @change="
                () => {
                  chartConfig.setOption({
                    series: { id: item.id, endAngle: item.endAngle },
                  })
                }
              "
              :disabled="!chartConfigControl.seriesEndAngleShow[item.id]"
            >
            </a-slider>
          </div>
        </div>

        <!--  padAngle-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">间隔大小</span>
          <div class="component-right">
            <a-slider
              v-model:value="item.padAngle"
              :min="0"
              :max="10"
              :dots="true"
              :step="0.5"
              :style="{ width: '100%' }"
              @change="
                () => {
                  chartConfig.setOption({
                    series: { id: item.id, padAngle: item.padAngle },
                  })
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!--  玫瑰图类型-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">玫瑰图</span>
          <div class="component-right">
            <a-checkbox-group v-model:value="chartConfigControl.roseTypeCheckBoxGroup">
              <a-checkbox
                value="radius"
                @change="
                  (v: any) => {
                    if (v.target.checked) {
                      chartConfigControl.roseType = true

                      item.roseType = chartConfigControl.roseType

                      chartConfig.setOption({
                        series: { id: item.id, roseType: chartConfigControl.roseType },
                      })
                    } else {
                      chartConfigControl.roseType = false

                      chartConfigControl.roseTypeCheckBoxGroup = []

                      item.roseType = chartConfigControl.roseType

                      chartConfig.setOption({
                        series: { id: item.id, roseType: chartConfigControl.roseType },
                      })
                    }
                  }
                "
                ><span class="label-normal">显示</span></a-checkbox
              >
              <a-checkbox
                value="area"
                :disabled="!chartConfigControl.roseType"
                @change="
                  (v: any) => {
                    if (v.target.checked) {
                      chartConfigControl.roseType = 'area'

                      item.roseType = chartConfigControl.roseType

                      chartConfig.setOption({
                        series: { id: item.id, roseType: chartConfigControl.roseType },
                      })
                    } else {
                      chartConfigControl.roseType = true

                      item.roseType = chartConfigControl.roseType

                      chartConfig.setOption({
                        series: { id: item.id, roseType: chartConfigControl.roseType },
                      })
                    }
                  }
                "
                ><span class="label-normal">仅半径</span></a-checkbox
              >
            </a-checkbox-group>
          </div>
        </div>

        <!--  标签-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">标签</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.label.show"
              @change="
                (v: any) => {
                  if (v.target.checked) {
                    chartConfig.setOption({
                      series: {
                        id: item.id,
                        label: {
                          show: true,
                          position: item.position,
                          formatter: item.formatter,
                          rotate: item.rotate,
                        },
                      },
                    })
                  } else {
                    chartConfig.setOption({
                      series: { id: item.id, label: { show: false } },
                    })
                  }
                }
              "
              ><span class="label-normal">显示</span></a-checkbox
            >
          </div>
        </div>

        <!--  标签位置-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">位置</span>
          <div class="component-right">
            <a-select
              size="small"
              v-model:value="item.label.position"
              @change="
                chartConfig.setOption({
                  series: { id: item.id, label: { position: item.label.position } },
                })
              "
              :disabled="!item.label.show"
            >
              <a-select-option value="outside"
                ><span style="font-size: 12px">饼图外</span></a-select-option
              >
              <a-select-option value="inner"
                ><span style="font-size: 12px">扇形图内</span></a-select-option
              >
              <a-select-option value="center"
                ><span style="font-size: 12px">饼图正中</span></a-select-option
              >
            </a-select>
          </div>
        </div>

        <!-- 标签格式化-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">标签格式</span>
          <div class="component-right">
            <a-checkbox-group
            >
              <a-checkbox
                value="value"
                @change="
                  (v:any) => {
                    if(v.target.checked){
                      if(chartConfigControl.labelContent.length>0){
                       chartConfigControl.labelContent = ['value','percent'];
                      }else {
                        chartConfigControl.labelContent = ['value']
                      }
                    } else {
                       if(chartConfigControl.labelContent.length > 1 ){
                         chartConfigControl.labelContent= ['percent'];
                      } else if (chartConfigControl.labelContent.length == 1) {
                         chartConfigControl.labelContent = []
                      }
                    }

                    chartConfigFunction.labelFormatter(item)
                  }
                "
              >
                <span class="label-normal">数值</span>
              </a-checkbox>
              <a-checkbox
                value="percent"
                @change="
                  (v:any) => {
                    if(v.target.checked){
                      if(chartConfigControl.labelContent.length>0){
                       chartConfigControl.labelContent = ['value','percent'];
                      } else {
                        chartConfigControl.labelContent = ['percent']
                      }
                    } else {
                       if(chartConfigControl.labelContent.length > 1 ){
                         chartConfigControl.labelContent= ['value'];
                      } else if (chartConfigControl.labelContent.length == 1) {
                         chartConfigControl.labelContent = []
                      }
                    }
                    chartConfigFunction.labelFormatter(item)
                  }
                "
              >
                <span class="label-normal">百分比</span>
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- 标签排布方式-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">排布方式</span>
          <div class="component-right">
            <a-select
              size="small"
              v-model:value="item.label.rotate"
              @change="
                chartConfig.setOption({
                  series: { id: item.id, label: { rotate: item.label.rotate } },
                })
              "
              :disabled="!item.label.show"
            >
              <a-select-option value="radial"
                ><span style="font-size: 12px">径向排布</span></a-select-option
              >
              <a-select-option value="tangential"
                ><span style="font-size: 12px">切向排布</span></a-select-option
              >
            </a-select>
          </div>
        </div>

        <!-- 引导线-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">引导线</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.labelLine.show"
              :disabled="!item.label.show || item.label.position != 'outside'"
              @change="
                () => {
                  chartConfig.setOption({
                    series: { id: item.id, labelLine: { show: item.labelLine.show } },
                  })
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!-- 标签配置-是否隐藏重叠标签-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">隐藏重叠标签</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.labelLayout.hideOverlap"
              @change="
                () => {
                  chartConfig.setOption({
                    series: {
                      id: item.id,
                      labelLayout: { hideOverlap: item.labelLayout.hideOverlap },
                    },
                  })
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!-- 标签可拖拽-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">标签可拖拽</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.labelLayout.draggable"
              @change="
                () => {
                  chartConfig.setOption({
                    series: { id: item.id, labelLayout: { draggable: item.labelLayout.draggable } },
                  })
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!-- 高亮-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">高亮</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="chartConfigControl.emphasisShow"
              @change="
                () => {
                  item.emphasis.disabled =!chartConfigControl.emphasisShow;
                  chartConfig.setOption({
                    series: { id: item.id, emphasis: { disabled: !chartConfigControl.emphasisShow } },
                  })
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!-- 饼图内径-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">饼图内径</span>
          <div class="component-right">
            <a-slider
              v-model:value="chartConfigControl.radius[0]"
              :min="0"
              :max="100"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                () => {
                  chartConfig.setOption({
                    series: {
                      id: item.id,
                      radius: [
                        chartConfigControl.radius[0] + '%',
                        chartConfigControl.radius[1] + '%',
                      ],
                    },
                  })
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!-- 饼图外径-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">饼图外径</span>
          <div class="component-right">
            <a-slider
              v-model:value="chartConfigControl.radius[1]"
              :min="0"
              :max="100"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                () => {
                  chartConfig.setOption({
                    series: {
                      id: item.id,
                      radius: [
                        chartConfigControl.radius[0] + '%',
                        chartConfigControl.radius[1] + '%',
                      ],
                    },
                  })
                }
              "
            >
            </a-slider>
          </div>
        </div>

      </a-collapse-panel>
    </a-collapse>
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
