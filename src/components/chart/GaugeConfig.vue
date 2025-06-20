<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { themArray } from '@/echartsThem/registerThem.ts'
import * as echarts from 'echarts'
import Left from '@/assets/icon/Left.vue'
import Center from '@/assets/icon/Center.vue'
import Right from '@/assets/icon/Right.vue'
import { CloseOutlined, DashboardOutlined, PieChartOutlined } from '@ant-design/icons-vue'
import { gaugeColor } from '@/composable/GuageColor.ts'
import ColorPicker from '@/components/extend/ColorPicker.vue'
import AColorPicker from '@/components/extend/AColorPicker.vue'
import Gauge from '@/assets/gauge/Gauge.vue'
import GaugeHalf from '@/assets/gauge/GaugeHalf.vue'
import ProgressCircle from '@/assets/gauge/ProgressCircle.vue'
import ProgressBottom from '@/assets/gauge/ProgressBottom.vue'
import { chartTemplate } from '@/composable/ChartTemplate.ts'

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
  gaugeActiveKey: '', // 展开主题折叠面板
  gaugeRangeKey: '',
  gaugeDetailShow: '',
  gaugeSize: 80,
  widthSize: 30,
  showAxisTick: true,
  showAxisLabel: true,
  pointerIcon: 'default',
  pointerLength: 60,
  currentGauge: 'default',
  gaugeType: 'gauge',
  progressColor: '#5470c6',
  pickColor: [[100, '#5470c6']] as Array<Array<any>>,
  openColorSelector: false,
  // 是否默认主题
  isDefault: true,
  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容
})

