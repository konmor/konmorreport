<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive} from 'vue'
import {themArray} from '@/echartsThem/registerThem.ts'
import * as echarts from 'echarts'
import {SettingOutlined} from "@ant-design/icons-vue";
import Left from '@/assets/icon/Left.vue'
import Right from '@/assets/icon/Right.vue'
import Center from '@/assets/icon/Center.vue'
import AColorPicker from "@/components/extend/AColorPicker.vue";
import BoldLighter from "@/assets/icon/BoldLighter.vue";
import BoldNormal from "@/assets/icon/BoldNormal.vue";
import BoldBold from "@/assets/icon/BoldBold.vue";
import BoldBolder from "@/assets/icon/BoldBolder.vue";
import AlignTop from "@/assets/icon/AlignTop.vue";
import AlignMiddle from "@/assets/icon/AlignMiddle.vue";
import AlignBottom from "@/assets/icon/AlignBottom.vue";
import MetricsDetailsConfig from "@/components/chart/MetricsDetailsConfig.vue";

let {getChartConfig, setChartConfig, chartOption, chartContainer, clearCurrentConfig} =
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
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色

  titleDetailConfigShow: false,
  titleHeightAuto: true,

  seriesActiveKey: [] as Array<string>,

  allSeriesEqual: false,
  //
  seriesWidthAuto: {} as Record<string, boolean>,
  //
  seriesHeightAuto: {} as Record<string, boolean>,
  //
  seriesNameWidthAuto: {} as Record<string, boolean>,
  //
  seriesValuePrefixWidthAuto: {} as Record<string, boolean>,
  //
  seriesValueMetricsAuto: {} as Record<string, boolean>,
  //
  seriesValueSuffixAuto: {} as Record<string, boolean>,

  legendPosition: 'topCenter', // 图例的位置


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

