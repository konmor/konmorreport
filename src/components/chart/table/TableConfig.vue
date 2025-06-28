<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive } from 'vue'
import { DefaultThem, themArray } from '@/echartsThem/registerThem.ts'
import Left from '@/assets/icon/Left.vue'
import Right from '@/assets/icon/Right.vue'
import Center from '@/assets/icon/Center.vue'
import { BarChartOutlined, TableOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import HorizontalBattery from '@/components/chart/table/HorizontalBattery.vue'
import HorizontalProgress from '@/components/chart/table/HorizontalProgress.vue'
import VerticalBattery from '@/components/chart/table/VerticalBattery.vue'
import VerticalProgress from '@/components/chart/table/VerticalProgress.vue'
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
  currentThem: 'customized', // 当前主题
  currentColors: DefaultThem.theme.color, // 当前主题的颜色

  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容

  pureColorChecked: {} as Record<string, boolean>,
  // key 是字段
  // value 1 2 3 4 分别代表 横向进度条 垂直进度条 横向电池条 垂直电池条
  activeKeys: {} as  Record<string, number>,
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
}
const caculatePercent = (value: number, max: number) => {
  let percent = (100 * value) / max
  return Math.round(percent > 100 ? 100 : percent)
}

const witchType = (stages: boolean, linearGradient: boolean) => {
  if (stages) {
    return 'stages'
  }
  if (linearGradient) {
    return 'linear-gradient'
  }
  return null
}

onMounted(() => {
  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(() => {
    // 初始化堆叠配置
    // chartConfig = getChartConfig();
  })
})

onUnmounted(() => {
  clearCurrentConfig()
})
</script>

