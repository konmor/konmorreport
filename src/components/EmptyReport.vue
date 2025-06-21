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
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import Filter from '@/components/Filter.vue'
import {getUuid} from 'ant-design-vue/es/vc-notification/HookNotification'
import * as echarts from 'echarts'
import {chartTemplate} from '@/composable/ChartTemplate.ts'
import useNavigator from '@/composable/useNavigator.ts'
import type {EChartsType} from 'echarts'
import type {ECBasicOption} from 'echarts/types/dist/shared'
import BarConfig from '@/components/chart/BarConfig.vue'
import {sqlQueryData} from '@/api/sql.ts'
import type {SQLQuery, SQLResultField} from '@/types/api.ts';
import {FieldStringOutlined, FieldNumberOutlined, FieldTimeOutlined, CloseOutlined} from '@ant-design/icons-vue'
import PieConfig from "@/components/chart/PieConfig.vue";
import LineConfig from '@/components/chart/LineConfig.vue'
import ScatterConfig from "@/components/chart/ScatterConfig.vue";
import RadarConfig from "@/components/chart/RadarConfig.vue";
import GaugeConfig from "@/components/chart/GaugeConfig.vue";
import Resize from "@/assets/icon/Resize.vue";

const items = reactive<{ value: number | any; id: string; xSpan?: number; ySpan?: number }[]>([
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 9,
    ySpan: 5,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'scatter',
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
    value: 'pieChart',
    id: getUuid(),
    xSpan: 4,
    ySpan: 4,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 3,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 'pieChart',
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

const {sqlArray, refreshDatasourceList, findSourceIdBySQLID} = useNavigator()
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

let tempObserver: ResizeObserver

const getTempChart = () => {
  return tempChart
}
const setTempChart = (value: EChartsType) => {
  if (tempChart && !tempChart.isDisposed()) {
    tempChart.dispose()
  }

  if (tempObserver != null) {
    tempObserver.disconnect()
  }

  // 重新绑定页面大小变化 resizeObserve
  tempChart = value;

  tempObserver = new ResizeObserver((entries:any) => {
    if (tempChart) tempChart.resize()
  });
  tempObserver.observe(tempChartContainer.value as Element)

}


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
    newEchartsInstance.setOption(chartTemplate('test2', lastChartType.value));

    // 放入allChartsInstance容器中
    allChartsInstance.push(newEchartsInstance)

    let observer = new ResizeObserver((entries:any) => {

      if (newEchartsInstance) newEchartsInstance.resize()
    })
    observer.observe(newContainer as Element)
    allResizeObserver.push(observer);
  }
}

// 维度
let dimensions: Array<string> = []

let tempChartOption = ref<ECBasicOption>({});

let allFields = ref<SQLResultField[]>([])
let allData = reactive<Array<Map<string, object>>>([])

const clearCurrentConfig = () => {
  metricsFields.length = 0;
  dimensionsFields.length = 0;

  lastChartType.value = '';
  lastEchartsContainerID = '';
  lastSQLId = '';

  tempChart.dispose();
  tempChart.clear();
  // 清空tempChartOption的属性
  tempChartOption.value = {};
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

function dimensionsPut(to: any, from: any, htmlElement: any, dragEvent: any): boolean {
  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value => {
    return value.fieldId == htmlElement.id
  }) == undefined
  let notExistMetrics = metricsFields.find(value => {
    return value.fieldId == htmlElement.id
  }) == undefined;
  return notExistDimensions && notExistMetrics;
}

function metricsPut(to: any, from: any, htmlElement: any, dragEvent: any): boolean {

  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value => {
    return value.fieldId == htmlElement.id
  }) == undefined
  let notExistMetrics = metricsFields.find(value => {
    return value.fieldId == htmlElement.id
  }) == undefined;
  let isNumber = allFields.value.find(value => {
    return value.fieldId == htmlElement.id
  })?.fieldType2 == 'Number'
  return notExistDimensions && notExistMetrics && isNumber;
}

const removeDimensionsById = (id: string) => {
  if (id != null && id != '') {
    let index = dimensionsFields.findIndex(value => {
      return value.fieldId == id
    });
    if (index > -1) {
      // 删除
      dimensionsFields.splice(index, 1);
    }
  }
}