onMounted(() => {
  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(() => {
    // 初始化堆叠配置
    chartConfig = getChartConfig();
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
            v-model:checked="chartOption.title.show"></a-switch>
        <a-radio-group
            v-model:value="chartOption.title.position"
            :disabled="!chartOption.title.show"
            button-style="solid"
            size="small">
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

    <!--细节配置-->
    <div class="chart-item">
      <span class="label-left" style="width: 48px">细节</span>
      <div class="component-right">
        <a-checkbox v-model:checked="chartConfigControl.titleDetailConfigShow"
                    :disabled="!chartOption.title.show">

        </a-checkbox>
      </div>
    </div>

    <!--标题颜色-->
    <div class="chart-item" v-show="chartConfigControl.titleDetailConfigShow && chartOption.title.show">
      <span class="label-left" style="width: 24px">颜色</span>
      <div class="component-right">
        <a-color-picker v-model:color="chartOption.title.textStyle.color"></a-color-picker>
      </div>
    </div>

    <!--标题字体大小-->
    <div class="chart-item" v-show="chartConfigControl.titleDetailConfigShow && chartOption.title.show">
      <span class="label-left" style="width: 48px">大小</span>
      <div class="component-right">
        <a-input-number
            v-model:value="chartOption.title.textStyle.fontSize"
            allow-clear
            size="small"
            min="12"
            :style="{ width: '100%', fontSize: '12px', height: '22px' }"
            @change="()=>{
              if(chartConfigControl.titleHeightAuto){
                chartOption.title.textStyle.height = chartOption.title.textStyle.fontSize +24;
              }
            }"
        ></a-input-number>
      </div>
    </div>

    <!--标题字体粗细-->
    <div class="chart-item" v-show="chartConfigControl.titleDetailConfigShow && chartOption.title.show">
      <span class="label-left" style="width: 24px">粗细</span>
      <div class="component-right">
        <a-radio-group
            v-model:value="chartOption.title.textStyle.fontWeight"
            button-style="outline"
            size="small">
          <a-radio-button value="lighter">
            <BoldLighter/>
          </a-radio-button>
          <a-radio-button value="normal">
            <BoldNormal/>
          </a-radio-button>
          <a-radio-button value="bold">
            <BoldBold/>
          </a-radio-button>
          <a-radio-button value="bolder">
            <BoldBolder/>
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <!--字体行高-->
    <div class="chart-item" v-show="chartConfigControl.titleDetailConfigShow && chartOption.title.show">
      <span class="label-left" style="width: 24px">行高</span>
      <div class="component-right">
        <a-checkbox v-model:checked="chartConfigControl.titleHeightAuto"
                    @change="(v:any)=>{
          if(v.target.checked){
            chartOption.title.textStyle.height = chartOption.title.textStyle.fontSize + 24;
          }
        }">
          <span class="label-normal" v-if="chartConfigControl.titleHeightAuto">
            自动
          </span>
        </a-checkbox>

        <a-input-number
            v-if="!chartConfigControl.titleHeightAuto"
            v-model:value=" chartOption.title.textStyle.height"
            allow-clear
            size="small"
            :style="{ width: '80%', fontSize: '12px', height: '22px' }"
        ></a-input-number>
      </div>
    </div>
  </div>

  <!--  数据系列-->

  <div class="chart-group">
    <!--各系列一致-->
    <div class="chart-item">
      <span class="label-left" style="width: 48px">数据系列</span>
      <div class="component-right">
        <a-checkbox v-model:checked="chartConfigControl.allSeriesEqual"
                    @change="(v:any)=>{
          if(v.target.checked){
            chartConfigControl.seriesActiveKey.length = 1;
            chartConfigControl.seriesActiveKey[0] = chartOption.content.labels[0].id || '0'
          } else {
            chartConfigControl.seriesActiveKey = [];
          }
        }">
          <span class="label-normal">各系列一致</span>
        </a-checkbox>
      </div>
    </div>


    <a-collapse
        v-model:activeKey="chartConfigControl.seriesActiveKey"
        expand-icon-position="end"
        :style="{
        border: 'none',
        backgroundColor: 'transparent',
        margin: '0',
        padding: '0',
      }"
    >
      <a-collapse-panel
          v-for="(item,index) in chartOption.content.labels"
          :key="item.id || index"
          :header="item.name.text?item.name.text:'无名称'"
          :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
      >
        <!--宽度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">宽度</span>
          <div class="component-right">
            <a-checkbox v-model:checked="chartConfigControl.seriesWidthAuto[item.id || index]"
                        @change="(v:any)=>{
                          // todo
                        }">
          <span class="label-normal" v-if="chartConfigControl.seriesWidthAuto[item.id || index]">
            自动
          </span>
            </a-checkbox>

            <a-input-number
                v-if="!chartConfigControl.seriesWidthAuto[item.id || index]"
                v-model:value=" item.minWidth"
                allow-clear
                size="small"
                :style="{ width: '80%', fontSize: '12px', height: '22px' }"
            ></a-input-number>
          </div>
        </div>

        <!--高度-->
        <div class="chart-item">
          <span class="label-left" style="width: 48px">高度</span>
          <div class="component-right">
            <a-checkbox v-model:checked="chartConfigControl.seriesHeightAuto[item.id || index]"
                        @change="(v:any)=>{
                          // todo
                        }">
          <span class="label-normal" v-if="chartConfigControl.seriesHeightAuto[item.id || index]">
            自动
          </span>
            </a-checkbox>

            <a-input-number
                v-if="!chartConfigControl.seriesHeightAuto[item.id || index]"
                v-model:value=" item.minHeight"
                allow-clear
                size="small"
                :style="{ width: '80%', fontSize: '12px', height: '22px' }"
            ></a-input-number>
          </div>
        </div>

        <div class="detail-item">
          <div class="chart-item">
            <span class="label-left" style="width: 48px">系列名称</span>

            <div class="component-right">
              <a-checkbox v-model:checked="item.name.show">
                <span class="label-normal">显示</span>
              </a-checkbox>
            </div>
          </div>

          <div class="chart-item">
          <span class="label-left" style="width: 60px;display: flex;align-items: center;
          justify-content: flex-start">
            <a-color-picker v-model:color="item.name.itemStyle.color"></a-color-picker>
            <MetricsDetailsConfig v-model:itemStyle="item.name.itemStyle"
                                  v-model:widthAuto="chartConfigControl.seriesNameWidthAuto[item.id||index]"/>
          </span>

            <div class="component-right">
              <a-input
                  v-model:value="item.name.text"
                  size="small"
                  :style="{ width: '100%', fontSize: '12px', height: '22px' }"
                  @change="
                () => {

                }
              "
              >
              </a-input>
            </div>
          </div>
        </div>

        <div class="detail-item metrics">
          <div class="chart-item">
            <span class="label-left" style="width: 48px">指标</span>

            <div class="component-right">
              <a-checkbox v-model:checked="item.value.metrics.show">
                <span class="label-normal">显示</span>
              </a-checkbox>
            </div>
          </div>

          <div class="chart-item">
          <span class="label-left" style="width: 60px;display: flex;align-items: center;
          justify-content: flex-start">
            <a-color-picker v-model:color="item.value.metrics.itemStyle.color"></a-color-picker>
            <MetricsDetailsConfig v-model:itemStyle="item.value.metrics.itemStyle"
                                  v-model:widthAuto="chartConfigControl.seriesValueMetricsAuto[item.id||index]"/>
          </span>

            <div class="component-right">
              <a-input
                  v-model:value="item.value.metrics.text"
                  size="small"
                  :style="{ width: '100%', fontSize: '12px', height: '22px' }"
                  @change="
                () => {

                }
              "
              >
              </a-input>
            </div>
          </div>
        </div>

        <div class="detail-item metrics">
          <div class="chart-item">
            <span class="label-left" style="width: 48px">指标前缀</span>

            <div class="component-right">
              <a-checkbox v-model:checked="item.value.prefix.show">
                <span class="label-normal">显示</span>
              </a-checkbox>
            </div>
          </div>

          <div class="chart-item">
          <span class="label-left" style="width: 60px;display: flex;align-items: center;
          justify-content: flex-start">
            <a-color-picker v-model:color="item.value.prefix.itemStyle.color"></a-color-picker>
            <MetricsDetailsConfig v-model:itemStyle="item.value.prefix.itemStyle"
                                  v-model:widthAuto="chartConfigControl.seriesValuePrefixWidthAuto[item.id||index]"/>
          </span>

            <div class="component-right">
              <a-input
                  v-model:value="item.value.prefix.text"
                  size="small"
                  :style="{ width: '100%', fontSize: '12px', height: '22px' }"
                  @change="
                () => {

                }
              "
              >
              </a-input>
            </div>
          </div>
        </div>

        <div class="detail-item metrics">
          <div class="chart-item">
            <span class="label-left" style="width: 48px">指标后缀</span>

            <div class="component-right">
              <a-checkbox v-model:checked="item.value.suffix.show">
                <span class="label-normal">显示</span>
              </a-checkbox>
            </div>
          </div>

          <div class="chart-item">
          <span class="label-left" style="width: 60px;display: flex;align-items: center;
          justify-content: flex-start">
            <a-color-picker v-model:color="item.value.suffix.itemStyle.color"></a-color-picker>
            <MetricsDetailsConfig v-model:itemStyle="item.value.suffix.itemStyle"
                                  v-model:widthAuto="chartConfigControl.seriesValueSuffixAuto[item.id||index]"/>
          </span>

            <div class="component-right">
              <component :is="item.value.suffix.text" v-if="item.value.suffix.isIcon"></component>
              <a-input
                  v-else
                  v-model:value="item.value.suffix.text"
                  size="small"
                  :style="{ width: '100%', fontSize: '12px', height: '22px' }"
                  @change="
                () => {

                }
              "
              >
              </a-input>
            </div>
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

.chart-group .detail-item {
  margin-top: 2px;
  margin-bottom: 2px;
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