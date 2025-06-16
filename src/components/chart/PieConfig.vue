<script setup lang="ts">

import {nextTick, onMounted, onUnmounted, reactive} from "vue";
import {themArray} from "@/echartsThem/registerThem.ts";
import * as echarts from "echarts";

interface GridPosition {
  [key: string]: { top: number; left: number; right: number; bottom: number }
}

// 特之配置组件 如 主题、堆叠 等配置
interface ComponentPosition {
  currentStatus: string
  position: { top: number; left: number; right: number; bottom: number } | undefined
  allStatus: GridPosition
}
let {getChartConfig,setChartConfig,chartOption, chartContainer} = defineProps(['getChartConfig','setChartConfig', 'chartOption', 'chartContainer']);
let chartConfig:any;

const chartConfigConstParams = {}
let chartConfigControl = reactive({
  themActiveKey: '', // 展开主题折叠面板
  currentThem: 'customized', // 当前主题
  currentColors: themArray.find((item) => item.themeName == 'customized')!.theme.color, // 当前主题的颜色
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
}

const chartConfigStyle = reactive({});



//



onMounted(()=>{
  // 初始化
  // chartConfigFunction.initStackItems();

  // 在页面渲染完成之后设置数据，这样才能拿到父级中的该变量  getChartConfig();
  nextTick(()=>{
    // 初始化堆叠配置
    chartConfig = getChartConfig();
  })
})



onUnmounted(()=>{
  chartConfig.dispose();
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