const removeMetricsById = (id: string) => {
  if (id != null && id != '') {
    let index = metricsFields.findIndex(value => {
      return value.fieldId == id
    });
    if (index > -1) {
      // 删除
      metricsFields.splice(index, 1);
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
      tempChartOption.value = chartTemplate('标题1', lastChartType.value);
      // Object.assign(tempChartOption,chartTemplate('标题1',lastChartType.value));

      // 查询数据拿到字段和数据
      let sqlQuery: SQLQuery = {
        sourceId: findSourceIdBySQLID(lastSQLId)!,
        sqlId: lastSQLId,
        queryBySQLContent: false,
        pageInfo: {page: 1, size: 5000, total: 0},
      }

      sqlQueryData(sqlQuery).then((response) => {
        // 访问正常
        if (response.code == 0) {
          allFields.value = response.data.columns;
          // for (let i = 0; i < response.data.columns.length; i++) {
          //   allFields[i] = response.data.columns[i]
          // }
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
        newEchartsInstance.setOption(tempChartOption.value);

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
  data: [{label: '测试选项-1', value: 'key1'}],
  showError: false,
})

onMounted(() => {
  // 渲染图表
  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    let ecBasicOption = chartTemplate('test1', items[i].value);

    myEcharts.setOption(ecBasicOption);

    allChartsInstance.push(myEcharts)
    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize();
    })
    observer.observe(container as Element)
    allResizeObserver.push(observer)
  }
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
            // @ts-ignore
            return {value: item?.key, label: item?.label}
          })
          : [{label: '测试选项-1', value: 'key1'}]
})

watch(
    () => sqlSelectorModal.selected,
    (value) => {
      lastSQLId = value
    },
)


function getMapData(data: Map<string, object>, keys: string[]): Array<object> {
  let arr = [];
  for (let i = 0; i < keys.length; i++) {
    // @ts-ignore
    let newVar = data[keys[i]];
    if (newVar) {
      arr[i] = newVar;
    }
  }

  return arr;
}

function renderBarChart() {
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
  tempChartOption.value.dataset = option.dataset;
  tempChartOption.value.series = option.series

  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series']
  });
}

function renderPieChart() {
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
        name: metricsFields[i].fieldAlias,
        type: 'pie',
        // 是否顺时针排布饼图，
        clockwise: false,
        // 开始角度
        startAngle: 90,
        // 结束角度为自动
        endAngle: 'auto',
        padAngle: 0.5,
        encode: {
          itemName: dimensions[0],
          value: metricsFields[i].fieldAlias
        },
        selectedMode: true,
        //　分离距离
        selectedOffset: 10,
        roseType: false,
        top: '3%',
        left: '',
        right: '',
        bottom: '',
        label: {
          show: true,
          // outside 、inner | inside 、 center
          position: 'outside',
          formatter: undefined,
          // true | radial  径向排布 \tangential 切向排布 -90 ~ 90
          rotate: 'tangential'
        },
        // 视觉引导线，当 label 在position outside 情况下有用
        labelLine: {
          show: true
        },
        labelLayout: {
          // 是否隐藏重叠的标签。
          hideOverlap: true,
          draggable: true
        },
        itemStyle: {
          // 阴影效果
          shadowBlur: 5,
          shadowOffsetX: 0.5,
          shadowOffsetY: 0.5,
          // 圆角半径
          borderRadius: 5
        },
        emphasis: {
          disabled: false,
          scale: true,
          scaleSize: 5,

          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        // 内圆半径，外圆半径
        radius: [0, '80%'],
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
  tempChartOption.value.dataset = option.dataset;
  tempChartOption.value.series = option.series

  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series', 'dataset']
  });
}

function renderLineChart() {
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
        type: 'line',
        name: dimensions[index],
        // 有可能会有柱状图
        // barMaxWidth: '50',
        // barMinWidth: '1',
        stack: 'group' + index,
        /**
         * 'samesign' 只在要堆叠的值与当前累积的堆叠值具有相同的正负符号时才堆叠。
         * 'all' 堆叠所有的值，不管当前或累积的堆叠值的正负符号是什么。
         * 'positive' 只堆积正值。
         * 'negative' 只堆叠负值。
         */
        stackStrategy: 'samesign',
        smooth: false,
        /*areaStyle: {}*/
        label: {
          show: false,
          position: 'top', // top inside insideTop insideBottom
          rotate: 0, // -90 90
        },
        emphasis: {
          disabled: false,
          focus: 'none', // none \ self \ series
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
  tempChartOption.value.dataset = option.dataset;
  tempChartOption.value.series = option.series

  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series']
  });
}

