<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive} from "vue";
import {DefaultThem, themArray} from "@/echartsThem/registerThem.ts";
import Left from "@/assets/icon/Left.vue";
import Right from "@/assets/icon/Right.vue";
import Center from "@/assets/icon/Center.vue";
import {BarChartOutlined, LineChartOutlined} from "@ant-design/icons-vue";
import * as echarts from "echarts";

let {getChartConfig, setChartConfig, chartOption, chartContainer, clearCurrentConfig} =
    defineProps(['getChartConfig', 'setChartConfig', 'chartOption', 'chartContainer', 'clearCurrentConfig']);

let chartConfig: any;

let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  currentThem: 'customized', // 当前主题
  currentColors: DefaultThem.theme.color, // 当前主题的颜色

  allSeriesEqual: false, // 数据系列的配置，各系列全一一致
  allSeriesConfigShow: [] as Array<string>, // 数据系列：默认展开的内容
})


const chartConfigFunction = {
  changeThem: (themName: string) => {
    if (chartConfig == null) {
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
}

onMounted(()=>{
  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(()=>{
    // 初始化堆叠配置
    // chartConfig = getChartConfig();
  })
})

onUnmounted(()=>{
  clearCurrentConfig();
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
            @change="chartConfig.setOption({ title: { text: chartOption.title.text } })"
        ></a-input>
      </div>
    </div>
  </div>

  <!--分页配置-->
  <div class="chart-group">

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
              {{ item.name }}
            </span>
            <span v-if="item.type == 'bar'">
              <BarChartOutlined :style="{ color: chartConfigFunction.getColor(index) ,fontSize:'16px'}"/>
            </span>
            <span v-else-if="item.type == 'line'">
              <LineChartOutlined :style="{ color: chartConfigFunction.getColor(index) ,fontSize:'16px'}"/>
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
</style>