<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Filter from '@/components/Filter.vue'
import { getUuid } from 'ant-design-vue/es/vc-notification/HookNotification'
import * as echarts from 'echarts'
import {barTemplate, chartTemplate} from '@/composable/ChartTemplate.ts'
import useNavigator from '@/composable/useNavigator.ts'
import type { EChartsType } from 'echarts'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import BarConfig from '@/components/chart/BarConfig.vue'
import { sqlQueryData } from '@/api/sql.ts'
import type { SQLQuery, SQLResultField } from '@/types/api.ts';
import { FieldStringOutlined, FieldNumberOutlined, FieldTimeOutlined,CloseOutlined } from '@ant-design/icons-vue'
import {message, Modal} from "ant-design-vue";
import PieConfig from "@/components/chart/PieConfig.vue";

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

const { sqlArray, refreshDatasourceList, findSourceIdBySQLID } = useNavigator()
refreshDatasourceList()

const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  // console.log('chart add', event, event.item.__draggable_context.element.meta)
  // console.log(items)
  // 添加元素后展示模态框
  // 一 选择数据源
  sqlSelectorModal.open = true
  // 二 开始配置 配置内容由 selectData.open 点击ok后的模态框决定
}

// 仪表板内部的所有echarts的 实例
let allChartsInstance: EChartsType[] = []
// 仪表板内部的所有echarts的 容器大小变化的监听者
let allResizeObserver: ResizeObserver[] = []

// 配置图表时临时变量，临时渲染容器、临时echarts实例、临时监听器
let tempChartContainer = ref()
// 配置时的echarts实例
let tempChart: EChartsType

// 最新的echarts实例绑定的div容器的id值
let lastEchartsContainerID: string
// 最新的sql主建id，用于该sql数据和返回字段查询。
let lastSQLId: string
// 最新的创建的数据图表类型
let lastChartType = ref<string>('')

let fieldContainerActiveKey = ref('fieldContainer')

let dimensionsFields = reactive<SQLResultField[]>([])
let metricsFields = reactive<SQLResultField[]>([])

const getTempChart = () => {
  return tempChart
}
const setTempChart = (value: EChartsType) => {
  if (tempChart) {
    tempChart.dispose()
  }
  tempChart = value
}
let tempObserver: ResizeObserver

// 使用change事件，监听添加事件。似乎echarts有bug，仅change事件【added】能够拿到echarts clone后的对象
const change = function change(event: Event) {
  // 监听添加事件
  if ('added' in event) {
    // @ts-ignore 刚刚拖拽进来的图表类型，也许不是图表
    lastChartType.value = event['added'].element.type;
    // @ts-ignore window.console.log(event['added'])
    lastEchartsContainerID = event['added'].element.id
    let newContainer = document.getElementById(lastEchartsContainerID)
    // 2.初始化echarts 挂载的位置
    let newEchartsInstance = echarts.init(newContainer) // 参数是dom节点
    // 3. 设置默认数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    newEchartsInstance.setOption(chartTemplate('test2',lastChartType.value));

    // 放入allChartsInstance容器中
    allChartsInstance.push(newEchartsInstance)

    let observer = new ResizeObserver(() => {
      if (newEchartsInstance) newEchartsInstance.resize()
    })
    observer.observe(newContainer as Element)
    allResizeObserver.push(observer);
  }
}

// 维度
let dimensions:Array<string> = []

let tempChartOption: ECBasicOption = reactive<ECBasicOption>({});

let allFields = reactive<SQLResultField[]>([])
let allData = reactive<Array<Map<string, object>>>([])

const clearCurrentConfig = ()=> {
  metricsFields.length = 0;
  dimensionsFields.length = 0;

  lastChartType.value = '';

  tempChart.dispose();
  tempChart.clear();
  // 清空tempChartOption的属性
  for (let key in tempChartOption) {
    delete tempChartOption[key];
  }

}

const tempChartModal = reactive<{ open: boolean; ok: (reject: any) => void; cancel: () => void }>({
  open: false,
  ok: (reject: any) => {
    tempChartModal.open = false;
    // 配置好之后从 temChart 中获取数据，并渲染给最后一个 chartArray 中的chart
    allChartsInstance[allChartsInstance.length - 1].setOption(tempChart.getOption(), true);
    clearCurrentConfig();
  },
  cancel: () => {
    tempChartModal.open = false
    clearCurrentConfig();
    removeLastEchartsInstance();
  },
})