function renderScatter() {
  dimensions.length = 0;
  // 图表渲染
  let option = {
    dataset: {
      dimensions: [] as Array<string>,
      source: [] as Array<Array<object>>,
    },
    series: [{}] as Array<object>,
    xAxis: {} as any,
  };

  // 必须要有维度字段;
  if (dimensionsFields.length > 0) {
    dimensions[0] = dimensionsFields[0].fieldAlias;

    for (let i = 0; i < metricsFields.length; i++) {
      let index = i + 1;
      dimensions[index] = metricsFields[i].fieldAlias;

      option.series[i] = {
        id: index.toString(),
        name: metricsFields[i].fieldAlias,
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 50,
        label: {
          show: false,
          position: 'top',

        },
        itemStyle: {
          opacity: 0.8,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 10
        },
        emphasis: {
          disabled: false,
          focus: 'series',
          // 强调时显示label
          label: {show: true}
        },
        encode: {x: dimensions[0], y: metricsFields[i].fieldAlias, itemName: dimensions[0]}
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
          replaceMerge: ['series', 'dataset'],
        });
    return;
  }
  let source: Array<Array<object>> = allData.map((item) => getMapData(item, dimensions));

  option.dataset.dimensions = dimensions;
  option.dataset.source = source;

  // 设置给变量
  tempChartOption.value.dataset = option.dataset;
  tempChartOption.value.series = option.series

  //
  if (dimensionsFields[0].fieldType2 == 'Number') {
    option.xAxis.type = 'value';
    option.xAxis.boundaryGap = ['5%', '5%'];

    // @ts-ignore
    tempChartOption.value.xAxis.type = 'value';
    // @ts-ignore
    tempChartOption.value.xAxis.boundaryGap = ['5%', '5%'];
  } else if (dimensionsFields[0].fieldType2 == 'Time') {
    option.xAxis.type = 'time';
    option.xAxis.boundaryGap = true;

    // @ts-ignore
    tempChartOption.value.xAxis.type = 'time';
    // @ts-ignore
    tempChartOption.value.xAxis.boundaryGap = ['5%', '5%'];
  } else {
    option.xAxis.type = 'category';
    option.xAxis.boundaryGap = true;

    // @ts-ignore
    tempChartOption.value.xAxis.type = 'category';
    // @ts-ignore
    tempChartOption.value.xAxis.boundaryGap = true;
  }
  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series', 'dataset'],
  });


}

function getRadarData(dimensions: string[]):
    { indicator: Array<string>, data: Array<{ name: string, data: Array<any> }> } {

  let result: { indicator: Array<string>, data: Array<{ name: string, data: Array<any> }> } = {
    indicator: [], data: []
  };
  // Array<Map<string, object>>

  let d = new Array(dimensions.length - 1) as Array<Array<object>>;
  for (let i = 0; i < d.length; i++) {
    d[i] = new Array(allData.length);
  }

  for (let i = 0; i < allData.length; i++) {
    let item = allData[i];

    // @ts-ignore
    result.indicator.push(item[dimensions[0]]);

    for (let j = 1; j < dimensions.length; j++) {

      // @ts-ignore
      d[j - 1][i] = item[dimensions[j]];
    }
  }

  for (let i = 0; i < d.length; i++) {
    result.data.push({
      name: dimensions[i + 1], data: d[i]
    })
  }

  return result;
}

