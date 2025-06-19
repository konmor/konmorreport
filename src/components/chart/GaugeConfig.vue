<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { themArray } from '@/echartsThem/registerThem.ts'
import * as echarts from 'echarts'
import Left from '@/assets/icon/Left.vue'
import Center from '@/assets/icon/Center.vue'
import Right from '@/assets/icon/Right.vue'
import { DashboardOutlined } from '@ant-design/icons-vue'
import { gaugeColor } from '@/composable/GuageColor.ts'
import ColorPicker from '@/components/extend/ColorPicker.vue'
import AColorPicker from '@/components/extend/AColorPicker.vue'

let { getChartConfig, setChartConfig, chartOption, chartContainer, clearCurrentConfig } =
  defineProps([
    'getChartConfig',
    'setChartConfig',
    'chartOption',
    'chartContainer',
    'clearCurrentConfig',
  ])

let chartConfig: any

let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  gaugeActiveKey: '', // 展开主题折叠面板
  gaugeRangeKey: '',
  currentThem: 'customized', // 当前主题
  currentGauge: 'default',
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色
  pickColor: [[100, '#5470c6']] as Array<Array<any>>,
  openColorSelector: false,
  // 是否默认主题
  isDefault: true,
  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容
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
  changeGaugeColor: (gaugeName: string) => {
    chartConfigControl.isDefault = 'default' == gaugeName
    chartConfigControl.currentGauge = gaugeName;

    let gaugeColorObj = gaugeColor.find((item) => item.name == gaugeName)
    if (gaugeColorObj) {
      chartConfigControl.pickColor.length = 0;

      let colors = new Array<any>(gaugeColorObj.colors.length)

      for (let i = 0; i < gaugeColorObj.colors.length; i++) {
        colors[i] = new Array(2)
        colors[i] = [gaugeColorObj.range[i], gaugeColorObj.colors[i]]
        chartConfigControl.pickColor[i] = [Math.floor(100 * colors[i][0]), colors[i][1]]
      }
    }
  },
  changeRangeColor: (index: number, type?: 'add' | 'remove', color?: string) => {
    if (index - 1 < 0) {
      let start = chartConfigControl.pickColor[0][0] - 5
      if (start < 0) {
        chartConfigControl.pickColor.splice(0, 0, [0, '#f0f0f0'])
      } else {
        chartConfigControl.pickColor.splice(0, 0, [start, '#f0f0f0'])
      }
    } else {
      let start = chartConfigControl.pickColor[index - 1][0] - 5
      chartConfigControl.pickColor.splice(index, 0, [start, '#f0f0f0'])
    }
  },
  getColor: (index: number) => {
    let i = index % chartConfigControl.currentColors.length
    return chartConfigControl.currentColors[i]
  },
}

// 主题切换
watch(
  () => chartConfigControl.currentThem,
  (them) => {
    chartConfigControl.currentColors = themArray.find((item) => item.themeName == them)!.theme.color
  },
)

watch(chartConfigControl.pickColor, (value) => {
  let afterChange = [[], []] as Array<Array<any>>
  for (let i = 0; i < value.length; i++) {
    let start = parseFloat((value[i][0] / 100).toFixed(2))
    afterChange[i] = [start, value[i][1]]
  }

  chartOption.series.axisLine.lineStyle.color = afterChange

  chartConfig.setOption({
    series: {
      axisLine: {
        lineStyle: {
          color: afterChange,
        },
      },
    },
  })
})

onMounted(() => {
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
      v-model:activeKey="chartConfigControl.gaugeActiveKey"
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
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <template #header>
          <div :style="{ display: 'flex', justifyContent: 'space-between' }">
            <span class="label-normal" style="line-height: 22px">主题</span>

            <a-checkbox
              v-model:checked="chartConfigControl.isDefault"
              @change="
                (v: any) => {
                  if (v.target.checked) {
                    chartConfigFunction.changeGaugeColor('default')
                  }
                }
              "
            >
              <span class="label-normal" style="line-height: 22px">默认</span>
            </a-checkbox>
          </div>
        </template>

        <div
          class="chart-item color-items"
          v-for="(item, index) in gaugeColor"
          :key="index"
          :style="{
            backgroundColor: item.backgroundColor,
            paddingLeft: '6px',
            paddingRight: '6px',
            borderRadius: '3px',
            marginTop: '5px',
            border: '1px solid #eee',
            cursor: 'pointer',
          }"
          @click="chartConfigFunction.changeGaugeColor(item.name)"
        >
          <div
            v-for="(colorItem, colorIndex) in item.colors.length > 7 ? 7 : item.colors.length"
            class="color-item"
            :key="colorIndex"
            :style="{
              backgroundColor: item.colors[colorIndex],
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
          @change="
            (v: any) => {
              chartConfig.setOption({ title: { show: v.target.checked } })
            }
          "
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

  <!-- 仪表分段-->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.gaugeRangeKey"
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
        header="仪表分段"
        :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <div class="chart-item" v-for="(item, index) in chartConfigControl.pickColor">
          <a-color-picker v-model:color="item[1]"></a-color-picker>

          <div class="component-right">
            <a-input-number
              max="100"
              min="0"
              size="small"
              :style="{ width: '100%', fontSize: '12px' }"
              addon-after="%"
              v-model:value="item[0]"
            ></a-input-number>
            <a-button @click="chartConfigFunction.changeRangeColor(index, 'add')">
              <template #icon> add</template>
            </a-button>
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
              chartConfigControl.allSeriesConfigShow.length = 0
              chartConfigControl.allSeriesConfigShow[0] = chartOption.series[0].id || '0'
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
        v-if="chartOption.series.data.length > 0"
        :style="{ border: 'none', marginTop: '8px', padding: '0', fontSize: '12px' }"
        v-for="(item, index) in chartOption.series.data"
        :key="item.id || index"
      >
        <template #header>
          <div :style="{ display: 'flex', justifyContent: 'space-between' }">
            <span>
              {{ item.name }}
            </span>
            <span>
              <DashboardOutlined
                :style="{ color: chartConfigFunction.getColor(index), fontSize: '16px' }"
              />
            </span>
          </div>
        </template>
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