function removeLastEchartsInstance() {
  //删除刚刚创建的数据,删除echarts实例，删除draagabel的元素
  let lastEchartsInstance = allChartsInstance.pop();
  if (lastEchartsInstance != undefined) {
    lastEchartsInstance.dispose();
    lastEchartsInstance.clear();
  }

  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].id == lastEchartsContainerID) {
      items.splice(i, 1);
      break;
    }
  }
}

function dimensionsPut(to:any,from:any,htmlElement:any,dragEvent:any):boolean{
  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value=>{return value.fieldId == htmlElement.id}) == undefined
  let notExistMetrics = metricsFields.find(value=>{ return value.fieldId == htmlElement.id}) == undefined;
  return notExistDimensions && notExistMetrics;
}

function metricsPut(to:any,from:any,htmlElement:any,dragEvent:any):boolean{

  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value=>{return value.fieldId == htmlElement.id}) == undefined
  let notExistMetrics = metricsFields.find(value=>{ return value.fieldId == htmlElement.id}) == undefined;
  let isNumber = allFields.find(value=>{ return value.fieldId == htmlElement.id})?.fieldType2 == 'Number'
  return notExistDimensions && notExistMetrics&&isNumber;
}

const removeDimensionsById = (id:string)=>{
  if(id != null && id != ''){
    let index =  dimensionsFields.findIndex(value => {return  value.fieldId==id});
    if(index>-1){
      // 删除
      dimensionsFields.splice(index,1);
    }
  }
}

const removeMetricsById = (id:string)=>{
  if(id != null && id != ''){
    let index =  metricsFields.findIndex(value => {return  value.fieldId==id});
    if(index>-1){
      // 删除
      metricsFields.splice(index,1);
    }
  }
}


const sqlSelectorModal = reactive<{
  open: boolean
  ok: (reject: any) => void
  cancel: () => void
  selected: string
  data: any[]
  showError: boolean
}>({
  open: false,
  ok: (reject: any) => {
    if (sqlSelectorModal.selected == null) {
      sqlSelectorModal.showError = true
    } else {
      // 关闭数据（、sql）选择框
      sqlSelectorModal.open = false
      // 打开图表配置模态框
      tempChartModal.open = true

      // 设置默认配置
      Object.assign(tempChartOption,chartTemplate('标题1',lastChartType.value));

      // 查询数据拿到字段和数据
      let sqlQuery: SQLQuery = {
        sourceId: findSourceIdBySQLID(lastSQLId)!,
        sqlId: lastSQLId,
        queryBySQLContent: false,
        pageInfo: { page: 1, size: 5000, total: 0 },
      }

      sqlQueryData(sqlQuery).then((response) => {
        // 访问正常
        if (response.code == 0) {
          for (let i = 0; i < response.data.columns.length; i++) {
            allFields[i] = response.data.columns[i]
          }
          allData = response.data.data
        }
      })

      // 保证已经渲染完毕
      nextTick(() => {
        // 开始渲染图表
        // let container = document.getElementById('chartContainer');
        let container = tempChartContainer.value
        // 2.初始化echarts 挂载的位置
        let newEchartsInstance = echarts.init(container)
        tempChart = newEchartsInstance // 交给外部临时变量
        // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
        newEchartsInstance.setOption(tempChartOption);

        let observer = new ResizeObserver(() => {
          if (newEchartsInstance) newEchartsInstance.resize()
        })
        tempObserver = observer
        observer.observe(container as Element)
      })
    }
  },
  cancel: () => {
    sqlSelectorModal.open = false;
    lastChartType.value = '';
    removeLastEchartsInstance()
  },
  selected: '',
  data: [{ label: '测试选项-1', value: 'key1' }],
  showError: false,
})