function renderRadar() {

  dimensions.length = 0;
  // 图表渲染
  let option = {
    radar: {
      indicator: [] as Array<any>
    },
    series: {
      name: '' as string,
      type: 'radar',
      data: [] as Array<any>,
    },
  };

  // 必须要有维度字段;
  if (dimensionsFields.length > 0) {
    dimensions[0] = dimensionsFields[0].fieldAlias;

    for (let i = 0; i < metricsFields.length; i++) {
      let index = i + 1;
      dimensions[index] = metricsFields[i].fieldAlias;
    }
  }

  // 必须要有至少两个字段，其中一个必须为维度字段
  if (dimensions.length < 2) {
    tempChart.setOption(
        option,
        {
          replaceMerge: ['series']
        });
    return;
  }

  let source: { indicator: Array<string>, data: Array<{ name: string, data: Array<any> }> } =
      getRadarData(dimensions);

  for (let i = 0; i < source.indicator.length; i++) {
    if (i == 0) {
      option.radar.indicator[i] = {
        name: source.indicator[i],
        axisLine: {
          // 坐标轴线
          show: true,
          // arrow none
          symbol: 'none',
        },
        // 刻度标记
        axisTick: {
          show: false,
        },
        // 刻度标签 刻度值
        axisLabel: {show: false},
      }
    } else {
      option.radar.indicator[i] = {name: source.indicator[i]};
    }
  }

  option.series.name = dimensions[0];

  for (let i = 0; i < source.data.length; i++) {
    option.series.data[i] = {

      // 该id 属性不是echarts的自有属性，仅用于调整配置时修改数据
      id: i.toString(),
      value: source.data[i].data,
      name: source.data[i].name,

      symbol: 'circle',
      symbolSize: 8,
      // 数值标签
      label: {
        show: false,
        position: 'top',
      },
      lineStyle: {
        // solid dotted dashed
        type: 'solid',
      },
      areaStyle: null,
      emphasis: {
        disabled: false,
        focus: 'self',
      },
    }
  }

  // @ts-ignore 设置给变量
  tempChartOption.value.radar.indicator = option.radar.indicator;
  tempChartOption.value.series = option.series

  // 设置图标配置
  tempChart.setOption(option, {
    replaceMerge: ['series']
  });

}

function getGaugeData(dimensions: Array<string>): Array<{ name: string, value: object }> {

  let gauge: Array<{ name: string, value: object }> = [];
  // Array<Map<string, object>>
  for (let j = 0; j < dimensions.length; j++) {
    let value = allData[0][dimensions[j]];

    gauge[j] = {
      name: dimensions[j],
      value: value != undefined ? value : null,
    };
  }
  return gauge;
}

function renderGauge() {

  dimensions.length = 0;
  // 图表渲染
  let option = {
    series: {
      id: '1',
      type: 'gauge',
      max: 200,
      data: [] as Array<any>,
    },
  };

  // 仅仅指标字段
  if (metricsFields.length > 0) {
    for (let i = 0; i < metricsFields.length; i++) {
      dimensions[i] = metricsFields[i].fieldAlias;
    }
  }

  if (dimensions.length < 1) {
    // 设置空数组
    tempChart.setOption(option);
    return;
  }


  let source: Array<{ name: string, value: object }> = getGaugeData(dimensions);

  // 获取最大值
  let max = source[0].value;

  if(source.length>1){
    for (let i = 1; i < source.length; i++) {
      let value = source[i].value;

      if(source[i].value > max) {
        max = value;
      }
    }
  }
  // @ts-ignore
  max = 1.25 * max;
  option.series.max = parseFloat(max.toString());
  // @ts-ignore
  tempChartOption.value.series.max = parseFloat(max.toString());

  for (let i = 0; i < source.length; i++) {
    // id:i.toString(), 并非echarts需要的id，为了唯一区分，我加上的字段
    option.series.data[i] =
        {
          id: i.toString(),
          name: source[i].name,
          value: source[i].value,
          title: {
            show: false,
            fontSize: 16,
            overflow: 'truncate',
            ellipsis: '…',
            width: 64,
            offsetCenter: ['0', '0']
          },
          detail: {
            show: false,
            fontSize: 16,
            overflow: 'truncate',
            ellipsis: '…',
            width: 64,
            offsetCenter: ['0', '0']
          }
        }
  }

  // @ts-ignore 设置给变量
  tempChartOption.value.series.data = option.series.data;
  // 设置图标配置
  tempChart.setOption(option);
}