const chartConfigFunction = {
  changeGaugeColor: (gaugeName: string) => {
    chartConfigControl.isDefault = 'default' == gaugeName
    chartConfigControl.currentGauge = gaugeName

    let gaugeColorObj = gaugeColor.find((item) => item.name == gaugeName)
    if (gaugeColorObj) {
      chartConfigControl.pickColor.length = 0

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
  setDefaultOption:()=>{
      chartConfigControl.gaugeActiveKey= ''; // 展开主题折叠面板
      chartConfigControl.gaugeRangeKey= '';
      chartConfigControl.gaugeDetailShow= '';
      chartConfigControl.gaugeSize= 80;
      chartConfigControl.widthSize= 30;
      chartConfigControl.showAxisTick= true;
      chartConfigControl.showAxisLabel= true;
      chartConfigControl.pointerIcon= 'default';
      chartConfigControl.pointerLength= 60;
      chartConfigControl.currentGauge= 'default';

      chartConfigControl.progressColor= '#5470c6';
      chartConfigControl.pickColor= [[100, '#5470c6']] as Array<Array<any>>;
      chartConfigControl.openColorSelector= false;

      chartConfigControl.isDefault= true;
      chartConfigControl.allSeriesEqual= false; // 数据系列的配置，各系列全一一致
      chartConfigControl.allSeriesConfigShow= [] as Array<string>; // 数据系列：默认展开的内容
  },
  changeGaugeType: () => {
    // 四种情况，

    // 允许添加多个指标
    let temp = chartConfig.getOption()

    let basicOption = chartTemplate(temp.title.text, chartConfigControl.gaugeType)

    if (chartConfigControl.gaugeType.startsWith('progress')) {
      if (temp.series[0].data[0] != null) {
        // @ts-ignore
        basicOption.series.data[0].name = temp.series[0].data[0].name

        // @ts-ignore
        basicOption.series.data[0].value = temp.series[0].data[0].value
      }
    } else {
      // @ts-ignore
      basicOption.series.data = temp.series[0].data;
      // @ts-ignore
      if(basicOption.series.data.length >0){
        // @ts-ignore
        for (let i = 0; i < basicOption.series.data.length; i++) {
          // @ts-ignore
          basicOption.series.data[i].title.show = false;
          // @ts-ignore
          basicOption.series.data[i].detail.show = false;
        }
      }
    }
    // @ts-ignore
    basicOption.series.max = temp.series[0].max

   chartConfigFunction.setDefaultOption();
    // 将配置复制给 本地变量
    Object.assign(chartOption, basicOption)

    // 完全替换原来的内容
    chartConfig.setOption(basicOption, true)
  },
  changeLocation: () => {
    // 根据数据的显示隐藏计算位置
    let dataShow = []
    for (let i = 0; i < chartOption.series.data.length; i++) {
      dataShow[i] = chartOption.series.data[i].title.show || chartOption.series.data[i].detail.show
    }

    let count = dataShow.filter((item) => item).length

    if (count > 10) {
      count = 10
    }

    let a = 0
    if (count % 2 == 0) {
      a = 10
    }

    let b = parseInt((count / 2).toString())

    let start = -b * 20 + a

    let titleTop = '0'
    let detailTop = '0'
    if (chartConfigControl.gaugeType == 'gauge') {
      titleTop = '80%'
      detailTop = '90%'
    } else if (chartConfigControl.gaugeType == 'gaugeHalf') {
      titleTop = '20%'
      detailTop = '30%'
    } else if (chartConfigControl.gaugeType.startsWith('progress')) {
      titleTop = '10%'
    }
    for (let i = 0; i < chartOption.series.data.length; i++) {
      if (dataShow[i]) {
        chartOption.series.data[i].title.offsetCenter = [start + '%', titleTop]
        chartOption.series.data[i].detail.offsetCenter = [start + '%', detailTop]
        start += 20
      }

      if (start > 90) {
        break
      }
    }
  },
  changeAllValueLocation: (show: boolean) => {
    for (let i = 0; i < chartOption.series.data.length; i++) {
      chartOption.series.data[i].detail.show = show
    }
    chartConfigFunction.changeLocation()
  },
  changeAllNameLocation: (show: boolean) => {
    for (let i = 0; i < chartOption.series.data.length; i++) {
      chartOption.series.data[i].title.show = show
    }
    chartConfigFunction.changeLocation()
  },
}

watch(chartConfigControl.pickColor, (value) => {
  let afterChange = [[]] as Array<Array<any>>
  for (let i = 0; i < value.length; i++) {
    let start = parseFloat((value[i][0] / 100).toFixed(2))
    afterChange[i] = [start, value[i][1]]
  }

  chartOption.series.axisLine.lineStyle.color = afterChange

  chartConfig.setOption(chartOption)
})

watch(()=>chartConfigControl.progressColor,(value)=>{

  chartConfig.setOption({
    series:{progress:{itemStyle:{color:value}}}
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
  <div class="chart-group">
    <div class="chart-item">
      <span class="label-left">类型</span>
      <div class="component-right">
        <a-radio-group
          v-model:value="chartConfigControl.gaugeType"
          button-style="outline"
          size="small"
          class="gaugeBtnGroup"
          @change="
            () => {
              chartConfigFunction.changeGaugeType()
            }
          "
        >
          <a-radio-button value="gauge" class="gaugeBtn">
            <Gauge class="gauge" />
          </a-radio-button>

          <a-radio-button value="gaugeHalf" class="gaugeBtn">
            <GaugeHalf class="gaugeHalf" />
          </a-radio-button>

          <a-radio-button value="progressCircle" class="gaugeBtn">
            <ProgressCircle class="progressCircle" />
          </a-radio-button>

          <a-radio-button value="progressBottom" class="gaugeBtn">
            <ProgressBottom class="progressBottom" />
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
  </div>

  <!--主题-->
  <div class="chart-group" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
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
              chartConfig.setOption({ title: { show: chartOption.title.show } })
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
  <div class="chart-group" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
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
            <!--            <a-button @click="chartConfigFunction.changeRangeColor(index, 'add')">
                          <template #icon> add</template>
                        </a-button>-->
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <!-- 其他配置-->
  <div class="chart-group">
    <a-collapse
      v-model:activeKey="chartConfigControl.gaugeDetailShow"
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
        header="仪表细节配置"
        key="gaugeDetail"
      >
        <!--    仪表大小-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">仪表大小</span>

          <div class="component-right">
            <a-slider
              v-model:value="chartConfigControl.gaugeSize"
              :min="0"
              :max="120"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                () => {
                  let size = chartConfigControl.gaugeSize + '%'
                  chartOption.series.radius = size
                  chartConfig.setOption({
                    series: {
                      radius: size,
                    },
                  })
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!--   仪表的最大值-->
        <div class="chart-item">
          <span class="label-left" style="width: 60px">仪表最大值</span>

          <div class="component-right">
            <a-input-number
              size="small"
              min="0"
              :style="{ width: '100%', fontSize: '12px' }"
              v-model:value="chartOption.series.max"
              @change="chartConfig.setOption({ series: { max: chartOption.series.max } })"
            >
            </a-input-number>
          </div>
        </div>

        <!-- 宽度 -->
        <div class="chart-item">
          <span class="label-left" style="width: 24px">宽度</span>

          <div class="component-right">
            <a-slider
              v-model:value="chartConfigControl.widthSize"
              :min="0"
              :max="100"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                () => {
                  let option = {
                    series: {
                      axisLine: {
                        lineStyle: {
                          width: chartConfigControl.widthSize,
                        },
                      },
                      splitLine: {
                        length: chartConfigControl.widthSize,
                        distance: -chartConfigControl.widthSize,
                      },
                      axisTick: {
                        distance: -chartConfigControl.widthSize,
                      },
                      axisLabel: {
                        distance: chartConfigControl.widthSize + 10,
                      },
                      progress: {
                        width: chartConfigControl.widthSize,
                      },
                    },
                  }

                  chartOption.series.axisLine.lineStyle.width = chartConfigControl.widthSize
                  chartOption.series.splitLine.length = chartConfigControl.widthSize
                  chartOption.series.splitLine.distance = -chartConfigControl.widthSize
                  chartOption.series.axisTick.distance = -chartConfigControl.widthSize
                  chartOption.series.axisLabel.distance = chartConfigControl.widthSize + 10

                  chartOption.series.progress.width = chartConfigControl.widthSize

                  chartConfig.setOption(option)
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!--   进度条颜色-->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('progress')">
          <span class="label-left" style="width: 36px">颜色</span>

          <div class="component-right">
            <a-color-picker v-model:color="chartConfigControl.progressColor"> </a-color-picker>
          </div>
        </div>

        <!--   刻度线-->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 36px">刻度线</span>

          <div class="component-right">
            <a-checkbox
              v-model:checked="chartConfigControl.showAxisTick"
              @change="
                (v: any) => {
                  let option = {
                    series: {
                      splitLine: {
                        show: v.target.checked,
                      },
                      axisTick: {
                        show: v.target.checked,
                      },
                    },
                  }

                  chartOption.series.splitLine.show = v.target.checked
                  chartOption.series.axisTick.show = v.target.checked

                  chartConfig.setOption(option)
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!--   刻度值-->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 36px">刻度值</span>

          <div class="component-right">
            <a-checkbox
              v-model:checked="chartConfigControl.showAxisLabel"
              @change="
                (v: any) => {
                  let option = {
                    series: {
                      axisLabel: {
                        show: v.target.checked,
                      },
                    },
                  }

                  chartOption.series.axisLabel.show = v.target.checked
                  chartConfig.setOption(option)
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!--  指针 -->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 36px">指针</span>

          <div class="component-right">
            <a-checkbox
              v-model:checked="chartOption.series.pointer.show"
              @change="
                (v: any) => {
                  let option = {
                    series: {
                      pointer: {
                        show: v.target.checked,
                      },
                    },
                  }

                  chartConfig.setOption(option)
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <!--  指针形状 -->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 48px">指针形状</span>

          <div class="component-right">
            <a-select
              size="small"
              v-model:value="chartConfigControl.pointerIcon"
              :style="{ width: '100%' }"
              @change="
                (v: any) => {
                  let icon =
                    chartConfigControl.pointerIcon == 'default'
                      ? null
                      : chartConfigControl.pointerIcon
                  let option = {
                    series: {
                      pointer: {
                        icon: icon,
                      },
                    },
                  }

                  chartOption.series.pointer.icon = icon

                  chartConfig.setOption(option)
                }
              "
            >
              <a-select-option value="default">默认</a-select-option>
              <a-select-option value="circle">圆点</a-select-option>
              <a-select-option value="rect">矩形</a-select-option>
              <a-select-option value="roundRect">圆角矩形</a-select-option>
              <a-select-option value="triangle">三角形</a-select-option>
              <a-select-option value="diamond">菱形</a-select-option>
              <a-select-option value="pin">图钉</a-select-option>
              <a-select-option value="arrow">箭头</a-select-option>
            </a-select>
          </div>
        </div>

        <!--  指针大小 -->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 48px">指针大小</span>

          <div class="component-right">
            <a-slider
              v-model:value="chartOption.series.pointer.width"
              :min="0"
              :max="200"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                (v: any) => {
                  let option = {
                    series: {
                      pointer: {
                        width: chartOption.series.pointer.width,
                      },
                    },
                  }

                  chartConfig.setOption(option)
                }
              "
            >
            </a-slider>
          </div>
        </div>

        <!-- 指针长度 -->
        <div class="chart-item" v-if="chartConfigControl.gaugeType.startsWith('gauge')">
          <span class="label-left" style="width: 48px">指针长度</span>

          <div class="component-right">
            <a-slider
              v-model:value="chartConfigControl.pointerLength"
              :min="0"
              :max="200"
              :dots="true"
              :step="1"
              :style="{ width: '100%' }"
              @change="
                (v: any) => {
                  let option = {
                    series: {
                      pointer: {
                        length: chartConfigControl.pointerLength + '%',
                      },
                    },
                  }

                  chartOption.series.pointer.length = chartConfigControl.pointerLength + '%'

                  chartConfig.setOption(option)
                }
              "
            >
            </a-slider>
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
              chartConfigControl.allSeriesConfigShow[0] = chartOption.series.data[0].id || '0'
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
              <DashboardOutlined style="font-size: 16px" />
            </span>
          </div>
        </template>

        <!-- 系列名称-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">系列名称</span>
          <div class="component-right">
            <a-input
              size="small"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
              allow-clear
              v-model:value="item.name"
              @change="
                () => {
                  let option = {
                    series: {
                      data: chartOption.series.data,
                    },
                  }
                  chartConfig.setOption(option)
                }
              "
            >
            </a-input>
          </div>
        </div>

        <div class="chart-item">
          <span class="label-left" style="width: 48px">名称</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.title.show"
              @change="
                (v: any) => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllNameLocation(v.target.checked)
                  } else {
                    chartConfigFunction.changeLocation()
                  }

                  let option = {
                    series: {
                      data: chartOption.series.data,
                    },
                  }
                  chartConfig.setOption(option)
                }
              "
            >
            </a-checkbox>
          </div>
        </div>

        <div class="chart-item">
          <span class="label-left" style="width: 48px">值</span>
          <div class="component-right">
            <a-checkbox
              v-model:checked="item.detail.show"
              @change="
                (v: any) => {
                  if (chartConfigControl.allSeriesEqual) {
                    chartConfigFunction.changeAllValueLocation(v.target.checked)
                  } else {
                    chartConfigFunction.changeLocation()
                  }
                  let option = {
                    series: {
                      data: chartOption.series.data,
                    },
                  }
                  chartConfig.setOption(option)
                }
              "
            >
            </a-checkbox>
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

.chart-group .chart-item .gaugeBtnGroup {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/*border: none;*/
.chart-group .chart-item .gaugeBtn {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

.ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}

.chart-group .chart-item .gaugeBtn .gauge {
  font-size: 26px;
}

.chart-group .chart-item .gaugeBtn .gaugeHalf {
  font-size: 26px;
}

.chart-group .chart-item .gaugeBtn .progressCircle {
  font-size: 26px;
}

.chart-group .chart-item .gaugeBtn .progressBottom {
  font-size: 22px;
}

.chart-group .chart-item .gaugeBtn:hover {
  transform: scale(1.3);
}
</style>