onMounted(() => {
  // 渲染图表
  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    let ecBasicOption = barTemplate('test1');

    myEcharts.setOption(ecBasicOption);

    allChartsInstance.push(myEcharts)
    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element)
    allResizeObserver.push(observer)
  }

  // 代码调试，后续删除 todo
  // 开始渲染图表
  /* // let container = document.getElementById('chartContainer');
   let container = tempChartContainer.value
   // 2.初始化echarts 挂载的位置
   let myEcharts = echarts.init(container) // 参数是dom节点
   tempChart = myEcharts
   // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
   myEcharts.setOption(toRaw(tempChartOption))

   let observer = new ResizeObserver(() => {
     if (myEcharts) myEcharts.resize()
   })
   tempObserver = observer
   observer.observe(container as Element)

   // // 堆叠配置 待删除
   // let colors = currentColors.value
   // // 4 * 8 32 3*8 = 24
   // for (let i = 0; i < dimensions.length - 1; i++) {
   //   stackItems[i] = [{name: dimensions[i + 1], id: i + 1, color: colors[i]}]
   // }*/
})

onUnmounted(() => {
  allResizeObserver.forEach((item) => {
    if (item) item.disconnect()
  })

  if (tempObserver != null) {
    tempObserver.disconnect()
  }
})

onBeforeUnmount(() => {
  if (allChartsInstance != null && allChartsInstance.length > 0) {
    allChartsInstance.forEach((item) => {
      if (item) item.dispose()
    })
  }

  if (tempChart) {
    tempChart.dispose()
  }
})

watch(sqlArray, (sqlItems) => {
  // sql选择框的下拉数据
  sqlSelectorModal.data =
    sqlItems != null && sqlItems.length > 0
      ? sqlItems.map((item) => {
          return { value: item?.key, label: item?.label }
        })
      : [{ label: '测试选项-1', value: 'key1' }]
})

watch(
  () => sqlSelectorModal.selected,
  (value) => {
    lastSQLId = value
  },
)


function getMapData(data:Map<string,object>,keys:string[]):Array<object>{
  let arr = [];
  for (let i = 0; i < keys.length; i++) {
    let newVar = data[keys[i]];
    if(newVar){
      arr[i] = newVar;
    }
  }

  return arr;
}

function renderChart() {
  dimensions.length = 0;
  // 图表渲染
  let option = {
    dataset: {
      dimensions: [] as Array<string>,
      source: [] as Array<Array<object>>,
    },
    series: [{}] as Array<object>,
  };

  // 必须要有维度字段;
  if (dimensionsFields.length > 0) {
    dimensions[0] = dimensionsFields[0].fieldAlias;

    for (let i = 0; i < metricsFields.length; i++) {
      let index = i + 1;
      dimensions[index] = metricsFields[i].fieldAlias;

      option.series[i] = {
        id: index.toString(),
        type: 'bar',
        name: dimensions[index],
        barMaxWidth: '50',
        barMinWidth: '1',
        stack: 'group' + index,
        stackStrategy: 'samesign',
        label: {
          show: false,
          position: 'top', // top inside insideTop insideBottom
          rotate: 0, // -90 90
        },
        emphasis: {
          disabled: false,
          focus: 'series', // none \ self \ series
          label: {
            show: false,
          },
        },
      }
    }
  }

  // 必须要有至少两个字段，其中一个必须为维度字段
  if (dimensions.length < 2) {
    tempChart.setOption(
        {
          dataset: {
            dimensions: [],
            source: [],
          },
          series: [{}]
        },
        {
          replaceMerge: ['series']
        });
    return;
  }
  let source: Array<Array<object>> = allData.map((item) => getMapData(item, dimensions));

  option.dataset.dimensions = dimensions;
  option.dataset.source = source;

  // 设置给变量
  tempChartOption.dataset = option.dataset;
  tempChartOption.series = option.series

  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series']
  });
}