function renderChart() {
  if (lastChartType.value == 'barChart') {
    renderBarChart();
  } else if (lastChartType.value == 'pieChart') {
    renderPieChart();
  } else if (lastChartType.value == 'lineChart') {
    renderLineChart();
  } else if (lastChartType.value == 'scatter') {
    renderScatter();
  } else if (lastChartType.value == 'radar') {
    renderRadar()
  } else if (lastChartType.value == 'gauge') {
    renderGauge()
  }
}

// 监听字段的变化去渲染数据
watch(dimensionsFields, renderChart);

// 监听字段的变化去渲染数据
watch(metricsFields,
    renderChart
)
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
        <Diagram/>
      </div>

      <div class="filterContainer">
        <span class="filterTitle">过滤器</span>
        <Filter/>
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
          <CloseCircleOutlined :style="{ color: 'red' }"/>
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

              :style="{
              gridRowStart: `span ${element.xSpan}`,
              gridColumnStart: `span ${element.ySpan}`,
              position:'relative',
              // resize:'none',
              // overflow:'hidden',
              /*cursor:'nw-resize',*/
              /*backgroundColor: generateRandomBrightColor(),*/
            }"
              class="chart"
              @click="
              () => {
               /* element.xSpan++
                element.ySpan++*/
              }
            "
          >
            <div :id="element.id" style="height: 100%;width: 100%">

            </div>

            <div class="chart-resize">
              <Resize/>
            </div>
          </div>
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
                          <FieldNumberOutlined :style="{ color: '#6fd845' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else-if="element.fieldType2 == 'Time'" class="field-label">
                          <FieldTimeOutlined :style="{ color: '#1890ff' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else class="field-label">
                          <FieldStringOutlined :style="{ color: '#efb056' }"/>
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
                        <span class="field-label" v-if="element.fieldType2 == 'Number'">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else-if="element.fieldType2 == 'Time'">
                          <FieldTimeOutlined :style="{ color: '#1890ff' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else>
                          <FieldStringOutlined :style="{ color: '#efb056' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeDimensionsById(element.fieldId)" size="small"
                                  class="close-btn">
                          <template #icon>
                            <CloseOutlined/>
                          </template>
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
                          <FieldNumberOutlined :style="{ color: '#6fd845' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else-if="element.fieldType2 == 'Time'">
                          <FieldTimeOutlined :style="{ color: '#1890ff' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else>
                          <FieldStringOutlined :style="{ color: '#efb056' }"/>
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeMetricsById(element.fieldId)" size="small" class="close-btn">
                          <template #icon>
                            <CloseOutlined/>
                          </template>
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

            <LineConfig v-else-if="lastChartType == 'lineChart'"
                        :getChartConfig="getTempChart"
                        :setChartConfig="setTempChart"
                        :clearCurrentConfig="clearCurrentConfig"
                        :chartOption="tempChartOption"
                        :chartContainer="tempChartContainer">

            </LineConfig>

            <ScatterConfig v-else-if="lastChartType == 'scatter'"
                           :getChartConfig="getTempChart"
                           :setChartConfig="setTempChart"
                           :clearCurrentConfig="clearCurrentConfig"
                           :chartOption="tempChartOption"
                           :chartContainer="tempChartContainer">

            </ScatterConfig>

            <RadarConfig v-else-if="lastChartType == 'radar'"
                         :getChartConfig="getTempChart"
                         :setChartConfig="setTempChart"
                         :clearCurrentConfig="clearCurrentConfig"
                         :chartOption="tempChartOption"
                         :chartContainer="tempChartContainer">

            </RadarConfig>

            <GaugeConfig v-else-if="lastChartType == 'gauge'"
                         :getChartConfig="getTempChart"
                         :setChartConfig="setTempChart"
                         :clearCurrentConfig="clearCurrentConfig"
                         :chartOption="tempChartOption"
                         :chartContainer="tempChartContainer">

            </GaugeConfig>

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

 .allChartContainer .chart .chart-resize {
   position: absolute;
   display: none;
   bottom: 0;
   right: 0;
 }

.allChartContainer .chart:hover .chart-resize{
  display: inline-block;
}

.allChartContainer .chart .chart-resize:hover {
 cursor: nw-resize;
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

.fieldsDimensionsAndMetrics .dimensions {
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

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field,
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

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field:hover,
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