<template>
  <!--主题 todo 待适配-->
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
        :disabled="true"
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
        <a-switch size="small" v-model:checked="chartOption.title.show"></a-switch>
        <a-radio-group
          v-model:value="chartOption.title.position"
          :disabled="!chartOption.title.show"
          button-style="solid"
          size="small"
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
        ></a-input>
      </div>
    </div>
  </div>

  <!--分页配置-->
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left">分页</span>
      <div class="component-right">
        <a-checkbox v-model:checked="chartOption.page.show">
          <span class="label-normal">开启</span>
        </a-checkbox>
      </div>
    </div>
  </div>

  <!--数据系列-->
  <div class="chart-group">
    <!--数据系列配置一致-->
    <div class="chart-item" style="margin-bottom: 8px">
      <span class="label-left" style="width: 48px">数据系列</span>
      <div class="component-right">

      </div>
    </div>

    <a-collapse
      v-model:activeKey="chartConfigControl.allSeriesConfigShow"
      expand-icon-position="end"
      accordion
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
              {{ item.title }}
            </span>
            <TableOutlined :style="{ fontSize: '16px' }" />
          </div>
        </template>

        <!--系列名称-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">系列名称</span>
          <div class="component-right">
            <a-input
              v-model:value="item.title"
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
            >
            </a-input>
          </div>
        </div>

        <div v-if="item.fieldType2 == 'Number'">
          <!-- 转换 -->
          <div class="chart-item">
            <span class="label-left" style="width: 60px">转换</span>
            <div class="component-right">
              <a-tooltip title="将数据转为为进度'图形'，如cpu使用率:80，最大值为100。进度条展示80%，后续示例图以80%为例">
                <a-checkbox v-model:checked="chartOption.convert[item.dataIndex].showIcon">
                </a-checkbox>
              </a-tooltip>
            </div>
          </div>

          <div v-show="chartOption.convert[item.dataIndex].showIcon">
          <!--  图形-->
          <div class="chart-item">
            <span class="label-left">图形</span>
            <div class="component-right">
              <a-tooltip title="横向进度条">
                <div class="metrics-mini-chart"
                     :style="chartConfigControl.activeKeys[item.dataIndex] == 1 ?{border:'1px solid #000'}:{}"
                     @click="()=>{
                  console.log('item.dataIndex',item.dataIndex);
                  chartConfigControl.activeKeys[item.dataIndex] = 1;
                  chartOption.convert[item.dataIndex].colorDirection='to right'
                  chartOption.convert[item.dataIndex].iconType='progress';
                  chartOption.convert[item.dataIndex].orient='horizontal';
                }">
                  <HorizontalProgress
                    :color="chartOption.convert[item.dataIndex].color"
                    :progress="caculatePercent(80, 100)"
                    :type="
                      witchType(
                        chartOption.convert[item.dataIndex].stages,
                        chartOption.convert[item.dataIndex].linearGradient,
                      )
                    "
                    :colorDirection="'to right'"
                    :borderColor="chartOption.convert[item.dataIndex].borderColor"
                  />
                </div>
              </a-tooltip>
              <a-tooltip title="垂直进度条">
                <div class="metrics-mini-chart"
                     :style="chartConfigControl.activeKeys[item.dataIndex] == 2 ?{border:'1px solid #000'}:{}"
                     @click="()=>{
                  chartConfigControl.activeKeys[item.dataIndex] = 2;
                  chartOption.convert[item.dataIndex].colorDirection='to top'
                  chartOption.convert[item.dataIndex].iconType='progress';
                  chartOption.convert[item.dataIndex].orient='vertical';
                }">
                  <VerticalProgress
                    :color="chartOption.convert[item.dataIndex].color"
                    :progress="caculatePercent(80, 100)"
                    :type="
                      witchType(
                        chartOption.convert[item.dataIndex].stages,
                        chartOption.convert[item.dataIndex].linearGradient,
                      )
                    "
                    :colorDirection="'to top'"
                    :borderColor="chartOption.convert[item.dataIndex].borderColor"
                  />
                </div>
              </a-tooltip>
              <a-tooltip title="水平电池条">
                <div class="metrics-mini-chart"
                     :style="chartConfigControl.activeKeys[item.dataIndex] == 3 ?{border:'1px solid #000'}:{}"
                     @click="()=>{
                  chartConfigControl.activeKeys[item.dataIndex] = 3;
                  chartOption.convert[item.dataIndex].colorDirection='to right'
                  chartOption.convert[item.dataIndex].iconType='battery';
                  chartOption.convert[item.dataIndex].orient='horizontal';
                }">
                  <HorizontalBattery
                    :color="chartOption.convert[item.dataIndex].color"
                    :progress="caculatePercent(80, 100)"
                    :type="
                      witchType(
                        chartOption.convert[item.dataIndex].stages,
                        chartOption.convert[item.dataIndex].linearGradient,
                      )
                    "
                    :colorDirection="'to right'"
                    :borderColor="chartOption.convert[item.dataIndex].borderColor"
                  />
                </div>
              </a-tooltip>
              <a-tooltip title="垂直电池条">
                <div class="metrics-mini-chart"
                     :style="chartConfigControl.activeKeys[item.dataIndex] == 4 ?{border:'1px solid #000'}:{}"
                     @click="()=>{
                  chartConfigControl.activeKeys[item.dataIndex] = 4
                  chartOption.convert[item.dataIndex].colorDirection='to top'
                  chartOption.convert[item.dataIndex].iconType='battery';
                  chartOption.convert[item.dataIndex].orient='vertical';
                }">
                  <VerticalBattery
                    :color="chartOption.convert[item.dataIndex].color"
                    :progress="caculatePercent(80, 100)"
                    :type="
                      witchType(
                        chartOption.convert[item.dataIndex].stages,
                        chartOption.convert[item.dataIndex].linearGradient,
                      )
                    "
                    :colorDirection="'to top'"
                    :borderColor="chartOption.convert[item.dataIndex].borderColor"
                  />
                </div>
              </a-tooltip>
            </div>
          </div>

          <div class="chart-item">
            <span class="label-left" :style="{ width: '36px' }">最大值</span>
            <div class="component-right">
              <a-input-number
                size="small"
                min="0"
                :style="{ width: '100%', fontSize: '12px' }"
                :disabled="!chartOption.convert[item.dataIndex].showIcon"
                v-model:value="chartOption.convert[item.dataIndex].max"
              >
              </a-input-number>
            </div>
          </div>
          <!--        边框颜色-->
          <div class="chart-item">
            <span class="label-left">边框颜色</span>
            <div class="component-right">
              <a-color-picker
                v-model:color="chartOption.convert[item.dataIndex].borderColor"
              ></a-color-picker>
            </div>
          </div>
          <!--        填充-->
          <div class="chart-item">
            <span class="label-left">填充</span>
            <div class="component-right" style="width: 168px">
              <a-checkbox
                v-model:checked="chartConfigControl.pureColorChecked[item.dataIndex]"
                @change="
                  (v: any) => {
                    if (v.target.checked) {
                      chartOption.convert[item.dataIndex].stages = false
                      chartOption.convert[item.dataIndex].linearGradient = false
                      chartOption.convert[item.dataIndex].color = 'blue'
                    }
                  }
                "
              >
                <span class="label-normal">纯色</span>
              </a-checkbox>

              <a-checkbox
                v-model:checked="chartOption.convert[item.dataIndex].stages"
                @change="
                  (v: any) => {
                    if (v.target.checked) {
                      chartConfigControl.pureColorChecked[item.dataIndex] = false
                      chartOption.convert[item.dataIndex].linearGradient = false
                      chartOption.convert[item.dataIndex].color = [
                        [0.4, 'green'],
                        [0.8, 'yellow'],
                        [1, 'red'],
                      ]
                    }
                  }
                "
              >
                <span class="label-normal">分段</span>
              </a-checkbox>
              <a-checkbox
                v-model:checked="chartOption.convert[item.dataIndex].linearGradient"
                @change="
                  (v: any) => {
                    if (v.target.checked) {
                      chartConfigControl.pureColorChecked[item.dataIndex] = false
                      chartOption.convert[item.dataIndex].stages = false
                      chartOption.convert[item.dataIndex].color = ['green', 'yellow', 'red']
                      chartOption.convert[item.dataIndex].colorDirection = 'to top'
                    }
                  }
                "
              >
                <span class="label-normal">渐变</span>
              </a-checkbox>
            </div>
          </div>

          <!--        纯色配置-->
          <div class="chart-item" v-show="chartConfigControl.pureColorChecked[item.dataIndex]">
            <span class="label-left">纯色配置</span>
            <div class="component-right">
              <a-color-picker
                v-model:color="chartOption.convert[item.dataIndex].color"
              ></a-color-picker>
            </div>
          </div>

          <!-- 颜色分段-->
          <div
            class="chart-item"
            v-for="(_, index) in 3"
            v-if="chartOption.convert[item.dataIndex].stages"
          >
            <a-color-picker
              v-model:color="chartOption.convert[item.dataIndex].color[index][1]"
            ></a-color-picker>

            <div class="component-right">
              <a-input-number
                max="100"
                min="0"
                size="small"
                :style="{ width: '100%', fontSize: '12px' }"
                addon-after="%"
                :value="100*chartOption.convert[item.dataIndex].color[index][0]"
                @change="(v:any)=>{
                chartOption.convert[item.dataIndex].color[index][0] = (v/100).toFixed(2);
                }"
              ></a-input-number>
            </div>
          </div>

          <!-- 渐变-->
          <div class="chart-item" v-show="chartOption.convert[item.dataIndex].linearGradient">
            <span class="label-left">渐变配置</span>
            <div class="component-right">
              <a-color-picker
                v-for="(_, index) in 3"
                v-model:color="chartOption.convert[item.dataIndex].color[index]"
              ></a-color-picker>
            </div>
          </div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style scoped>
.metrics-mini-chart {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.metrics-mini-chart:active {
  scale: calc(1.3);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
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
</style>