// 监听字段的变化去渲染数据
// watch(dimensionsFields, renderChart);
//
// // 监听字段的变化去渲染数据
// watch(metricsFields,
//   renderChart
// )
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
      class="verticalScrollBar"
    >
      <div class="diagramContainer">
        <span class="diagramTitle">图表</span>
        <!--        <Diagram @mousedown="testDown($event)" @mouseup="testUp($event)" @mousemove="testMove($event)"/>-->
        <Diagram />
      </div>

      <div class="filterContainer">
        <span class="filterTitle">过滤器</span>
        <Filter />
      </div>

      <!-- 图表绑定的数据 选择择模态框-->
      <a-modal
        v-model:open="sqlSelectorModal.open"
        title="请选择需要渲染的数据！"
        @ok="sqlSelectorModal.ok"
        @cancel="sqlSelectorModal.cancel"
        ok-text="确认"
        cancel-text="取消"
      >
        <a-select
          v-model:value="sqlSelectorModal.selected"
          placeholder="请选择数据!"
          :options="sqlSelectorModal.data"
          :style="{ width: '60%' }"
          allowClear
        >
        </a-select>
        <span :style="{ marginLeft: '10px' }" v-if="sqlSelectorModal.showError">
          <CloseCircleOutlined :style="{ color: 'red' }" />
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
      class="verticalScrollBar"
    >
      <draggable
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(24,1fr)',
          gridAutoRows: '3em',
          justifyContent: 'center',
          gridAutoFlow: 'row dense',
        }"
        class="allChartContainer"
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
          ></div>
        </template>
      </draggable>
      <!-- 图形配置模态框-->
      <!-- v-if 控制销毁模态框以及模态框中的组件-->
      <a-modal
        v-if="tempChartModal.open"
        :open="tempChartModal.open"
        @ok="tempChartModal.ok"
        @cancel="tempChartModal.cancel"
        ok-text="确认"
        cancel-text="取消"
        :style="{ backgroundColor: 'transparent' }"
        width="100%"
        wrap-class-name="full-modal"
      >
        <template #title><span>配置图表</span></template>

        <a-layout :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }">
          <!-- 配置模态框 左侧字段选择区域-->
          <a-layout-sider
            :style="{
              height: '100%',
              backgroundColor: 'transparent',
              borderTop: '1px solid black',
              borderBottom: '1px solid black',
            }"
            width="240px"
          >
            <div class="chart-group">
              <a-collapse
                v-model:activeKey="fieldContainerActiveKey"
                expand-icon-position="end"
                :style="{
                  border: 'none',
                  backgroundColor: 'transparent',
                  margin: '0',
                  padding: '0',
                }"
              >
                <a-collapse-panel
                  key="fieldContainer"
                  header="字段"
                  :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
                >
                  <draggable
                    class="fieldsContainer"
                    :list="allFields"
                    :sort="false"
                    :group="{ name: 'fieldsContainer', pull: 'clone', put: false }"
                    animation="100"
                    item-key="fieldId"
                    tag="div"
                  >
                    <template #item="{ element }">
                      <div :id="element.fieldId" class="field">
                        <span v-if="element.fieldType2 == 'Number'" class="field-label">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else-if="element.fieldType2 == 'Time'" class="field-label">
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else class="field-label">
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                      </div>
                    </template>
                  </draggable>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-layout-sider>
          <!-- 配置模态框 中间-->
          <a-layout>
            <!-- 配置模态框 中间 维度配置区域-->
            <a-layout-header
              :style="{
                backgroundColor: 'transparent',
                border: '1px solid black',
                height: '15%',
                maxHeight: '124px',
                padding: '8px 16px',
              }"
            >
              <div class="fieldsDimensionsAndMetrics">
                <div class="dimensions">
                   <span style="font-size: 12px;padding: 0 6px;height: 28px;line-height: 28px;">维度</span>
                  <draggable
                      class="dimensionsContainer"
                      :list="dimensionsFields"
                      :order="false"
                      :move="()=>false"
                      :group="{ name: 'dimensionsContainer', pull: false, put:dimensionsPut}"
                      animation="100"
                      item-key="fieldId"
                      tag="div"
                  >
                    <template #item="{ element }">
                      <div class="field" :id="element.fieldId">
                        <span   class="field-label" v-if="element.fieldType2 == 'Number'">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span  class="field-label"  v-else-if="element.fieldType2 == 'Time'" >
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span   class="field-label" v-else >
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeDimensionsById(element.fieldId)" size="small"
                                  class="close-btn">
                          <template #icon> <CloseOutlined /></template>
                        </a-button>
                      </div>
                    </template>
                  </draggable>
                </div>

                <div class="metrics">
                  <span style="font-size: 12px;padding: 0 6px;height: 28px;line-height: 28px">指标</span>
                  <draggable
                      class="metricsContainer"
                      :list="metricsFields"
                      :order="false"
                      :group="{ name: 'metricsContainer', pull: false, put:metricsPut}"
                      animation="100"
                      item-key="fieldId"
                      tag="div"
                  >
                    <template #item="{ element }">
                      <div class="field" :id="element.fieldId">
                        <span class="field-label" v-if="element.fieldType2 == 'Number'">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else-if="element.fieldType2 == 'Time'" >
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else >
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeMetricsById(element.fieldId)" size="small" class="close-btn" >
                          <template #icon> <CloseOutlined /></template>
                        </a-button>
                      </div>
                    </template>
                  </draggable>
                </div>

              </div>
            </a-layout-header>

            <!-- 配置模态框 中间 图表渲染区域-->
            <a-layout-content
              :style="{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                border: '1px solid black',
              }"
            >
              <div
                id="tempChartContainer"
                ref="tempChartContainer"
                :style="{ height: '100%' }"
              ></div>
            </a-layout-content>
          </a-layout>

          <!-- 配置模态框 右侧 图表各类配置区域-->
          <a-layout-sider
            :style="{
              height: '100%',
              maxHeight: '100%',
              backgroundColor: 'transparent',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
              overflowY: 'auto', // abc todo
            }"
            width="240px"
            class="viewConfig verticalScrollBar"
          >
            <BarConfig v-if="lastChartType == 'barChart'"
              :getChartConfig="getTempChart"
              :setChartConfig="setTempChart"
              :clearCurrentConfig="clearCurrentConfig"
              :chartOption="tempChartOption"
              :chartContainer="tempChartContainer"
            ></BarConfig>

            <PieConfig v-else-if="lastChartType == 'pieChart'"
                       :getChartConfig="getTempChart"
                       :setChartConfig="setTempChart"
                       :clearCurrentConfig="clearCurrentConfig"
                       :chartOption="tempChartOption"
                       :chartContainer="tempChartContainer">

            </PieConfig>
          </a-layout-sider>
        </a-layout>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>

/*ant-collapse 折叠区域 去掉自带样式*/

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


/*左侧 柱状图、折线图、等图标*/

.diagramContainer .diagramTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

/*左侧 输入框、下拉选择框过滤器，等图标*/
.filterContainer .filterTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

/*中间 各种图表渲染区域*/
.allChartContainer .chart {
  border: black 1px solid;
  margin: 1px;
}

/*模态框全屏样式*/

:global(.full-modal .ant-modal) {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
  overflow: hidden;
}

:global(.full-modal .ant-modal-content) {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  padding: 20px 0 20px 0;
  overflow: hidden;
}

:global(.full-modal .ant-modal-body) {
  flex: 1;
  overflow: hidden;
}

.chart-group {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}

/*左侧字段区域*/
.chart-group .fieldsContainer {
  max-height: 100%;
  width: 100%;
  background-color: transparent;
}

.chart-group .fieldsContainer .field {
  width: 100%;
  height: 30px;
  border-radius: 4px;
}

.chart-group .fieldsContainer .field:hover {
  border-radius: 4px;
  background-color: #85c647;
  cursor: move;
  transition: transform 0.1s ease; /*, font-size 0.4s ease*/
  transform: scale(1.2);
  color: #ffffff;
}

.chart-group .fieldsContainer .field .field-label {
  padding-left: 2px;
  line-height: 30px;
  height: 30px;
}

/* 维度和指标配置*/

.fieldsDimensionsAndMetrics {
  height: 100%;
  width: 100%;
  background-color: #6fd845;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fieldsDimensionsAndMetrics .dimensions,
.fieldsDimensionsAndMetrics .metrics {
  width: 100%;
  height: 50%;
  max-height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.fieldsDimensionsAndMetrics .dimensions{
  background-color: #1890ff;
  border: 1px solid black;
}

.fieldsDimensionsAndMetrics .metrics {
  background-color: #efb056;
  border: 1px solid black;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer,
.fieldsDimensionsAndMetrics .metrics .metricsContainer {
  height: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  background-color: white;
  width: calc(100% - 36px);
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field ,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field {
  display: flex;
  align-items: center;
  margin: 1px 2px;
  padding-right: 24px;

  position: relative;

  border: black 1px solid;
  background-color: #ff4218;
  border-radius: 4px 2px 4px 4px;
}
.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field:hover ,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field:hover {
  transition: transform 0.1s ease;
  transform: scale(1.2);
  z-index: 1;
}


.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field .field-label,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field .field-label {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  padding: 0 10px;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field:hover .close-btn,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field:hover .close-btn {
  display: inline-block;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field .close-btn,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field .close-btn {
  display: none;
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 8px;
  width: 12px;
  height: 12px;
  line-height: 12px;
  border-radius: 0;

  background-color: transparent;

  position: absolute;
  top: 0;
  right: 2px;
}


</style>
